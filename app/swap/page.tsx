'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import AppLayout from '@/app/components/AppLayout'
import { arcTestnet, USDC_ADDRESS, EURC_ADDRESS, CIRBTC_ADDRESS } from '@/lib/arc'
import { saveTransaction } from '@/lib/supabase'
import { AppKit } from '@circle-fin/app-kit'
import { getAdapter } from '@/lib/adapter'
import { patchCircleFetch } from '@/lib/patch-circle-fetch'
import { useArcTokenBalance } from '@/lib/use-token-balance'
import { Toast, type ToastType } from '@/app/components/Toast'

const TOKENS = [
  { symbol: 'USDC',   name: 'USD Coin',      decimals: 6, address: USDC_ADDRESS,   logo: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  { symbol: 'EURC',   name: 'Euro Coin',      decimals: 6, address: EURC_ADDRESS,   logo: 'https://assets.coingecko.com/coins/images/26045/small/euro-coin.png' },
  { symbol: 'cirBTC', name: 'Circle Bitcoin', decimals: 8, address: CIRBTC_ADDRESS, logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
]

type Status = 'idle' | 'estimating' | 'swapping' | 'success' | 'error'

interface Estimate {
  estimatedOutput: { amount: string; token: string }
  stopLimit:       { amount: string; token: string }
  fees:            { type: string; amount: string; token: string }[]
}

function TokenDropdown({
  selected,
  exclude,
  open,
  onToggle,
  onSelect,
}: {
  selected: typeof TOKENS[0]
  exclude: typeof TOKENS[0]
  open: boolean
  onToggle: () => void
  onSelect: (t: typeof TOKENS[0]) => void
}) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-2xl font-semibold text-sm transition-all"
        style={{
          background: 'var(--bg-base)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
          minWidth: 110,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={selected.logo} alt={selected.symbol} width={20} height={20} className="rounded-full" />
        <span className="flex-1 text-left">{selected.symbol}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s', opacity: 0.5 }}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>
      {open && (
        <div
          className="absolute right-0 top-full mt-2 rounded-2xl shadow-xl z-50 overflow-hidden py-1"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', minWidth: 150 }}
        >
          {TOKENS.filter(t => t.symbol !== exclude.symbol).map(t => (
            <button
              key={t.symbol}
              onClick={() => onSelect(t)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
              style={{
                background: t.symbol === selected.symbol ? 'var(--bg-input)' : 'transparent',
                color: 'var(--text-primary)',
              }}
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
  )
}

export default function SwapPage() {
  const { address, chainId } = useAccount()
  const { switchChain }      = useSwitchChain()
  const queryClient          = useQueryClient()

  const [tokenIn,   setTokenIn]   = useState(TOKENS[0])
  const [tokenOut,  setTokenOut]  = useState(TOKENS[1])
  const [amountIn,  setAmountIn]  = useState('')
  const [status,    setStatus]    = useState<Status>('idle')
  const [estimate,  setEstimate]  = useState<Estimate | null>(null)
  const [errMsg,    setErrMsg]    = useState('')
  const [txHash,    setTxHash]    = useState('')
  const [inOpen,    setInOpen]    = useState(false)
  const [outOpen,   setOutOpen]   = useState(false)
  const [toast,     setToast]     = useState<{ message: string; type: ToastType; txHash?: string } | null>(null)

  const isWrongChain = !!address && chainId !== arcTestnet.id
  const isPending    = status === 'swapping' || status === 'estimating'

  useEffect(() => { patchCircleFetch() }, [])

  const balIn  = useArcTokenBalance(address, tokenIn.symbol,  tokenIn.address  as `0x${string}`, tokenIn.decimals)
  const balOut = useArcTokenBalance(address, tokenOut.symbol, tokenOut.address as `0x${string}`, tokenOut.decimals)

  const handleEstimate = useCallback(async () => {
    if (!address || !amountIn || parseFloat(amountIn) <= 0) return
    setStatus('estimating'); setEstimate(null); setErrMsg('')
    try {
      const res = await fetch('/api/swap-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokenIn: tokenIn.symbol, tokenOut: tokenOut.symbol, amountIn }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Quote failed')
      setEstimate(data)
      setStatus('idle')
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : 'Quote failed')
      setStatus('error')
      const t = setTimeout(() => setStatus('idle'), 3000)
      return () => clearTimeout(t)
    }
  }, [address, amountIn, tokenIn, tokenOut])

  const estimateRef = useRef(handleEstimate)
  useEffect(() => { estimateRef.current = handleEstimate }, [handleEstimate])

  useEffect(() => {
    if (!address || !amountIn || parseFloat(amountIn) <= 0) { setEstimate(null); return }
    const t = setTimeout(() => estimateRef.current(), 600)
    return () => clearTimeout(t)
  }, [amountIn, tokenIn.symbol, tokenOut.symbol, address])

  const handleSwap = useCallback(async () => {
    if (!address || !amountIn || !estimate) return
    setStatus('swapping'); setErrMsg(''); setTxHash('')
    try {
      const kit     = new AppKit()
      const adapter = await getAdapter()
      const result  = await kit.swap({
        from:     { adapter, chain: 'Arc_Testnet' },
        tokenIn:  tokenIn.symbol,
        tokenOut: tokenOut.symbol,
        amountIn,
        config:   { kitKey: process.env.NEXT_PUBLIC_KIT_KEY! },
      })
      const hash = (result as { txHash?: string })?.txHash ?? ''
      setTxHash(hash)
      await saveTransaction(address, address, parseFloat(amountIn), hash, 'swap')
      // Force-refresh all balances immediately after swap
      queryClient.invalidateQueries()
      setAmountIn(''); setEstimate(null)
      setStatus('success')
      setToast({ message: 'Swap successful!', type: 'success', txHash: hash })
      const t = setTimeout(() => setStatus('idle'), 4000)
      return () => clearTimeout(t)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Swap failed'
      if (msg.toLowerCase().includes('rejected') || msg.includes('4001')) {
        setErrMsg('Transaction rejected.')
      } else {
        setErrMsg(msg)
      }
      setStatus('error')
      const t2 = setTimeout(() => setStatus('idle'), 3000)
      return () => clearTimeout(t2)
    }
  }, [address, amountIn, tokenIn, tokenOut, estimate])

  const rate = estimate && amountIn && parseFloat(amountIn) > 0
    ? (parseFloat(estimate.estimatedOutput.amount) / parseFloat(amountIn)).toFixed(6)
    : null

  return (
    <AppLayout>
      {toast && (
        <Toast message={toast.message} type={toast.type} txHash={toast.txHash} onClose={() => setToast(null)} />
      )}

      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Swap</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Exchange tokens instantly on Arc Testnet
            </p>
          </div>
          {/* live indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#22C55E' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 5px #22C55E', display: 'inline-block' }}/>
            Live quotes
          </div>
        </div>

        {/* Main card */}
        <div className="rounded-3xl p-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

          {/* Pay panel */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-input)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                You pay
              </span>
              {address && (
                <div className="flex items-center gap-2">
                  {balIn !== '—' && balIn !== '0' && (
                    <>
                      <button
                        onClick={() => { const r = parseFloat(balIn); if (!r) return; setAmountIn((r / 2).toFixed(4)); setEstimate(null); setErrMsg('') }}
                        className="text-xs font-bold px-2 py-0.5 rounded-lg"
                        style={{ background: 'var(--purple-ghost)', color: 'var(--purple)', border: '1px solid var(--purple-ghost-border)' }}
                      >50%</button>
                      <button
                        onClick={() => { const r = parseFloat(balIn); if (!r) return; const buf = Math.max(r * 0.001, 0.001); setAmountIn(Math.max(r - buf, 0).toFixed(4)); setEstimate(null); setErrMsg('') }}
                        className="text-xs font-bold px-2 py-0.5 rounded-lg"
                        style={{ background: 'var(--purple-ghost)', color: 'var(--purple)', border: '1px solid var(--purple-ghost-border)' }}
                      >MAX</button>
                    </>
                  )}
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {balIn} <span style={{ color: 'var(--text-muted)' }}>{tokenIn.symbol}</span>
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                placeholder="0.00"
                value={amountIn}
                onChange={e => { setAmountIn(e.target.value); setEstimate(null); setErrMsg('') }}
                className="flex-1 bg-transparent font-bold outline-none min-w-0"
                style={{ fontSize: '2rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              />
              <TokenDropdown
                selected={tokenIn}
                exclude={tokenOut}
                open={inOpen}
                onToggle={() => setInOpen(o => !o)}
                onSelect={t => { setTokenIn(t); setInOpen(false); setEstimate(null) }}
              />
            </div>
          </div>

          {/* Swap arrow divider */}
          <div className="flex justify-center -my-0.5 relative z-10">
            <button
              onClick={() => { setTokenIn(tokenOut); setTokenOut(tokenIn); setAmountIn(''); setEstimate(null) }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:rotate-180"
              style={{
                background: 'var(--bg-card)',
                border: '2px solid var(--border)',
                color: 'var(--purple)',
                transition: 'transform 0.3s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12l7 7 7-7"/>
              </svg>
            </button>
          </div>

          {/* Receive panel */}
          <div className="rounded-2xl p-5" style={{ background: 'var(--bg-input)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-secondary)' }}>
                You receive
              </span>
              {address && (
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {balOut} <span style={{ color: 'var(--text-muted)' }}>{tokenOut.symbol}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 font-bold min-w-0" style={{ fontSize: '2rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                {status === 'estimating'
                  ? <span className="animate-pulse text-base" style={{ color: 'var(--text-secondary)' }}>Calculating…</span>
                  : <span style={{ color: estimate ? 'var(--teal)' : 'var(--text-primary)' }}>
                      {estimate?.estimatedOutput?.amount ?? '0.00'}
                    </span>
                }
              </div>
              <TokenDropdown
                selected={tokenOut}
                exclude={tokenIn}
                open={outOpen}
                onToggle={() => setOutOpen(o => !o)}
                onSelect={t => { setTokenOut(t); setOutOpen(false); setEstimate(null) }}
              />
            </div>
          </div>

          {/* Quote details */}
          {estimate && rate && (
            <div className="px-5 py-3 space-y-2">
              <div className="h-px" style={{ background: 'var(--border)' }}/>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Exchange rate</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  1 {tokenIn.symbol} = {rate} {tokenOut.symbol}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>Minimum received</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  {estimate.stopLimit.amount} {tokenOut.symbol}
                </span>
              </div>
              {estimate.fees?.map(f => (
                <div key={f.type} className="flex justify-between text-xs">
                  <span style={{ color: 'var(--text-secondary)' }}>{f.type} fee</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                    {parseFloat(f.amount).toFixed(6)} {f.token}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {errMsg && (
            <div className="mx-4 mb-1 px-4 py-2.5 rounded-2xl text-xs font-medium"
              style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: 'var(--text-negative)' }}>
              ⚠ {errMsg}
            </div>
          )}

          {/* Action button */}
          <div className="p-3">
            {!address ? (
              <div className="flex justify-center py-1">
                <ConnectButton label="Connect Wallet to Swap" />
              </div>
            ) : isWrongChain ? (
              <button onClick={() => switchChain({ chainId: arcTestnet.id })}
                className="w-full py-4 rounded-2xl font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #7B61FF, #6247E0)', color: '#fff' }}>
                Switch to Arc Testnet
              </button>
            ) : (
              <button
                onClick={estimate ? handleSwap : handleEstimate}
                disabled={isPending || !amountIn || parseFloat(amountIn) <= 0}
                className="w-full py-4 rounded-2xl font-bold text-sm transition-all disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  background: (amountIn && parseFloat(amountIn) > 0)
                    ? 'linear-gradient(135deg, #7B61FF, #6247E0)'
                    : 'var(--bg-input)',
                  color: (amountIn && parseFloat(amountIn) > 0) ? '#fff' : 'var(--text-secondary)',
                  boxShadow: (amountIn && parseFloat(amountIn) > 0) ? '0 4px 20px rgba(123,97,255,0.35)' : 'none',
                }}
              >
                {status === 'estimating' ? 'Getting quote…'
                  : status === 'swapping' ? 'Swapping…'
                  : estimate ? `Swap ${tokenIn.symbol} → ${tokenOut.symbol}`
                  : 'Enter an amount'}
              </button>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
          Powered by Circle AppKit · Arc Testnet
        </p>
      </div>
    </AppLayout>
  )
}
