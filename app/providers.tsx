'use client'

import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from '@/lib/wagmi-config'
import { useState } from 'react'
import '@rainbow-me/rainbowkit/styles.css'

const THEME = darkTheme({
  accentColor: '#7B61FF',
  accentColorForeground: 'white',
  borderRadius: 'large',
  overlayBlur: 'small',
})

export function Providers({ children }: { children: React.ReactNode }) {
  // QueryClient must be stable — recreating it on every render resets the entire cache
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10_000,      // don't refetch within 10s
        gcTime:    5 * 60_000,  // keep cache 5 min
        retry: 1,
      },
    },
  }))

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={THEME}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
