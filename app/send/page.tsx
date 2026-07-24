'use client'

import { useState, useCallback, useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { isAddress } from 'viem'
import AppLayout from '@/app/components/AppLayout'
import { arcTestnet, USDC_ADDRESS, EURC_ADDRESS, CIRBTC_ADDRESS } from '@/lib/arc'
import { AppKit } from '@circle-fin/app-kit'
import { getAdapter } from '@/lib/adapter'
import { saveTransaction } from '@/lib/supabase'
import { patchCircleFetch } from '@/lib/patch-circle-fetch'
import { useArcTokenBalance } from '@/lib/use-token-balance'
import { Toast, type ToastType } from '@/app/components/Toast'

const TOKENS = [
  { symbol: 'USDC',   name: 'USD Coin',      decimals: 6, address: USDC_ADDRESS,   logo: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  { symbol: 'EURC',   name: 'Euro Coin',      decimals: 6, address: EURC_ADDRESS,   logo: 'https://assets.coingecko.com/coins/images/26045/small/euro-coin.png' },
  { symbol: 'cirBTC', name: 'Circle Bitcoin', decimals: 8, address: CIRBTC_ADDRESS, logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
]

export default function SendPage() {
  const { address, chainId } = useAccount()
  const { switchChain }      = useSwitchChain()
  const queryClient          = useQueryClient()

  const [token,     setToken]     = useState(TOKENS[0])
  const [amount,    setAmount]    = useState('')
  const [recipient, setRecipient] = useState('')
  const [status,    setStatus]    = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errMsg,    setErrMsg]    = useState('')
  const [txHash,    setTxHash]    = useState('')
  const [tokenOpen, setTokenOpen] = useState(false)
  const [toast,     setToast]     = useState<{ message: string; type: ToastType; txHash?: string } | null>(null)

  useEffect(() => { patchCircleFetch() }, [])

  const balRaw = useArcTokenBalance(address, token.symbol, token.address as `0x${string}`, token.decimals)
  const balStr = balRaw !== '—' ? balRaw : '0'

  const isWrongChain   = !!address && chainId !== arcTestnet.id
  const isPending      = status === 'sending'
  const validRecipient = isAddress(recipient)

  const handleSend = useCallback(async () => {
    if (!address || !amount || parseFloat(amount) <= 0 || !validRecipient) return
    setStatus('sending'); setErrMsg(''); setTxHash('')
    try {
      const kit     = new AppKit()
      const adapter = await getAdapter()
      const result  = await kit.send({
        from:  { adapter, chain: 'Arc_Testnet' },
        to:    recipient as `0x${string}`,
        amount,
        token: token.symbol,
      })
      const hash = (result as { txHash?: string })?.txHash ?? ''
      setTxHash(hash)
      if (!hash) console.warn('[send] txHash is empty, saving without hash')
      await saveTransaction(address, recipient, parseFloat(amount), hash, 'send')
      // Force-refresh all balances immediately after send
      queryClient.invalidateQueries()
      setAmount(''); setRecipient('')
      setStatus('success')
      setToast({ message: 'Sent successfully!', type: 'success', txHash: hash })
      const t = setTimeout(() => setStatus('idle'), 4000)
      return () => clearTimeout(t)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Send failed'
      if (msg.toLowerCase().includes('rejected') || msg.includes('4001')) {
        setErrMsg('Transaction rejected.')
      } else {
        setErrMsg(msg)
      }
      setStatus('error')
      const t2 = setTimeout(() => setStatus('idle'), 3000)
      return () => clearTimeout(t2)
    }
  }, [address, amount, recipient, token, validRecipient])

  const canSend = !!address && !isWrongChain && !isPending &&
    !!amount && parseFloat(amount) > 0 && validRecipient

  const recipientState = !recipient ? 'empty' : validRecipient ? 'valid' : 'invalid'

  return (
    <AppLayout>
      {toast && (
        <Toast message={toast.message} type={toast.type} txHash={toast.txHash} onClose={() => setToast(null)} />
      )}

      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Send</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            Transfer tokens to any EVM address
          </p>
        </div>

        <div className="space-y-3">

          {/* Step 1 — Token & Amount */}
          <div className="rounded-3xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--purple)', color: '#fff' }}>1</div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                Amount & Token
              </span>
              {address && (
                <span className="ml-auto text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Balance: <b style={{ color: 'var(--text-primary)' }}>{balStr} {token.symbol}</b>
                </span>
              )}
            </div>

            {/* Amount input row */}
            <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--bg-input)' }}>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="flex-1 bg-transparent font-bold outline-none min-w-0"
                style={{ fontSize: '1.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              />

              {/* Token selector */}
              <div className="relative">
                <button
                  onClick={() => setTokenOpen(o => !o)}
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl font-semibold text-sm"
                  style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${tokenOpen ? 'var(--purple)' : 'var(--border)'}`,
                    color: 'var(--text-primary)',
                    minWidth: 115,
                    transition: 'border-color .15s',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={token.logo} alt={token.symbol} width={20} height={20} className="rounded-full" />
                  <span className="flex-1 text-left">{token.symbol}</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    style={{ transform: tokenOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s', opacity: 0.5 }}>
                    <path d="M6 9l6 6 6-6"/>
                  </svg>
                </button>
                {tokenOpen && (
                  <div className="absolute right-0 top-full mt-2 rounded-2xl shadow-xl z-50 py-1"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minWidth: 160 }}>
                    {TOKENS.map(t => (
                      <button key={t.symbol}
                        onClick={() => { setToken(t); setTokenOpen(false) }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left"
                        style={{ background: t.symbol === token.symbol ? 'var(--bg-input)' : 'transparent', color: 'var(--text-primary)' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.logo} alt={t.symbol} width={22} height={22} className="rounded-full" />
                        <div>
                          <p className="font-bold leading-none">{t.symbol}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{t.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Step 2 — Recipient */}
          <div className="rounded-3xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'var(--purple)', color: '#fff' }}>2</div>
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                Recipient
              </span>
              {recipientState === 'valid' && (
                <span className="ml-auto text-xs font-semibold" style={{ color: '#22C55E' }}>✓ Valid address</span>
              )}
              {recipientState === 'invalid' && (
                <span className="ml-auto text-xs font-semibold" style={{ color: 'var(--text-negative)' }}>✗ Invalid</span>
              )}
            </div>

            <div
              className="flex items-center gap-3 p-4 rounded-2xl transition-all"
              style={{
                background: 'var(--bg-input)',
                border: `1px solid ${recipientState === 'valid' ? 'rgba(34,197,94,0.3)' : recipientState === 'invalid' ? 'rgba(248,113,113,0.3)' : 'transparent'}`,
              }}
            >
              <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="0x... wallet address"
                value={recipient}
                onChange={e => setRecipient(e.target.value)}
                className="flex-1 bg-transparent text-sm font-mono outline-none min-w-0"
                style={{ color: recipientState === 'invalid' ? 'var(--text-negative)' : 'var(--text-primary)' }}
              />
            </div>
          </div>

          {/* Summary — show when both filled */}
          {amount && parseFloat(amount) > 0 && validRecipient && (
            <div className="rounded-3xl px-5 py-4" style={{ background: 'rgba(123,97,255,0.06)', border: '1px solid var(--purple-ghost-border)' }}>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--purple)' }}>
                Summary
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Sending</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{amount} {token.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>To</span>
                  <span className="font-mono font-bold" style={{ color: 'var(--text-primary)' }}>
                    {recipient.slice(0, 8)}…{recipient.slice(-6)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-secondary)' }}>Network</span>
                  <span className="font-bold" style={{ color: 'var(--text-primary)' }}>Arc Testnet</span>
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {errMsg && (
            <div className="px-4 py-3 rounded-2xl text-xs font-medium"
              style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--text-negative)' }}>
              ⚠ {errMsg}
            </div>
          )}

          {/* Action */}
          {!address ? (
            <div className="flex justify-center py-2">
              <ConnectButton label="Connect Wallet to Send" />
            </div>
          ) : isWrongChain ? (
            <button onClick={() => switchChain({ chainId: arcTestnet.id })}
              className="w-full py-4 rounded-3xl font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #7B61FF, #6247E0)', color: '#fff' }}>
              Switch to Arc Testnet
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canSend}
              className="w-full py-4 rounded-3xl font-bold text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                background: canSend ? 'linear-gradient(135deg, #7B61FF, #6247E0)' : 'var(--bg-card)',
                color: canSend ? '#fff' : 'var(--text-secondary)',
                border: canSend ? 'none' : '1px solid var(--border)',
                boxShadow: canSend ? '0 4px 20px rgba(123,97,255,0.35)' : 'none',
              }}
            >
              {isPending ? 'Sending…' : `Send ${amount || '0'} ${token.symbol}`}
            </button>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          Powered by Circle AppKit · Arc Testnet
        </p>
      </div>
    </AppLayout>
  )
}
