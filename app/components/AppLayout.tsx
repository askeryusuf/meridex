'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import SocialLinks from './SocialLinks'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── Mobile top header ──────────────────── */}
      <header
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{
          height: 56,
          background: 'var(--bg-sidebar)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 200 200" fill="none">
            <defs>
              <linearGradient id="mh-bg" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1A1C3D"/>
                <stop offset="100%" stopColor="#0F1023"/>
              </linearGradient>
              <linearGradient id="mh-a1" x1="60" y1="50" x2="140" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#C4B5FD"/>
                <stop offset="100%" stopColor="#7B61FF"/>
              </linearGradient>
              <linearGradient id="mh-a2" x1="140" y1="50" x2="60" y2="150" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#7B61FF"/>
                <stop offset="100%" stopColor="#6247E0"/>
              </linearGradient>
            </defs>
            <rect width="200" height="200" rx="44" fill="url(#mh-bg)"/>
            <path d="M 88 52 C 52 52 38 75 38 100 C 38 125 52 148 88 148" stroke="url(#mh-a1)" strokeWidth="14" strokeLinecap="round" fill="none"/>
            <path d="M 112 52 C 148 52 162 75 162 100 C 162 125 148 148 112 148" stroke="url(#mh-a2)" strokeWidth="14" strokeLinecap="round" fill="none"/>
            <circle cx="100" cy="52" r="8" fill="#9B8AFF"/>
            <circle cx="100" cy="148" r="8" fill="#6247E0"/>
          </svg>
          <span className="font-bold text-base" style={{ color: 'var(--text-heading)', letterSpacing: '-0.02em' }}>Meridex</span>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-xl"
          style={{ background: 'var(--bg-input)', border: '1px solid var(--border)' }}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {sidebarOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
            ) : (
              <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
            )}
          </svg>
        </button>
      </header>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Desktop / Drawer Sidebar ───────────── */}
      <div className={`fixed lg:sticky top-0 h-screen z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar onNavigate={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main content ──────────────────────── */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-[72px] lg:pt-[88px] pb-8 overflow-y-auto">
        {children}
      </main>

      <SocialLinks />
    </div>
  )
}
