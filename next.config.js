/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
  output: 'standalone',
  // Generate build ID based on git commit or timestamp
  generateBuildId: async () => {
    // Use git commit hash if available, otherwise use timestamp
    try {
      const { execSync } = require('child_process')
      const gitHash = execSync('git rev-parse --short HEAD').toString().trim()
      return `build-${gitHash}`
    } catch {
      return `build-${Date.now()}`
    }
  },
  // Add cache headers to prevent stale chunks
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/data/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

