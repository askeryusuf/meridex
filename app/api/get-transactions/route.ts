import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role client — bypasses RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')

  if (!address || !/^0x[0-9a-fA-F]{40}$/i.test(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
  }

  const addr = address.toLowerCase()

  const [{ data: sent, error: sentErr }, { data: received, error: recvErr }] = await Promise.all([
    supabaseAdmin.from('transactions').select('*').eq('sender_address', addr).order('created_at', { ascending: false }),
    supabaseAdmin.from('transactions').select('*').eq('recipient_address', addr).order('created_at', { ascending: false }),
  ])

  if (sentErr || recvErr) {
    console.error('[get-transactions]', sentErr?.message ?? recvErr?.message)
    return NextResponse.json({ error: sentErr?.message ?? recvErr?.message }, { status: 500 })
  }

  // Swap kayıtlarında sender = recipient = kendi adresi olduğu için
  // received sorgusundan swap'ları çıkar — aksi halde her swap 2x sayılır
  const sentRows     = sent     ?? []
  const receivedRows = (received ?? []).filter((t: { type: string }) => t.type !== 'swap')

  // Kalan duplikeleri id bazında temizle (güvenlik katmanı)
  const sentIds = new Set(sentRows.map((t: { id: string }) => t.id))
  const dedupedReceived = receivedRows.filter((t: { id: string }) => !sentIds.has(t.id))

  return NextResponse.json({ sent: sentRows, received: dedupedReceived })
}
