import { ICON_PROVIDER_SLUGS, ICON_PROVIDERS } from '@/constants'
import { supabaseAdmin } from '@/lib/clients/server'
import { serverLogger } from '@/lib/logs/server'

async function validateProviderRecords() {
  serverLogger.info('Validating provider records in database...')

  let allValid = true

  for (const providerSlug of ICON_PROVIDER_SLUGS) {
    const { git } = ICON_PROVIDERS[providerSlug]

    const { data: providers, error } = await supabaseAdmin
      .from('provider')
      .select('*')
      .eq('git_url', git.url)

    if (error) {
      serverLogger.error(`Error querying provider ${providerSlug}:`, error)
      allValid = false
      continue
    }

    if (!providers || providers.length === 0) {
      serverLogger.error(
        `No provider record found for ${providerSlug} (${git.url})`,
      )
      allValid = false
    } else if (providers.length > 1) {
      serverLogger.error(
        `Multiple provider records found for ${providerSlug} (${git.url}): ${providers.length} records`,
      )
      allValid = false
    } else {
      serverLogger.info(
        `✅ Found exactly 1 provider record for ${providerSlug}`,
        {
          providerSlug,
          provider: providers[0],
        },
      )
    }
  }

  if (allValid) {
    serverLogger.info('✅ All provider records validation passed!')
  } else {
    serverLogger.error('❌ Provider records validation failed!')
    process.exit(1)
  }
}

validateProviderRecords()
