import * as Sentry from '@sentry/nextjs'
import { CLIENT_ENV } from './src/env/client'

Sentry.init({
  dsn: CLIENT_ENV.SENTRY_DSN,
  sendDefaultPii: true,
  release: CLIENT_ENV.VERSION,
  environment: CLIENT_ENV.ENVIRONMENT,
  tracesSampleRate: CLIENT_ENV.ENVIRONMENT === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: CLIENT_ENV.ENVIRONMENT === 'production' ? 0.01 : 1.0,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  beforeSend(event) {
    // Filter out noisy errors if needed
    return event
  },
})