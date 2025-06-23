import fs from 'fs'
import path from 'path'
import { z } from 'zod'

function validateClientEnv() {
  const clientSchema = z.object({
    ENVIRONMENT: z.enum(['development', 'staging', 'production']),
    VERSION: z.string().default(getVersionFromChangelog()),
  })

  // Need to set process.env.KEYNAME because next.js inlines at build time
  type ClientEnvKeys = keyof z.infer<typeof clientSchema>
  const rawClientEnv: Record<ClientEnvKeys, string | undefined> = {
    ENVIRONMENT: process.env['NEXT_PUBLIC_ENVIRONMENT'],
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

  return clientValidation.data
}

function getVersionFromChangelog(): string {
  try {
    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md')
    const content = fs.readFileSync(changelogPath, 'utf-8')
    const versionRegex = /(\d+\.\d+\.\d+)/ // e.g. 1.0.0
    const versionMatch = content.match(versionRegex)
    return versionMatch?.[1] ?? '0.0.0'
  } catch {
    return '0.0.0'
  }
}

const CLIENT_ENV = validateClientEnv()

export { CLIENT_ENV }
