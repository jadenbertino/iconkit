import { SERVER_ENV, type DopplerEnvSlug } from '@/env/server'
import { doppler, supabaseAdmin } from '@/lib/clients/server'

/**
 * Counts the number of icon records in the database for a given version
 * @param version - The version string to count icons for
 * @returns Promise<number> - The count of icons for the specified version
 */
async function countIcons(
  version: string = SERVER_ENV.VERSION,
): Promise<number> {
  const { count } = await supabaseAdmin
    .from('icon')
    .select('*', { count: 'exact', head: true })
    .eq('version', version)
    .throwOnError()
  if (count === null) {
    throw new Error('Failed to count icons')
  }
  return count
}

/**
 * Updates the ICON_COUNT secret in Doppler with the current icon count
 * @param version - The version to count icons for (defaults to current version)
 * @param env - The Doppler config environment (dev, staging, production)
 * @returns Promise<number> - The updated icon count
 */
async function updateIconCountSecret(
  version: string = SERVER_ENV.VERSION,
  envSlug: DopplerEnvSlug = SERVER_ENV.DOPPLER_ENV_SLUG,
): Promise<number> {
  const count = await countIcons(version)
  try {
    await doppler.secrets.update({
      project: 'iconkit',
      config: envSlug,
      secrets: {
        ICON_COUNT: count.toString(),
      },
    })

    console.log(`✅ Updated ICON_COUNT in ${envSlug} to ${count}`)
    return count
  } catch (error) {
    console.error(`❌ Failed to update ICON_COUNT in Doppler:`, error)
    throw error
  }
}

export { countIcons, updateIconCountSecret }
