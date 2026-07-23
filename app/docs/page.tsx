'use client'

import { useState } from 'react'
import AppLayout from '@/app/components/AppLayout'

const sections = [
  { id: 'overview', title: 'Overview' },
  { id: 'architecture', title: 'Architecture' },
  { id: 'features', title: 'Features' },
  { id: 'user-flow', title: 'User Flow' },
  { id: 'assets', title: 'Supported Assets' },
  { id: 'faq', title: 'FAQ' },
]

const S = {
  h3: { color: 'var(--text-heading)', fontSize: '0.95rem', fontWeight: 700, marginTop: '28px', marginBottom: '10px' } as React.CSSProperties,
  p:  { color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: '12px' } as React.CSSProperties,
  li: { color: 'var(--text-secondary)', lineHeight: '1.85' } as React.CSSProperties,
  code: { background: 'var(--bg-input)', color: 'var(--purple)', padding: '2px 7px', borderRadius: '5px', fontSize: '0.8rem', fontFamily: 'monospace' } as React.CSSProperties,
  tag: { display: 'inline-block', background: 'var(--purple-ghost)', color: 'var(--purple)', border: '1px solid var(--purple-ghost-border)', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, padding: '1px 8px', marginRight: '6px' } as React.CSSProperties,
  divider: { borderTop: '1px solid var(--border)', margin: '24px 0' } as React.CSSProperties,
}

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>📚 Documentation</h1>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>Platform guide and reference</p>
        </div>

        <div className="flex gap-4" style={{ minHeight: '70vh' }}>
          {/* ── Content card ── */}
          <div className="min-w-0" style={{ flex: '1 1 0%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.5rem', overflowY: 'auto', maxHeight: 'calc(100vh - 160px)' }}>

            <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--text-heading)' }}>
              {sections.find((s) => s.id === activeSection)?.title}
            </h2>
            <div style={S.divider} />

            {/* ── Overview ── */}
            {activeSection === 'overview' && (
              <div>
                <p style={S.p}>
                  <strong style={{ color: 'var(--text-primary)' }}>Meridex</strong> is a non-custodial Web3 payment platform built on the Arc Testnet. It lets you swap stablecoins, send tokens peer-to-peer, and monitor your on-chain portfolio — all without leaving a single interface.
                </p>
                <p style={S.p}>
                  The platform is powered by <strong style={{ color: 'var(--text-primary)' }}>Circle AppKit</strong> for transaction execution, <strong style={{ color: 'var(--text-primary)' }}>RainbowKit</strong> for wallet connectivity, and <strong style={{ color: 'var(--text-primary)' }}>Supabase</strong> for off-chain transaction indexing. Every on-chain event is verifiable via the ArcScan block explorer.
                </p>
                <h3 style={S.h3}>Why Meridex?</h3>
                <ul style={{ paddingLeft: '20px', marginBottom: '12px' }}>
                  <li style={S.li}>Single dashboard for swaps, transfers, and portfolio tracking</li>
                  <li style={S.li}>Non-custodial — your keys, your funds at all times</li>
                  <li style={S.li}>Real-time on-chain data with no third-party middleware</li>
                  <li style={S.li}>Clean, developer-friendly architecture built on Next.js 16</li>
                </ul>
                <h3 style={S.h3}>Tech Stack</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                  {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'wagmi v2', 'viem', 'RainbowKit', 'Circle AppKit', 'Supabase', 'Arc Testnet'].map(t => (
                    <span key={t} style={S.tag}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* ── Architecture ── */}
            {activeSection === 'architecture' && (
              <div>
                <p style={S.p}>
                  Meridex follows a client-first architecture. All blockchain interactions happen directly from the user's browser via their connected wallet — there is no backend server holding private keys or proxying transactions.
                </p>
                <h3 style={S.h3}>Layer Overview</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>Layer</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>Technology</th>
                        <th style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>Responsibility</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['UI',         'Next.js 16 / React 19',        'Page rendering, routing, component state'],
                        ['Wallet',     'RainbowKit + wagmi v2',         'Wallet connection, chain switching, balance reads'],
                        ['Execution',  'Circle AppKit',                  'Token send & swap transaction building and signing'],
                        ['Chain',      'viem + Arc Testnet RPC',         'On-chain calls, contract reads, tx broadcasting'],
                        ['Indexing',   'Supabase (PostgreSQL)',           'Off-chain transaction history storage and retrieval'],
                        ['Explorer',   'ArcScan (Blockscout v2 API)',     'Transaction verification and token transfer lookup'],
                      ].map(([layer, tech, resp]) => (
                        <tr key={layer} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 14px', color: 'var(--text-primary)', whiteSpace: 'nowrap', fontWeight: 600 }}>{layer}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--purple)', fontFamily: 'monospace', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>{tech}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{resp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h3 style={S.h3}>Data Flow</h3>
                <ol style={{ paddingLeft: '20px', marginBottom: '12px' }}>
                  <li style={S.li}>User connects wallet → RainbowKit handles provider injection and chain validation</li>
                  <li style={S.li}>User initiates action (swap / send) → Circle AppKit builds and signs the transaction</li>
                  <li style={S.li}>Signed tx is broadcast to Arc Testnet via viem public client</li>
                  <li style={S.li}>On success, a record is written to Supabase <code style={S.code}>transactions</code> table</li>
                  <li style={S.li}>History page fetches from Supabase and renders the indexed records</li>
                </ol>
              </div>
            )}

            {/* ── Features ── */}
            {activeSection === 'features' && (
              <div>
                {[
                  {
                    icon: '💼', title: 'Portfolio',
                    desc: 'The landing page displays real-time token balances fetched directly from the Arc Testnet RPC. Supported tokens include USDC, EURC, and cirBTC. Quick-action buttons provide one-click access to Send and Swap.',
                    notes: ['Balances refresh on wallet connection', 'No backend required — reads from chain directly'],
                  },
                  {
                    icon: '⇄', title: 'Swap',
                    desc: 'Token swaps are executed via Circle AppKit. An auto-quote fires 600ms after the user stops typing, displaying the estimated output amount, minimum received (stop-limit), and fee breakdown before confirmation.',
                    notes: ['Auto-quote with 600ms debounce', 'Displays rate, min received, and fees', 'Swap history saved to Supabase on success'],
                  },
                  {
                    icon: '↗', title: 'Send',
                    desc: 'Transfer USDC, EURC, or cirBTC to any valid EVM address. The form validates the recipient address in real-time using viem\'s isAddress utility and shows the current token balance before submission.',
                    notes: ['Real-time address validation', 'Token selector with balance display', 'Transaction saved to history on success'],
                  },
                  {
                    icon: '📜', title: 'History',
                    desc: 'Displays all indexed transactions associated with the connected wallet, fetched from Supabase. Supports filtering by direction (sent / received) and type (send / swap), with pagination at 5 records per page.',
                    notes: ['Filter by direction and transaction type', 'Paginated — 5 records per page', 'ArcScan explorer link for every transaction'],
                  },
                ].map((f) => (
                  <div key={f.title} style={{ marginBottom: '32px' }}>
                    <h3 style={{ ...S.h3, marginTop: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{f.icon}</span> {f.title}
                    </h3>
                    <p style={S.p}>{f.desc}</p>
                    <ul style={{ paddingLeft: '18px', marginTop: '4px' }}>
                      {f.notes.map(n => <li key={n} style={{ ...S.li, fontSize: '0.82rem' }}>— {n}</li>)}
                    </ul>
                    <div style={S.divider} />
                  </div>
                ))}
              </div>
            )}

            {/* ── User Flow ── */}
            {activeSection === 'user-flow' && (
              <div>
                <p style={S.p}>The typical user journey from wallet connection to completed transaction:</p>
                <ol style={{ paddingLeft: '22px' }}>
                  {[
                    ['Connect Wallet', 'Click "Cüzdanı Bağla" in the sidebar footer. Select your wallet provider (MetaMask, WalletConnect, Coinbase Wallet, etc.). If prompted, switch to Arc Testnet.'],
                    ['View Portfolio', 'The Portfolio page loads your USDC, EURC, and cirBTC balances automatically from the chain.'],
                    ['Swap Tokens', 'Navigate to Swap. Select input and output tokens, enter an amount. A quote appears automatically. Click "Swap" to confirm and sign in your wallet.'],
                    ['Send Tokens', 'Navigate to Send. Choose a token, enter a recipient address and amount. Click "Send" to confirm and sign.'],
                    ['Check History', 'Navigate to History to view all indexed transactions with timestamps, amounts, and ArcScan explorer links.'],
                  ].map(([step, detail], i) => (
                    <li key={step} style={{ ...S.li, marginBottom: '18px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{i + 1}. {step}</strong>
                      <p style={{ ...S.p, marginTop: '4px', marginBottom: 0 }}>{detail}</p>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* ── Assets ── */}
            {activeSection === 'assets' && (
              <div>
                <p style={S.p}>Meridex currently supports three tokens on Arc Testnet. All assets use the ERC-20 standard and are bridged or issued by Circle.</p>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)' }}>
                        {['Token', 'Full Name', 'Decimals', 'Contract Address', 'Notes'].map(h => (
                          <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['USDC',   'USD Coin',        '6', '0x3600...0000', 'Primary transaction currency'],
                        ['EURC',   'Euro Coin',        '6', '0x89B5...972a', 'Euro-denominated stablecoin'],
                        ['cirBTC', 'Circle Bitcoin',   '8', '0xf0C4...432B', 'BTC-pegged representative asset'],
                      ].map(([sym, name, dec, addr, note]) => (
                        <tr key={sym} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '10px 14px', color: 'var(--purple)', fontWeight: 700 }}>{sym}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--text-primary)' }}>{name}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', textAlign: 'center' }}>{dec}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '0.78rem' }}>{addr}</td>
                          <td style={{ padding: '10px 14px', color: 'var(--text-secondary)' }}>{note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h3 style={S.h3}>Adding Arc Testnet to Your Wallet</h3>
                <p style={S.p}>Meridex will automatically prompt you to add the network if it is not already configured. Alternatively, you can add it manually:</p>
                <ul style={{ paddingLeft: '18px' }}>
                  {[
                    ['Network Name', 'Arc Testnet'],
                    ['Chain ID', '5042002'],
                    ['RPC URL', 'https://rpc.testnet.arc.network'],
                    ['Explorer', 'https://testnet.arcscan.app'],
                    ['Currency', 'ARC (18 decimals)'],
                  ].map(([k, v]) => (
                    <li key={k} style={{ ...S.li, marginBottom: '4px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>{k}:</strong>{' '}
                      <code style={S.code}>{v}</code>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ── FAQ ── */}
            {activeSection === 'faq' && (
              <div>
                {[
                  {
                    q: 'My wallet is connected but balances show "—". Why?',
                    a: 'You are likely on the wrong network. Click the network indicator in the connect button and switch to Arc Testnet. Meridex will prompt you automatically during a transaction.',
                  },
                  {
                    q: 'I sent a transaction but it does not appear in History.',
                    a: 'History is populated from Supabase, which is written after a successful transaction. If the tx was rejected or failed before broadcast, it will not be recorded. You can always verify directly on ArcScan using your wallet address.',
                  },
                  {
                    q: 'How do I get testnet tokens?',
                    a: 'Arc Testnet tokens can be obtained from the official Arc faucet or by bridging from supported testnets. Check the Arc Network documentation for the current faucet URL.',
                  },
                  {
                    q: 'Is there a transaction fee?',
                    a: 'Swap transactions incur a small protocol fee displayed in the quote breakdown before you confirm. Send transactions only require the native ARC gas fee, which is minimal on testnet.',
                  },
                  {
                    q: 'Can I use Meridex on mobile?',
                    a: 'Yes. The interface is fully responsive. On mobile, use a Web3 browser (e.g., MetaMask Mobile, Coinbase Wallet browser) or connect via WalletConnect from a desktop wallet.',
                  },
                  {
                    q: 'Where can I verify my transactions?',
                    a: 'Every row in the History page includes an "Explorer ↗" link that opens the transaction on ArcScan (testnet.arcscan.app).',
                  },
                ].map(({ q, a }, i) => (
                  <div key={i} style={{ marginBottom: '24px' }}>
                    <h3 style={{ ...S.h3, marginTop: i === 0 ? 0 : '24px' }}>{q}</h3>
                    <p style={{ ...S.p, marginBottom: 0 }}>{a}</p>
                    {i < 5 && <div style={S.divider} />}
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* ── Docs nav — right side, fixed width ── */}
          <div style={{ width: '160px', flexShrink: 0 }}>
            <div className="rounded-xl overflow-hidden sticky top-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-semibold px-3 pt-3 pb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Contents</p>
              <nav className="px-2 pb-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs mb-0.5 transition-colors"
                    style={
                      activeSection === section.id
                        ? { background: 'var(--teal)', color: '#FFFFFF', fontWeight: 600 }
                        : { color: 'var(--text-secondary)' }
                    }
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
