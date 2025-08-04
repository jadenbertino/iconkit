import { z } from 'zod'

const clientSchema = z.object({
  ENVIRONMENT: z.enum(['development', 'staging', 'production']),
  SUPABASE_PROJECT_ID: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  VERSION: z.string(),
  ICON_COUNT: z.coerce.number().int().positive(),
})
type ClientEnvKeys = keyof z.infer<typeof clientSchema>

const rawClientEnv: Record<ClientEnvKeys, string | undefined> = {
  ENVIRONMENT: process.env['NEXT_PUBLIC_ENVIRONMENT'],
  SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  SUPABASE_PROJECT_ID: process.env['NEXT_PUBLIC_SUPABASE_PROJECT_ID'],
  VERSION: '0.0.1', // during build we validate that changelog matches this. TOOD: scrape & update doppler during build process
  ICON_COUNT: process.env['NEXT_PUBLIC_ICON_COUNT'],
}

function validateClientEnv() {
  // Internally we don't use the NEXT_PUBLIC_ prefix so that they are easier to access
  // But when you pass the environment variables you'll need to use the NEXT_PUBLIC_ prefix
  const clientValidation = clientSchema.safeParse(rawClientEnv)
  if (!clientValidation.success) {
    // Map the unprefixed error keys back to their NEXT_PUBLIC_ versions for clearer error messages
    const prefixedErrors: Record<string, string[]> = {}
    for (const [key, errors] of Object.entries(
      clientValidation.error.flatten().fieldErrors,
    )) {
      const prefixedKey = `NEXT_PUBLIC_${key}`
      prefixedErrors[prefixedKey] = errors || []
    }

    console.error(`❌ Invalid client environment variables:`, prefixedErrors)
    throw new Error('Invalid client environment variables')
  }

  const env = clientValidation.data
  return {
    ...env,
    SUPABASE_URL: `https://${env.SUPABASE_PROJECT_ID}.supabase.co`,
    BUILD_ID: `${env.VERSION}-${env.ENVIRONMENT}`,
  }
}

/**
 * Call this to display the required environment variables
 */
// @ts-ignore
function displayRequiredEnv() {
  const requiredKeys = Object.keys(clientSchema.shape).map(
    (key) => `NEXT_PUBLIC_${key}`,
  )
  const requiredEnv = requiredKeys
    .map((key) => process.env[key])
    .filter(Boolean)
  console.log('Required environment variables:', requiredEnv)
}

const CLIENT_ENV = validateClientEnv()

export { CLIENT_ENV }
