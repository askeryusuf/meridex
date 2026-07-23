import type { NextConfig } from "next";

// Arc Testnet RPC uses an untrusted intermediate CA — allow Node.js to connect
// This only affects server-side requests; browser TLS is unaffected
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
    resolveAlias: {
      '@x402/core': './lib/x402-stub.js',
      '@x402/core/client': './lib/x402-stub.js',
      '@x402/evm': './lib/x402-stub.js',
      '@x402/evm/exact/client': './lib/x402-stub.js',
      '@x402/evm/upto/client': './lib/x402-stub.js',
      '@x402/svm': './lib/x402-stub.js',
      '@x402/svm/exact/client': './lib/x402-stub.js',
      '@coinbase/cdp-sdk': './lib/x402-stub.js',
      '@base-org/account': './lib/x402-stub.js',
    },
  },
  serverExternalPackages: [
    '@walletconnect/sign-client',
    '@walletconnect/core',
    '@walletconnect/utils',
    '@web3modal/wagmi',
  ],
};

export default nextConfig;
