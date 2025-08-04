import { SERVER_ENV, type DopplerEnvSlug } from '@/env/server'
import { doppler, supabaseAdmin } from '@/lib/clients/server'

/**
 * Counts the number of icon records in the database for a given build ID
 * @param buildId - The build ID string to count icons for
 * @returns Promise<number> - The count of icons for the specified build ID
 */
async function countIcons(
  buildId: string = SERVER_ENV.BUILD_ID,
): Promise<number> {
  const { count } = await supabaseAdmin
    .from('icon')
    .select('*', { count: 'exact', head: true })
    .eq('version', buildId)
    .throwOnError()
  if (count === null) {
    throw new Error('Failed to count icons')
  }
  return count
}

/**
 * Updates the ICON_COUNT secret in Doppler with the current icon count
 * @param buildId - The build ID to count icons for (defaults to current build ID)
 * @param envSlug - The Doppler config environment (dev, staging, production)
 * @returns Promise<number> - The updated icon count
 */
async function updateIconCountSecret(
  buildId: string = SERVER_ENV.BUILD_ID,
  envSlug: DopplerEnvSlug = SERVER_ENV.DOPPLER_ENV_SLUG,
): Promise<number> {
  const count = await countIcons(buildId)
  try {
    await doppler.secrets.update({
      project: 'iconkit',
      config: envSlug,
      secrets: {
        NEXT_PUBLIC_ICON_COUNT: count.toString(),
      },
    })

    console.log(`✅ Updated NEXT_PUBLIC_ICON_COUNT in ${envSlug} to ${count}`)
    return count
  } catch (error) {
    console.error(
      `❌ Failed to update NEXT_PUBLIC_ICON_COUNT in Doppler:`,
      error,
    )
    throw error
  }
}

export { countIcons, updateIconCountSecret }
