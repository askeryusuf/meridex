import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role client — bypasses RLS, only used server-side
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const VALID_TYPES = ['send', 'invoice', 'gift', 'payroll', 'swap'] as const
type TxType = typeof VALID_TYPES[number]

function isValidAddress(addr: unknown): addr is string {
  return typeof addr === 'string' && /^0x[0-9a-fA-F]{40}$/.test(addr)
}

export async function POST(req: NextRequest) {
  try {
    const { sender, recipient, amount, txHash, type } = await req.json()

    if (!sender || !recipient || !amount || !txHash || !type) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    if (!isValidAddress(sender)) {
      return NextResponse.json({ error: 'Invalid sender address' }, { status: 400 })
    }

    if (!isValidAddress(recipient)) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 })
    }

    if (!(VALID_TYPES as readonly string[]).includes(type)) {
      return NextResponse.json({ error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` }, { status: 400 })
    }

    const numAmount = Number(amount)
    if (isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: 'Amount must be a positive number' }, { status: 400 })
    }

    const { error } = await supabaseAdmin.from('transactions').insert({
      sender_address:    sender.toLowerCase(),
      recipient_address: recipient.toLowerCase(),
      amount:            numAmount,
      tx_hash:           txHash,
      type:              type as TxType,
    })

    if (error) {
      console.error('[save-transaction]', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[save-transaction]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
