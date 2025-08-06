import { z } from 'zod'
import { CLIENT_ENV } from './client'

type Environment = (typeof CLIENT_ENV)['ENVIRONMENT']
type DopplerEnvSlug = 'dev' | 'preview' | 'prd'

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  DOPPLER_TOKEN: z.string(),
  // Sentry
  SENTRY_ORG: z.string().describe('Sentry Org Slug'),
  SENTRY_PROJECT: z.string().describe('Sentry Project Slug'),
  SENTRY_AUTH_TOKEN: z.string().describe('Sentry Org Auth Token'),
})

function validateServerEnv() {
  const serverValidation = serverSchema.safeParse(process.env)
  if (!serverValidation.success) {
    // eslint-disable-next-line custom/no-console-methods
    console.error(
      '❌ Invalid server environment variables:',
      serverValidation.error.flatten().fieldErrors,
    )
    throw new Error('Invalid server environment variables')
  }

  return serverValidation.data
}

function getDopplerEnvSlug(env: Environment): DopplerEnvSlug {
  switch (env) {
    case 'development':
      return 'dev'
    case 'staging':
      return 'preview'
    case 'production':
      return 'prd'
    default:
      throw new Error('Invalid environment')
  }
}

/**
 * Call this to display the required environment variables
 */
// @ts-expect-error - This function is currently unused but kept for self-documentation use
function _displayRequiredEnv() {
  const requiredKeys = Object.keys(serverSchema.shape).map(
    (key) => `NEXT_PUBLIC_${key}`,
  )
  const requiredEnv = requiredKeys
    .map((key) => process.env[key])
    .filter(Boolean)
  // eslint-disable-next-line custom/no-console-methods
  console.log('Required environment variables:', requiredEnv)
}

const SERVER_ENV = {
  ...CLIENT_ENV, // all client env vars are also available on the server
  ...validateServerEnv(),
  DOPPLER_ENV_SLUG: getDopplerEnvSlug(CLIENT_ENV.ENVIRONMENT),
}

export { SERVER_ENV }
export type { DopplerEnvSlug }
