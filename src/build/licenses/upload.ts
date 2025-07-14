import { supabaseAdmin } from '@/lib/clients/server'
import { serverLogger } from '@/lib/logs/server'
import type { License, ScrapedLicense } from '@/lib/schemas/database'

async function uploadLicenses(licenses: ScrapedLicense[]): Promise<License[]> {
  serverLogger.info('Starting license upload process...')
  return await Promise.all(licenses.map(upsertLicense))
}

async function upsertLicense(scrapedLicense: ScrapedLicense): Promise<License> {
  // Check if license already exists for this provider
  const { data: existingLicense, error: getError } = await supabaseAdmin
    .from('license')
    .select('*')
    .eq('provider_id', scrapedLicense.provider_id)
    .maybeSingle()

  if (getError) {
    throw new Error(
      `Failed to check existing license for provider ${scrapedLicense.provider_id}: ${getError.message}`,
    )
  }

  if (existingLicense) {
    // Update existing license
    const { data: updatedLicense, error: updateError } = await supabaseAdmin
      .from('license')
      .update({
        type: scrapedLicense.type,
        url: scrapedLicense.url,
      })
      .eq('id', existingLicense.id)
      .select()
      .single()

    if (updateError) {
      throw new Error(
        `Failed to update license for provider ${scrapedLicense.provider_id}: ${updateError.message}`,
      )
    }

    serverLogger.debug(
      `Updated license for provider ${scrapedLicense.provider_id}`,
    )
    return updatedLicense
  } else {
    // Create new license
    const { data: newLicense, error: createError } = await supabaseAdmin
      .from('license')
      .insert({
        type: scrapedLicense.type,
        url: scrapedLicense.url,
        provider_id: scrapedLicense.provider_id,
      })
      .select()
      .single()

    if (createError) {
      throw new Error(
        `Failed to create license for provider ${scrapedLicense.provider_id}: ${createError.message}`,
      )
    }

    serverLogger.debug(
      `Created new license for provider ${scrapedLicense.provider_id}`,
    )
    return newLicense
  }
}

export { uploadLicenses }
