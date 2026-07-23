import { NextRequest, NextResponse } from 'next/server'

// Proxies all JSON-RPC requests to Arc Testnet RPC.
// NODE_TLS_REJECT_UNAUTHORIZED=0 is set in next.config.ts, so this
// server-side request bypasses the untrusted intermediate CA on Arc's RPC.

export async function POST(req: NextRequest) {
  const body = await req.text()

  // Retry once on 429 with a short backoff
  for (let attempt = 0; attempt < 2; attempt++) {
    if (attempt > 0) await new Promise(r => setTimeout(r, 1000))

    const res = await fetch('https://rpc.testnet.arc.network', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    })

    if (res.status === 429 && attempt === 0) continue

    const text = await res.text()
    return new NextResponse(text, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  return NextResponse.json({ error: 'RPC rate limit exceeded' }, { status: 429 })
}
