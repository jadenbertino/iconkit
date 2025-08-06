import { SERVER_ENV, type DopplerEnvSlug } from '@/env/server'
import { getVersionFromChangelog } from '@/env/utils'
import { doppler } from '@/lib/clients/server'
import { serverLogger } from '@/lib/logs/server'

/**
 * Updates the NEXT_PUBLIC_VERSION secret in Doppler with the version from CHANGELOG.md
 * @param envSlug - The Doppler config environment (dev, staging, production)
 * @returns Promise<string> - The updated version string
 */
async function updateVersionSecret(
  envSlug: DopplerEnvSlug = SERVER_ENV.DOPPLER_ENV_SLUG,
): Promise<string> {
  const version = getVersionFromChangelog()
  try {
    await doppler.secrets.update({
      project: 'iconkit',
      config: envSlug,
      secrets: {
        NEXT_PUBLIC_VERSION: version,
      },
    })

    serverLogger.info(
      `✅ Updated NEXT_PUBLIC_VERSION in ${envSlug} to ${version}`,
    )
    return version
  } catch (error) {
    serverLogger.error(
      `❌ Failed to update NEXT_PUBLIC_VERSION in Doppler:`,
      error,
    )
    throw error
  }
}

updateVersionSecret()
  .then((version) => {
    serverLogger.info(`📝 Updated VERSION in Doppler: ${version}`)
    process.exit(0)
  })
  .catch((error) => {
    serverLogger.error('Failed to update version in Doppler:', error)
    process.exit(1)
  })
