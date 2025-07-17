import { supabaseAdmin } from '@/lib/clients/server'
import { serverLogger } from '@/lib/logs/server'
import type { License, ScrapedLicense } from '@/lib/schemas/database'

async function uploadLicenses(licenses: ScrapedLicense[]): Promise<License[]> {
  serverLogger.info('Starting license upload process...')
  return await Promise.all(licenses.map(upsertLicense))
}

async function upsertLicense(scrapedLicense: ScrapedLicense): Promise<License> {
  // Check if license already exists for this provider
  const { data: existingLicense } = await supabaseAdmin
    .from('license')
    .select('*')
    .eq('provider_id', scrapedLicense.provider_id)
    .maybeSingle()
    .throwOnError()

  if (existingLicense) {
    // Update existing license
    const { data: updatedLicense } = await supabaseAdmin
      .from('license')
      .update({
        type: scrapedLicense.type,
        url: scrapedLicense.url,
      })
      .eq('id', existingLicense.id)
      .select()
      .single()
      .throwOnError()

    serverLogger.debug(
      `Updated license for provider ${scrapedLicense.provider_id}`,
    )
    return updatedLicense
  } else {
    // Create new license
    const { data: newLicense } = await supabaseAdmin
      .from('license')
      .insert({
        type: scrapedLicense.type,
        url: scrapedLicense.url,
        provider_id: scrapedLicense.provider_id,
      })
      .select()
      .single()
      .throwOnError()

    serverLogger.debug(
      `Created new license for provider ${scrapedLicense.provider_id}`,
    )
    return newLicense
  }
}

export { uploadLicenses }
