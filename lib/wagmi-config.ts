import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'

// Arc Testnet RPC has an untrusted intermediate CA that browsers reject.
// We proxy all RPC calls through /api/rpc-proxy (server-side, SSL bypassed).
const RPC_URL = typeof window === 'undefined'
  ? 'https://rpc.testnet.arc.network'   // server-side: direct (NODE_TLS_REJECT_UNAUTHORIZED=0 set in next.config.ts)
  : '/api/rpc-proxy'                     // browser: proxy through Next.js API route

export const arcTestnet = defineChain({
  id: 5042002,
  name: 'Arc Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'USD Coin',
    symbol: 'USDC',
  },
  rpcUrls: {
    default: {
      http: [RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'ArcScan',
      url: 'https://testnet.arcscan.app',
    },
  },
  testnet: true,
})

export const wagmiConfig = getDefaultConfig({
  appName: 'Meridex',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [arcTestnet],
  ssr: true,
  // Reduce unnecessary refetches — balance polling every 12s is sufficient
  pollingInterval: 12_000,
})
