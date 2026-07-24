'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { useAccount } from 'wagmi'
import AppLayout from '@/app/components/AppLayout'
import { type Transaction } from '@/lib/supabase'

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
}

type TxWithDir = Transaction & { direction: 'out' | 'in' }
const PAGE_SIZE = 5
type TypeFilter = 'all' | 'send' | 'swap'

function FilterChip<T extends string>({
  value, active, label, onClick,
}: { value: T; active: boolean; label: string; onClick: (v: T) => void }) {
  return (
    <button
      onClick={() => onClick(value)}
      className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
      style={{
        background: active ? 'var(--purple)' : 'var(--bg-card)',
        color: active ? '#fff' : 'var(--text-secondary)',
        border: active ? '1px solid var(--purple)' : '1px solid var(--border)',
      }}
    >
      {label}
    </button>
  )
}

function TxCard({ tx, index }: { tx: TxWithDir; index: number }) {
  const isSwap = tx.type === 'swap'
  const iconBg    = isSwap ? 'rgba(123,97,255,0.12)' : 'rgba(0,201,177,0.12)'
  const iconColor = isSwap ? 'var(--purple)'          : 'var(--teal)'

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-base font-bold"
        style={{ background: iconBg, color: iconColor }}
      >
        {isSwap ? '⇄' : '↑'}
      </div>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
          {isSwap ? 'Swap' : 'Send'}
        </span>
      </div>

      {/* Time */}
      <div className="text-right flex-shrink-0">
        <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{timeAgo(tx.created_at)}</p>
        <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{formatDate(tx.created_at)}</p>
      </div>

      {/* Explorer */}
      <a
        href={`https://testnet.arcscan.app/tx/${tx.tx_hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
        style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}
        title="View on ArcScan"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
      </a>
    </div>
  )
}

export default function HistoryPage() {
  const { address } = useAccount()
  const [txs,     setTxs]     = useState<TxWithDir[]>([])
  const [loading, setLoading] = useState(false)
  const [page,    setPage]    = useState(1)
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')

  useEffect(() => {
    if (!address) return
    setLoading(true)
    async function load() {
      const res = await fetch(`/api/get-transactions?address=${address}`)
      if (!res.ok) { setLoading(false); return }
      const { sent, received } = await res.json()
      const all: TxWithDir[] = [
        ...(sent     || []).map((t: Transaction) => ({ ...t, direction: 'out' as const })),
        ...(received || []).map((t: Transaction) => ({ ...t, direction: 'in'  as const })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setTxs(all)
      setLoading(false)
    }
    load().catch(() => setLoading(false))
  }, [address])

  const filtered = useMemo(() =>
    txs.filter(tx => typeFilter === 'all' || tx.type === typeFilter),
    [txs, typeFilter]
  )

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)), [filtered.length])
  const paginated  = useMemo(() => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [filtered, page])

  const setType = useCallback((v: TypeFilter) => { setTypeFilter(v); setPage(1) }, [])

  const totalSends = useMemo(() => txs.filter(t => t.type === 'send').length, [txs])
  const totalSwaps = useMemo(() => txs.filter(t => t.type === 'swap').length, [txs])

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>History</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
            All on-chain activity for your wallet
          </p>
        </div>

        {/* Stats */}
        {address && txs.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Total', value: txs.length,  color: 'var(--purple)' },
              { label: 'Sends', value: totalSends,  color: 'var(--teal)' },
              { label: 'Swaps', value: totalSwaps,  color: 'var(--purple)' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4 text-center"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <p className="text-2xl font-bold tabular-nums" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          <FilterChip value="all"  active={typeFilter === 'all'}  label="All"  onClick={setType} />
          <FilterChip value="send" active={typeFilter === 'send'} label="Send" onClick={setType} />
          <FilterChip value="swap" active={typeFilter === 'swap'} label="Swap" onClick={setType} />
        </div>

        {/* List */}
        {!address ? (
          <div className="rounded-3xl p-12 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-3xl mb-3">🔗</div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>Connect your wallet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>to view your transaction history</p>
          </div>
        ) : loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'var(--bg-card)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl p-12 text-center" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-3xl mb-3">{txs.length === 0 ? '📭' : '🔍'}</div>
            <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {txs.length === 0 ? 'No transactions yet' : 'No results'}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              {txs.length === 0 ? 'Your activity will appear here' : 'Try a different filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {paginated.map((tx, i) => <TxCard key={tx.id ?? i} tx={tx} index={i} />)}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-30"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                ← Prev
              </button>
              <span className="flex items-center px-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                {page} / {totalPages}
              </span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-30"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
