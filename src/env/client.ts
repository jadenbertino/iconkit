import fs from 'fs'
import path from 'path'
import { z } from 'zod'

function validateClientEnv() {
  const clientSchema = z.object({
    ENVIRONMENT: z.enum(['development', 'staging', 'production']),
    VERSION: z.string().default(getVersionFromChangelog()),
  })

  const clientValidation = clientSchema.safeParse(getRawClientEnv())
  if (!clientValidation.success) {
    console.error(
      `❌ Invalid client environment variables`,
      clientValidation.error.flatten().fieldErrors,
    )
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

function getRawClientEnv() {
  const clientEnv: Record<string, string | undefined> = {}

  // Process all NEXT_PUBLIC_ environment variables and remove the prefix
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('NEXT_PUBLIC_')) {
      const unprefixedKey = key.replace('NEXT_PUBLIC_', '')
      clientEnv[unprefixedKey] = process.env[key]
    }
  })

  return clientEnv
}

const CLIENT_ENV = validateClientEnv()

export { CLIENT_ENV }
