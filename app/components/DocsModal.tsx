'use client'

import { useState } from 'react'

interface DocsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DocsModal({ isOpen, onClose }: DocsModalProps) {
  const [activeSection, setActiveSection] = useState('overview')

  if (!isOpen) return null

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'architecture', title: 'Architecture Summary' },
    { id: 'features', title: 'Features' },
    { id: 'user-flow', title: 'User Flow' },
    { id: 'assets', title: 'Supported Assets' },
    { id: 'faq', title: 'FAQ' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay)' }}>
      <div className="w-full max-w-5xl h-[80vh] flex rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        {/* Sidebar */}
        <div className="w-64 overflow-y-auto" style={{ background: 'var(--bg-base)', borderRight: '1px solid var(--border)' }}>
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--text-heading)' }}>📚 Meridex Docs</h2>
          </div>
          <nav className="p-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors"
                style={
                  activeSection === section.id
                    ? { background: 'var(--teal)', color: '#FFFFFF' }
                    : { color: 'var(--text-secondary)' }
                }
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>
              {sections.find((s) => s.id === activeSection)?.title}
            </h1>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="prose prose-sm max-w-none docs-content">
              {activeSection === 'overview' && (
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '20px' }}>
                    A stablecoin DeFi interface for swapping and sending tokens on Arc Testnet.
                  </p>
                  
                  <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Meridex</strong> is a Web3 DeFi application that enables users to swap and send stablecoins (USDC, EURC, cirBTC) on Arc Testnet, powered by Circle AppKit. All transactions are non-custodial, executed on-chain, and indexed in Supabase for a full transaction history.
                  </p>

                  <h3 style={{ color: 'var(--text-heading)', marginTop: '24px', marginBottom: '12px' }}>Core Value Proposition:</h3>
                  <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    <li>Fast, non-custodial token swaps with live quotes and fee breakdown</li>
                    <li>Simple token transfers to any EVM address with real-time validation</li>
                    <li>Full transaction history with ArcScan explorer links</li>
                  </ul>
                </div>
              )}

              {activeSection === 'architecture' && (
                <div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                          <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-primary)', fontWeight: '600' }}>Layer</th>
                          <th style={{ padding: '12px', textAlign: 'left', color: 'var(--text-primary)', fontWeight: '600' }}>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px', color: 'var(--text-primary)' }}>Interface</td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Single-page application (SPA) with left sidebar navigation</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px', color: 'var(--text-primary)' }}>Wallet Connection</td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Web3 wallet integration via "Connect Wallet" button</td>
                        </tr>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '12px', color: 'var(--text-primary)' }}>Assets</td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>Stablecoins/tokens such as USDC, EURC, cirBTC</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '12px', color: 'var(--text-primary)' }}>Network</td>
                          <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>On-chain transactions, each transaction verifiable via block explorer link</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeSection === 'features' && (
                <div>
                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ color: 'var(--text-heading)', marginBottom: '12px' }}>⇄ Token Swap</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Swap between USDC, EURC, and cirBTC with real-time quotes.
                    </p>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                      <li>Auto-quote with 600ms debounce — no manual quote button needed</li>
                      <li>Shows estimated output, stop-limit, and fee breakdown before confirming</li>
                      <li>50% and MAX shortcut buttons for quick amount selection</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ color: 'var(--text-heading)', marginBottom: '12px' }}>↗ Send</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Transfer any supported token to any EVM address.
                    </p>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                      <li>Real-time address validation (EIP-55 checksum)</li>
                      <li>Live balance display for the selected token</li>
                      <li>Supports USDC, EURC, and cirBTC</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ color: 'var(--text-heading)', marginBottom: '12px' }}>💼 Portfolio</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      View your real-time token balances on Arc Testnet.
                    </p>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                      <li>Balances fetched directly from Arc Testnet RPC</li>
                      <li>Quick links to Send and Swap</li>
                    </ul>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <h3 style={{ color: 'var(--text-heading)', marginBottom: '12px' }}>📜 History</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Lists records of all on-chain activities.
                    </p>
                    <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                      <li>Filtering by direction (sent/received) and type (send/swap)</li>
                      <li>Each record shows type, time, amount, and an ArcScan explorer link</li>
                      <li>Pagination support (5 per page)</li>
                    </ul>
                  </div>
                </div>
              )}

              {activeSection === 'user-flow' && (
                <div>
                  <ol style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '20px' }}>
                    <li>Connect your wallet via "Connect Wallet"</li>
                    <li>View your token balances in <strong>Portfolio</strong></li>
                    <li>Use <strong>Swap</strong> to exchange tokens or <strong>Send</strong> to transfer to another address</li>
                    <li>Every completed transaction is saved to <strong>History</strong> automatically</li>
                    <li>Click the <strong>Explorer</strong> link on any transaction to verify it on ArcScan</li>
                  </ol>
                </div>
              )}

              {activeSection === 'assets' && (
                <div>
                  <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    <li><strong style={{ color: 'var(--text-primary)' }}>USDC</strong> — Primary transaction currency</li>
                    <li><strong style={{ color: 'var(--text-primary)' }}>EURC</strong> — Euro-based stablecoin</li>
                    <li><strong style={{ color: 'var(--text-primary)' }}>cirBTC</strong> — Platform-specific BTC representative asset</li>
                  </ul>
                </div>
              )}

              {activeSection === 'faq' && (
                <div>
                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ color: 'var(--text-heading)', marginBottom: '8px' }}>Where can I see my past transactions?</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      In the <code style={{ background: 'var(--bg-input)', padding: '2px 6px', borderRadius: '4px' }}>History</code> tab, all sends and swaps are listed with filters for direction and type.
                    </p>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ color: 'var(--text-heading)', marginBottom: '8px' }}>Which network does Meridex run on?</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Arc Testnet — an EVM-compatible chain. Make sure your wallet is switched to Arc Testnet before transacting.
                    </p>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ color: 'var(--text-heading)', marginBottom: '8px' }}>How do I verify my transactions?</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      Click the <strong>Explorer</strong> link next to any row in the <code style={{ background: 'var(--bg-input)', padding: '2px 6px', borderRadius: '4px' }}>History</code> tab to open it on ArcScan.
                    </p>
                  </div>

                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '32px', fontSize: '0.875rem' }}>
                    This documentation reflects the current Meridex interface and will be updated as the product evolves.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
