'use client'

import { useAccount } from 'wagmi'
import AppLayout from '@/app/components/AppLayout'
import { USDC_ADDRESS, EURC_ADDRESS, CIRBTC_ADDRESS } from '@/lib/arc'
import { useArcTokenBalance } from '@/lib/use-token-balance'
import Link from 'next/link'

const TOKENS = [
  { symbol: 'USDC',   name: 'USD Coin',       decimals: 6, address: USDC_ADDRESS,   logo: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png' },
  { symbol: 'EURC',   name: 'Euro Coin',       decimals: 6, address: EURC_ADDRESS,   logo: 'https://assets.coingecko.com/coins/images/26045/small/euro-coin.png' },
  { symbol: 'cirBTC', name: 'Circle Bitcoin',  decimals: 8, address: CIRBTC_ADDRESS, logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
]

function TokenRow({ symbol, name, decimals, address: tokenAddr, logo, walletAddr }: typeof TOKENS[0] & { walletAddr: `0x${string}` | undefined }) {
  const bal = useArcTokenBalance(walletAddr, symbol, tokenAddr as `0x${string}`, decimals)
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl" style={{ background: 'var(--bg-input)' }}>
      <div className="flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={symbol} width={36} height={36} className="rounded-full" />
        <div>
          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{symbol}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{name}</p>
        </div>
      </div>
      <p className="font-semibold text-sm tabular-nums" style={{ color: 'var(--text-primary)' }}>{bal}</p>
    </div>
  )
}

export default function PortfolioPage() {
  const { address } = useAccount()

  return (
    <AppLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>Portfolio</h1>
          <p className="text-xs sm:text-sm" style={{ color: 'var(--text-secondary)' }}>
            Your token balances on Arc Testnet
          </p>
        </div>

        {!address ? (
          <div className="card rounded-xl p-8 text-center">
            <p className="text-lg mb-2" style={{ color: 'var(--text-secondary)' }}>Connect your wallet</p>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>to view your portfolio</p>
          </div>
        ) : (
          <>
            {/* Wallet address */}
            <div className="card rounded-xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: 'var(--bg-input)' }}>👤</div>
              <div className="min-w-0">
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Connected Wallet</p>
                <p className="font-mono text-sm truncate" style={{ color: 'var(--text-primary)' }}>{address}</p>
              </div>
            </div>

            {/* Token balances */}
            <div className="card rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Token Balances</p>
              <div className="space-y-2">
                {TOKENS.map(t => (
                  <TokenRow key={t.symbol} {...t} walletAddr={address} />
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/send"
                className="card rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all hover:opacity-80">
                <span className="text-2xl">↗</span>
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Send</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Transfer tokens</span>
              </Link>
              <Link href="/swap"
                className="card rounded-xl p-4 flex flex-col items-center gap-2 text-center transition-all hover:opacity-80">
                <span className="text-2xl">⇄</span>
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Swap</span>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Exchange tokens</span>
              </Link>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}
