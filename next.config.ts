import type { NextConfig } from 'next'

function getNextConfig(): NextConfig {
  return {
    eslint: {
      ignoreDuringBuilds: true, // we lint manually in the build script
    },
    async headers() {
      return [
        {
          source: '/(.*)', // Apply to all routes
          headers: securityHeaders,
        },
      ]
    },
  }
}

const securityHeaders = [
  {
    // Prevents your site from being embedded in iframes to stop clickjacking.
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    // Stops browsers from MIME-sniffing content types to prevent XSS.
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    // Sends full referrer on same-origin requests, only origin on cross-origin, and nothing when downgrading from HTTPS to HTTP.
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    // Enforces HTTPS and protects against downgrade attacks.
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

const nextConfig = getNextConfig()

export default nextConfig
