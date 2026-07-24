import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Transaction = {
  id: string
  created_at: string
  sender_address: string
  recipient_address: string
  amount: number
  tx_hash: string
  type: 'send' | 'invoice' | 'gift' | 'payroll' | 'swap'
}

export async function saveTransaction(
  sender: string,
  recipient: string,
  amount: number,
  txHash: string,
  type: Transaction['type']
) {
  try {
    const res = await fetch('/api/save-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sender, recipient, amount, txHash, type }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      console.error('[saveTransaction] API error:', res.status, data)
    }
  } catch (err) {
    console.error('[saveTransaction] fetch failed:', err)
  }
}
