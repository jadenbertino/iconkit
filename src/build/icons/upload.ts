import type { IconProviderSlug } from '@/constants'
import { SERVER_ENV } from '@/env/server'
import { supabaseAdmin } from '@/lib/clients/server'
import { serverLogger } from '@/lib/logs/server'
import type { ScrapedIcon } from '@/lib/schemas/database'
import Bottleneck from 'bottleneck'
import { getProviderRecord } from '../providers'

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 100,
})

async function uploadIcons(
  icons: ScrapedIcon[],
  providerSlug: IconProviderSlug,
) {
  const provider = await getProviderRecord(providerSlug)
  const BATCH_SIZE = 1000

  // In production, check if icons already exist for this version (read-only protection)
  if (SERVER_ENV.ENVIRONMENT === 'production') {
    const { data: existingIcons, error: checkError } = await supabaseAdmin
      .from('icon')
      .select('id')
      .eq('provider_id', provider.id)
      .eq('version', SERVER_ENV.VERSION)
      .limit(1)

    if (checkError) {
      throw new Error(
        `Failed to check existing icons for ${providerSlug}: ${checkError.message}`,
      )
    }

    if (existingIcons && existingIcons.length > 0) {
      throw new Error(
        `Production icons are read-only. Icons for ${providerSlug} version ${SERVER_ENV.VERSION} already exist.`,
      )
    }

    serverLogger.info(
      `✅ Production check passed: No existing icons for ${providerSlug} version ${SERVER_ENV.VERSION}`,
    )
  } else {
    // Non-production: Clear existing icons for this provider and version
    const { error: deleteError, count: deleteCount } = await supabaseAdmin
      .from('icon')
      .delete({ count: 'exact' })
      .eq('provider_id', provider.id)
      .eq('version', SERVER_ENV.VERSION)

    if (deleteError) {
      throw new Error(
        `Failed to clear existing icons for ${providerSlug}: ${deleteError.message}`,
      )
    }

    serverLogger.info(`💀 Cleared ${deleteCount || 0} existing icons.`, {
      provider: {
        slug: providerSlug,
        ...provider,
      },
      version: SERVER_ENV.VERSION,
    })
  }

  const iconsToInsert = icons.map((icon) => ({
    ...icon,
    provider_id: provider.id,
    created_at: new Date().toISOString(),
  }))

  serverLogger.debug(
    `Uploading ${icons.length} icons for ${providerSlug} in batches of ${BATCH_SIZE}`,
  )

  for (let i = 0; i < iconsToInsert.length; i += BATCH_SIZE) {
    const batch = iconsToInsert.slice(i, i + BATCH_SIZE)
    await limiter.schedule(async () => {
      const { error } = await supabaseAdmin.from('icon').insert(batch)
      if (error) throw error
    })
  }
  serverLogger.info(
    `✅ Successfully uploaded ${icons.length} icons for ${providerSlug}`,
  )
}

export { uploadIcons }
