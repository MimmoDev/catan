/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  output: 'standalone',
  // Ensure proper asset serving
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : undefined,
  // Disable static optimization issues
  experimental: {
    outputFileTracingIncludes: {
      '/': ['./data/**/*'],
    },
  },
}

module.exports = nextConfig

