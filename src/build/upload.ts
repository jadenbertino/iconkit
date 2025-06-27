import type { IconProviderId } from '@/constants'
import { ICON_PROVIDERS } from '@/constants'
import { supabaseAdmin } from '@/lib/clients/server'
import { serverLogger } from '@/lib/logs/server'
import type { Provider, ScrapedIcon } from '@/lib/schemas/database'
import Bottleneck from 'bottleneck'

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 100,
})

async function uploadIcons(icons: ScrapedIcon[], providerId: IconProviderId) {
  const provider = await getProviderRecord(providerId)
  const BATCH_SIZE = 1000

  const iconsToInsert = icons.map((icon) => ({
    ...icon,
    provider_id: provider.id,
    created_at: new Date().toISOString(),
  }))

  serverLogger.debug(
    `Uploading ${icons.length} icons for ${providerId} in batches of ${BATCH_SIZE}`,
  )

  for (let i = 0; i < iconsToInsert.length; i += BATCH_SIZE) {
    const batch = iconsToInsert.slice(i, i + BATCH_SIZE)
    await limiter.schedule(async () => {
      const { error } = await supabaseAdmin.from('icon').insert(batch)
      if (error) throw error
    })
  }
  serverLogger.info(
    `✅ Successfully uploaded ${icons.length} icons for ${providerId}`,
  )
}

async function getProviderRecord(
  providerId: IconProviderId,
): Promise<Provider> {
  const { name, git } = ICON_PROVIDERS[providerId]

  // Check if provider already exists
  const { data: existingProvider, error: getProviderError } =
    await supabaseAdmin
      .from('provider')
      .select('*')
      .eq('git_url', git.url)
      .maybeSingle()

  if (getProviderError) {
    throw getProviderError
  }

  if (existingProvider) {
    return existingProvider
  }

  // Create provider if it doesn't exist
  const { data: newProvider, error: createProviderError } = await supabaseAdmin
    .from('provider')
    .insert({
      name,
      git_url: git.url,
      git_branch: git.branch,
      git_icons_dir: git.iconsDir,
    })
    .select()
    .single()
  if (createProviderError) throw createProviderError
  return newProvider
}

export { uploadIcons }
