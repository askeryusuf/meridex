'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectButton } from '@rainbow-me/rainbowkit'

const navItems = [
  { group: 'MAIN', items: [
    { href: '/portfolio', label: 'Portfolio', icon: '💼' },
    { href: '/swap', label: 'Swap', icon: '⇄' },
    { href: '/send', label: 'Send', icon: '↗' },
    { href: '/history', label: 'History', icon: '📜' },
    { href: '/docs', label: 'Docs', icon: '📄' },
  ]},
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="w-64 h-screen sticky top-0 flex flex-col"
      style={{
        background: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-sidebar)',
      }}
    >
      {/* Logo + theme toggle */}
      <div
        className="h-20 px-6 flex items-center"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="relative flex-shrink-0">
            <svg width="36" height="36" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="sb-bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1A1C3D"/>
                  <stop offset="100%" stopColor="#0F1023"/>
                </linearGradient>
                <linearGradient id="sb-a1" x1="60" y1="50" x2="140" y2="150" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#C4B5FD"/>
                  <stop offset="100%" stopColor="#7B61FF"/>
                </linearGradient>
                <linearGradient id="sb-a2" x1="140" y1="50" x2="60" y2="150" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7B61FF"/>
                  <stop offset="100%" stopColor="#6247E0"/>
                </linearGradient>
              </defs>
              <rect width="200" height="200" rx="44" fill="url(#sb-bg)"/>
              <rect width="200" height="200" rx="44" fill="none" stroke="#2A2D57" strokeWidth="3"/>
              <rect x="8" y="8" width="184" height="184" rx="38" fill="none" stroke="#7B61FF" strokeWidth="1" opacity="0.4"/>
              <path d="M 88 52 C 52 52 38 75 38 100 C 38 125 52 148 88 148"
                stroke="url(#sb-a1)" strokeWidth="12" strokeLinecap="round" fill="none"/>
              <path d="M 112 52 C 148 52 162 75 162 100 C 162 125 148 148 112 148"
                stroke="url(#sb-a2)" strokeWidth="12" strokeLinecap="round" fill="none"/>
              <circle cx="100" cy="52" r="8" fill="#9B8AFF"/>
              <circle cx="100" cy="148" r="8" fill="#6247E0"/>
            </svg>
          </div>
          {/* Wordmark */}
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight" style={{ color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>
              Meridex
            </span>
            <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: 'var(--purple)', opacity: 0.8 }}>
              Arc Testnet
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navItems.map((group) => (
          <div key={group.group}>
            <p
              className="text-xs font-semibold tracking-wider mb-2 px-2"
              style={{ color: 'var(--text-secondary)' }}
            >
              {group.group}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive ? 'nav-active' : 'nav-inactive'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Wallet */}
      <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
        <ConnectButton
          showBalance={false}
          chainStatus="icon"
          accountStatus="address"
        />
      </div>
    </aside>
  )
}
