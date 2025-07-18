import type { IconProviderSlug } from '@/constants'
import { ICON_PROVIDERS } from '@/constants'
import { supabaseAdmin } from '@/lib/clients/server'
import { serverLogger } from '@/lib/logs/server'
import type { Provider } from '@/lib/schemas/database'

/**
 * Get a provider record from the database. If it doesn't exist, create it.
 * @param providerSlug - The slug of the provider to get.
 * @returns The provider record.
 */
async function getProviderRecord(
  providerSlug: IconProviderSlug,
): Promise<Provider> {
  const { name, git } = ICON_PROVIDERS[providerSlug]

  // Check if provider already exists
  const { data: existingProvider } = await supabaseAdmin
    .from('provider')
    .select('*')
    .eq('git_url', git.url)
    .maybeSingle()
    .throwOnError()

  if (existingProvider) {
    return existingProvider
  }

  // Create provider if it doesn't exist
  const { data: newProvider } = await supabaseAdmin
    .from('provider')
    .insert({
      name,
      git_url: git.url,
      git_branch: git.branch,
      git_icons_dir: git.iconsDir,
    })
    .select()
    .single()
    .throwOnError()
  // Keep this log, we want to know if a new provider is created, it's probably a mistake.
  serverLogger.info(`🚀 Created new provider: ${newProvider.id}`, {
    providerSlug,
  })
  return newProvider
}

export { getProviderRecord }
