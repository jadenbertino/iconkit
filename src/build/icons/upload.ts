import type { IconProviderSlug } from '@/constants'
import { SERVER_ENV } from '@/env/server'
import { supabaseAdmin } from '@/lib/clients/server'
import { serverLogger } from '@/lib/logs/server'
import Bottleneck from 'bottleneck'
import { getProviderRecord } from '../providers'
import type { ScrapedIconWithTags } from './tags'

const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 100,
})

async function uploadIcons(
  icons: ScrapedIconWithTags[],
  providerSlug: IconProviderSlug,
) {
  const provider = await getProviderRecord(providerSlug)
  const BATCH_SIZE = 1000

  // In production, check if icons already exist for this version (read-only protection)
  if (SERVER_ENV.ENVIRONMENT === 'production') {
    const { data: existingIcons } = await supabaseAdmin
      .from('icon')
      .select('id')
      .eq('provider_id', provider.id)
      .eq('build_id', SERVER_ENV.BUILD_ID)
      .limit(1)
      .throwOnError()

    if (existingIcons && existingIcons.length > 0) {
      throw new Error(
        `Production icons are read-only. Icons for ${providerSlug} build_id ${SERVER_ENV.BUILD_ID} already exist.`,
      )
    }

    serverLogger.info(
      `✅ Production check passed: No existing icons for ${providerSlug} build_id ${SERVER_ENV.BUILD_ID}`,
    )
  } else {
    // Non-production: Clear existing icons for this provider and build_id in batches
    let totalDeleteCount = 0
    const DELETE_BATCH_SIZE = 1000

    while (true) {
      // Get a batch of icon IDs to delete
      const { data: iconsToDelete } = await supabaseAdmin
        .from('icon')
        .select('id')
        .eq('provider_id', provider.id)
        .eq('build_id', SERVER_ENV.BUILD_ID)
        .limit(DELETE_BATCH_SIZE)
        .throwOnError()

      if (!iconsToDelete || iconsToDelete.length === 0) {
        break // No more icons to delete
      }

      // Delete this batch
      const iconIds = iconsToDelete.map((icon) => icon.id)
      const { count: batchDeleteCount } = await supabaseAdmin
        .from('icon')
        .delete({ count: 'exact' })
        .in('id', iconIds)
        .throwOnError()

      totalDeleteCount += batchDeleteCount || 0
      serverLogger.debug(
        `💀 Deleted batch: ${batchDeleteCount || 0} icons (total: ${totalDeleteCount})`,
      )

      // If we deleted fewer than the batch size, we're done
      if (iconsToDelete.length < DELETE_BATCH_SIZE) {
        break
      }
    }

    serverLogger.info(`💀 Cleared ${totalDeleteCount} existing icons.`, {
      provider: {
        slug: providerSlug,
        ...provider,
      },
      build_id: SERVER_ENV.BUILD_ID,
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
      await supabaseAdmin.from('icon').insert(batch).throwOnError()
    })
  }
  serverLogger.info(
    `✅ Successfully uploaded ${icons.length} icons for ${providerSlug}`,
  )
}

export { uploadIcons }
