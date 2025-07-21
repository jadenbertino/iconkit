import { z } from 'zod'
import { CLIENT_ENV } from './client'

type Environment = (typeof CLIENT_ENV)['ENVIRONMENT']
type DopplerEnvSlug = 'dev' | 'preview' | 'prd'

function validateServerEnv() {
  const serverSchema = z.object({
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
    DOPPLER_TOKEN: z.string(),
  })

  const serverValidation = serverSchema.safeParse(process.env)

  if (!serverValidation.success) {
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

const SERVER_ENV = {
  ...CLIENT_ENV, // all client env vars are also available on the server
  ...validateServerEnv(),
  DOPPLER_ENV_SLUG: getDopplerEnvSlug(CLIENT_ENV.ENVIRONMENT),
}

export { SERVER_ENV }
export type { DopplerEnvSlug }
