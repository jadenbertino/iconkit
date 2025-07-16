import { z } from 'zod'

function validateClientEnv() {
  const clientSchema = z.object({
    ENVIRONMENT: z.enum(['development', 'staging', 'production']),
    SUPABASE_PROJECT_ID: z.string(),
    SUPABASE_ANON_KEY: z.string(),
    VERSION: z.string(),
  })

  // Need to set process.env.KEYNAME because next.js inlines at build time
  type ClientEnvKeys = keyof z.infer<typeof clientSchema>
  const rawClientEnv: Record<ClientEnvKeys, string | undefined> = {
    ENVIRONMENT: process.env['NEXT_PUBLIC_ENVIRONMENT'],
    SUPABASE_ANON_KEY: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    SUPABASE_PROJECT_ID: process.env['NEXT_PUBLIC_SUPABASE_PROJECT_ID'],
    VERSION: process.env['NEXT_PUBLIC_VERSION'],
  }

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
  }
}

const CLIENT_ENV = validateClientEnv()

export { CLIENT_ENV }
