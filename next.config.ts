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
    // Sends full referrer on same-origin requests, only origin on cross-origin.
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    // Disables access to camera, mic, and geolocation in the browser.
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    // Enforces HTTPS for 2 years including subdomains; eligible for HSTS preload.
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    // Restricts what sources are allowed for scripts, styles, images, etc.
    // Helps block XSS and injection attacks.
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      font-src 'self';
      connect-src 'self';
      frame-ancestors 'none';
    `
      .replace(/\s{2,}/g, ' ')
      .trim(),
  },
]

const nextConfig = getNextConfig()

export default nextConfig
