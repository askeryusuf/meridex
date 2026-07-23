'use client'

import { useBalance, useReadContract } from 'wagmi'
import { arcTestnet } from './wagmi-config'

const ERC20_BALANCE_OF_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

/**
 * Returns a formatted balance string for any Arc Testnet token.
 *
 * USDC is the native token (18 decimals on-chain, displayed as 6-decimal USDC).
 * EURC and cirBTC are ERC-20 — we call balanceOf directly instead of using
 * wagmi's useBalance, which also fetches decimals() and symbol() causing extra
 * RPC calls that rate-limit on Arc Testnet.
 */
export function useArcTokenBalance(
  walletAddress: `0x${string}` | undefined,
  symbol: string,
  tokenAddress: `0x${string}`,
  decimals: number,
): string {
  const isNative = symbol === 'USDC'

  // Native USDC balance
  const { data: nativeData } = useBalance({
    address: walletAddress,
    chainId: arcTestnet.id,
    query: {
      enabled: isNative && !!walletAddress,
      staleTime: 30_000,
      refetchInterval: 30_000,
    },
  })

  // ERC-20 balanceOf (EURC, cirBTC)
  const { data: erc20Data } = useReadContract({
    address: tokenAddress,
    abi: ERC20_BALANCE_OF_ABI,
    functionName: 'balanceOf',
    args: walletAddress ? [walletAddress] : undefined,
    chainId: arcTestnet.id,
    query: {
      enabled: !isNative && !!walletAddress,
      staleTime: 30_000,
      refetchInterval: 30_000,
    },
  })

  if (!walletAddress) return '—'

  if (isNative) {
    if (nativeData == null) return '—'
    const val = Number(nativeData.value) / 1e18
    return val > 0 ? val.toFixed(4) : '0'
  } else {
    if (erc20Data == null) return '—'
    const val = Number(erc20Data) / Math.pow(10, decimals)
    return val > 0 ? val.toFixed(4) : '0'
  }
}
