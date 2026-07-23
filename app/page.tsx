import Link from 'next/link'

/* ─── inline styles ───────────────────────────────── */
const S = {
  page: {
    minHeight: '100vh',
    background: 'var(--bg-base)',
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
  } as React.CSSProperties,

  /* grid overlay */
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(123,97,255,0.04) 1px, transparent 1px),' +
      'linear-gradient(90deg, rgba(123,97,255,0.04) 1px, transparent 1px)',
    backgroundSize: '48px 48px',
    pointerEvents: 'none',
    zIndex: 0,
  } as React.CSSProperties,

  /* radial glow top-center */
  glow: {
    position: 'fixed',
    top: '-20%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '900px',
    height: '600px',
    background:
      'radial-gradient(ellipse at center, rgba(123,97,255,0.18) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  } as React.CSSProperties,
}

/* ─── Logo mark (reusable) ───────────────────────── */
function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" fill="none">
      <defs>
        <linearGradient id="lm-bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1A1C3D"/>
          <stop offset="100%" stopColor="#0F1023"/>
        </linearGradient>
        <linearGradient id="lm-a1" x1="60" y1="50" x2="140" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C4B5FD"/>
          <stop offset="100%" stopColor="#7B61FF"/>
        </linearGradient>
        <linearGradient id="lm-a2" x1="140" y1="50" x2="60" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7B61FF"/>
          <stop offset="100%" stopColor="#6247E0"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" rx="44" fill="url(#lm-bg)"/>
      <rect width="200" height="200" rx="44" fill="none" stroke="#2A2D57" strokeWidth="3"/>
      <rect x="8" y="8" width="184" height="184" rx="38" fill="none" stroke="#7B61FF" strokeWidth="0.8" opacity="0.4"/>
      <path d="M 88 52 C 52 52 38 75 38 100 C 38 125 52 148 88 148"
        stroke="url(#lm-a1)" strokeWidth="12" strokeLinecap="round" fill="none"/>
      <path d="M 112 52 C 148 52 162 75 162 100 C 162 125 148 148 112 148"
        stroke="url(#lm-a2)" strokeWidth="12" strokeLinecap="round" fill="none"/>
      <circle cx="100" cy="52" r="8" fill="#9B8AFF"/>
      <circle cx="100" cy="148" r="8" fill="#6247E0"/>
    </svg>
  )
}

/* ─── Stat pill ──────────────────────────────────── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.03em' }}>
        {value}
      </p>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{label}</p>
    </div>
  )
}

/* ─── Feature card ───────────────────────────────── */
function FeatureCard({
  icon, title, desc, tag,
}: { icon: string; title: string; desc: string; tag?: string }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      padding: '28px 24px',
      display: 'flex', flexDirection: 'column', gap: 12,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* top-right glow accent */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 100, height: 100,
        background: 'radial-gradient(circle, rgba(123,97,255,0.12), transparent 70%)',
        pointerEvents: 'none',
      }}/>

      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: 'var(--purple-ghost)',
        border: '1px solid var(--purple-ghost-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.25rem',
      }}>
        {icon}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <p style={{ color: 'var(--text-heading)', fontWeight: 700, fontSize: '0.95rem' }}>{title}</p>
          {tag && (
            <span style={{
              fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.06em',
              background: 'var(--purple-ghost)', color: 'var(--purple)',
              border: '1px solid var(--purple-ghost-border)',
              borderRadius: 4, padding: '1px 6px', textTransform: 'uppercase',
            }}>{tag}</span>
          )}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  )
}

/* ─── Tech badge ─────────────────────────────────── */
function TechBadge({ label }: { label: string }) {
  return (
    <span style={{
      background: 'var(--bg-input)',
      border: '1px solid var(--border)',
      color: 'var(--text-secondary)',
      borderRadius: 8,
      padding: '5px 12px',
      fontSize: '0.75rem',
      fontWeight: 500,
      fontFamily: 'monospace',
    }}>
      {label}
    </span>
  )
}

/* ─── Page ───────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={S.page}>
      {/* Background decorations */}
      <div style={S.grid}/>
      <div style={S.glow}/>

      {/* ── Navbar ─────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px',
        background: 'rgba(15,16,35,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(42,45,87,0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LogoMark size={32}/>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
            Meridex
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <a href="https://docs.arc.network/app-kit/swap" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
            Docs
          </a>
          <a href="https://github.com/askeryusuf/meridex" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
            GitHub
          </a>
          <a href="https://x.com/meridex_app" target="_blank" rel="noopener noreferrer"
            style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
            X
          </a>
          <Link href="/portfolio" style={{
            background: 'linear-gradient(135deg, #7B61FF, #6247E0)',
            color: '#fff', fontSize: '0.85rem', fontWeight: 600,
            padding: '8px 20px', borderRadius: 10, textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(123,97,255,0.35)',
          }}>
            Launch App
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '100px 24px 80px',
      }}>
        {/* Live badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 100, padding: '5px 14px', marginBottom: 32,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%', background: '#22C55E',
            boxShadow: '0 0 6px #22C55E',
            display: 'inline-block',
          }}/>
          <span style={{ color: '#22C55E', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            LIVE ON ARC TESTNET
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(2.8rem, 7vw, 5rem)',
          fontWeight: 800,
          color: 'var(--text-heading)',
          lineHeight: 1.08,
          letterSpacing: '-0.035em',
          maxWidth: 820,
          marginBottom: 24,
        }}>
          The DeFi Interface<br/>
          <span style={{
            background: 'linear-gradient(135deg, #C4B5FD 0%, #7B61FF 50%, #6247E0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Built for Stablecoins
          </span>
        </h1>

        {/* Subtitle */}
        <p style={{
          color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.75,
          maxWidth: 540, marginBottom: 48,
        }}>
          Swap and send USDC, EURC, cirBTC on Arc Testnet.
          Non-custodial, real-time on-chain — powered by Circle AppKit.
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 72 }}>
          <Link href="/portfolio" style={{
            background: 'linear-gradient(135deg, #7B61FF, #6247E0)',
            color: '#fff', fontSize: '1rem', fontWeight: 700,
            padding: '14px 40px', borderRadius: 14, textDecoration: 'none',
            boxShadow: '0 6px 28px rgba(123,97,255,0.45)',
          }}>
            Launch App →
          </Link>
          <a href="https://docs.arc.network/app-kit/swap" target="_blank" rel="noopener noreferrer" style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600,
            padding: '14px 40px', borderRadius: 14, textDecoration: 'none',
          }}>
            View Docs
          </a>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 48, flexWrap: 'wrap', justifyContent: 'center',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '24px 48px',
        }}>
          <Stat value="3" label="Supported Tokens"/>
          <div style={{ width: 1, height: 32, background: 'var(--border)'}}/>
          <Stat value="&lt;1s" label="Finality on Arc"/>
          <div style={{ width: 1, height: 32, background: 'var(--border)'}}/>
          <Stat value="0%" label="Custody Risk"/>
          <div style={{ width: 1, height: 32, background: 'var(--border)'}}/>
          <Stat value="Circle" label="Execution Layer"/>
        </div>
      </section>

      {/* ── Features ───────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '0 40px 100px', maxWidth: 1100, margin: '0 auto', width: '100%',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ color: 'var(--purple)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
            Platform Features
          </p>
          <h2 style={{ color: 'var(--text-heading)', fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
            Everything in one place
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          <FeatureCard
            icon="⇄"
            title="Token Swap"
            tag="Live"
            desc="Swap USDC ↔ EURC ↔ cirBTC with auto-quotes, live rate, stop-limit and fee breakdown before confirmation."
          />
          <FeatureCard
            icon="↗"
            title="Send"
            tag="Live"
            desc="Transfer any supported token to any EVM address. Real-time address validation and balance check."
          />
          <FeatureCard
            icon="💼"
            title="Portfolio"
            desc="Real-time token balances fetched directly from Arc Testnet RPC. No backend, no delays."
          />
          <FeatureCard
            icon="📜"
            title="History"
            desc="All send and swap transactions indexed in Supabase, filterable by type and direction with ArcScan links."
          />
        </div>
      </section>

      {/* ── Tech stack ─────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '0 40px 100px', maxWidth: 1100, margin: '0 auto', width: '100%',
      }}>
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 24, padding: '48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, textAlign: 'center',
        }}>
          <div>
            <p style={{ color: 'var(--purple)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
              Tech Stack
            </p>
            <h2 style={{ color: 'var(--text-heading)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Built with modern Web3 primitives
            </h2>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'wagmi v2', 'viem', 'RainbowKit', 'Circle AppKit', 'Supabase', 'Arc Testnet', 'Turbopack'].map(t => (
              <TechBadge key={t} label={t}/>
            ))}
          </div>

          {/* Architecture flow */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap', justifyContent: 'center',
            marginTop: 8,
          }}>
            {[
              { label: 'Browser Wallet', sub: 'MetaMask / WC' },
              { label: 'RainbowKit', sub: 'Wallet connector' },
              { label: 'Circle AppKit', sub: 'Tx execution' },
              { label: 'Arc Testnet', sub: 'EVM chain' },
              { label: 'Supabase', sub: 'Tx index' },
            ].map((node, i, arr) => (
              <div key={node.label} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '10px 16px', textAlign: 'center',
                }}>
                  <p style={{ color: 'var(--text-primary)', fontSize: '0.78rem', fontWeight: 600 }}>{node.label}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.65rem', marginTop: 2 }}>{node.sub}</p>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ color: 'var(--purple)', fontSize: '0.9rem', padding: '0 8px', opacity: 0.6 }}>→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA bottom ─────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1,
        padding: '0 24px 100px', display: 'flex', justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: 680, width: '100%', textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(123,97,255,0.12), rgba(98,71,224,0.06))',
          border: '1px solid var(--purple-ghost-border)',
          borderRadius: 28, padding: '64px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -60, right: -60,
            width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(123,97,255,0.2), transparent 70%)',
            pointerEvents: 'none',
          }}/>
          <LogoMark size={52}/>
          <h2 style={{
            color: 'var(--text-heading)', fontSize: '2rem', fontWeight: 800,
            letterSpacing: '-0.025em', margin: '20px 0 12px',
          }}>
            Ready to swap?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 32 }}>
            Connect your wallet and start trading stablecoins on Arc Testnet in seconds.
          </p>
          <Link href="/portfolio" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #7B61FF, #6247E0)',
            color: '#fff', fontSize: '1rem', fontWeight: 700,
            padding: '14px 44px', borderRadius: 14, textDecoration: 'none',
            boxShadow: '0 6px 28px rgba(123,97,255,0.45)',
          }}>
            Launch App →
          </Link>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────── */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--border)',
        padding: '28px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LogoMark size={22}/>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            © 2025 Meridex · Built on Arc Testnet
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'GitHub', href: 'https://github.com/askeryusuf/meridex' },
            { label: 'X', href: 'https://x.com/meridex_app' },
            { label: 'Docs', href: 'https://docs.arc.network/app-kit/swap' },
            { label: 'ArcScan', href: 'https://testnet.arcscan.app' },
          ].map(l => (
            <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'none' }}>
              {l.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  )
}
