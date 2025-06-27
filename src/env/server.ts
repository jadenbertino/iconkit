import { fs } from '@/lib/fs'
import path from 'path'
import { z } from 'zod'
import { CLIENT_ENV } from './client'

function validateServerEnv() {
  const serverSchema = z.object({
    VERSION: z.string().default(getVersionFromChangelog()),
    SUPABASE_SERVICE_ROLE_KEY: z.string(),
  })

  const serverValidation = serverSchema.safeParse(process.env)

  if (!serverValidation.success) {
    console.error(
      '❌ Invalid server environment variables:',
      serverValidation.error.flatten().fieldErrors,
    )
    throw new Error('Invalid server environment variables')
  }

  return {
    ...CLIENT_ENV, // all client env vars are also available on the server
    ...serverValidation.data,
  }
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

const SERVER_ENV = validateServerEnv()

export { SERVER_ENV }
