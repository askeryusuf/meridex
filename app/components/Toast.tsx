'use client'

import { useEffect, useState } from 'react'

export type ToastType = 'success' | 'error'

interface ToastProps {
  message: string
  type: ToastType
  txHash?: string
  onClose: () => void
}

export function Toast({ message, type, txHash, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10)
    const hide = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 5000)
    return () => { clearTimeout(show); clearTimeout(hide) }
  }, [onClose])

  const isSuccess = type === 'success'

  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        maxWidth: '360px',
        minWidth: '280px',
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
        background: 'var(--bg-card)',
        border: `1px solid ${isSuccess ? 'rgba(34,197,94,0.35)' : 'rgba(248,113,113,0.35)'}`,
        borderRadius: '14px',
        boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${isSuccess ? 'rgba(34,197,94,0.1)' : 'rgba(248,113,113,0.1)'}`,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
      }}
    >
      {/* Icon */}
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isSuccess ? 'rgba(34,197,94,0.15)' : 'rgba(248,113,113,0.15)',
        fontSize: '15px',
      }}>
        {isSuccess ? '✅' : '❌'}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          color: isSuccess ? 'var(--text-positive)' : 'var(--text-negative)',
          fontWeight: 600,
          fontSize: '0.875rem',
          marginBottom: txHash ? '4px' : 0,
        }}>
          {message}
        </p>
        {txHash && (
          <a
            href={`https://testnet.arcscan.app/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--purple)',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              textDecoration: 'underline',
            }}
          >
            {txHash.slice(0, 12)}...{txHash.slice(-6)} ↗
          </a>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: '18px', lineHeight: 1,
          padding: '0 2px', flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  )
}
