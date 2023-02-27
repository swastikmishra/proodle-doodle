/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_STRIPE_API_KEY: process.env.NEXT_PUBLIC_STRIPE_API_KEY,
    NEXT_PUBLIC_SOLANA_CLUSTER_RPC: process.env.NEXT_PUBLIC_SOLANA_CLUSTER_RPC,
  },
  experimental: {
    appDir: true,
    fontLoaders: [
      { loader: "@next/font/google", options: { subsets: ["latin"] } },
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.ap-southeast-1.amazonaws.com",
        port: "",
        pathname: "/test.nftmarketplace.swastikmishra.me/**",
      },
    ],
  },
};

module.exports = nextConfig;
