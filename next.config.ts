import { SERVER_ENV } from '@/env/server'
import { withSentryConfig } from '@sentry/nextjs'
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

// Note: Next.config runs before our env validation, so we need to access process.env directly here
// This is the only exception where we use process.env directly
const nextConfig = withSentryConfig(getNextConfig(), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  org: SERVER_ENV.SENTRY_ORG,
  project: SERVER_ENV.SENTRY_PROJECT,
  silent: !process.env['CI'],
  widenClientFileUpload: true, // Upload a larger set of source maps for prettier stack traces (increases build time)
  reactComponentAnnotation: {
    enabled: true,
  },
  sourcemaps: {
    disable: false,
    deleteSourcemapsAfterUpload: true,
  },
  disableLogger: true, // Automatically tree-shake Sentry logger statements to reduce bundle size
  automaticVercelMonitors: false,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: true,
})

export default nextConfig
