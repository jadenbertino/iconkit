import { ICON_PROVIDER_SLUGS } from '@/constants'
import { serverLogger } from '@/lib/logs/server'
import { scrapeIcons } from './icons/scrape'
import { uploadIcons } from './icons/upload'
import { scrapeLicenses } from './licenses/scrape'
import { uploadLicenses } from './licenses/upload'

async function uploadAssets(): Promise<void> {
  // Upload icons
  let iconCount = 0
  await Promise.all(
    ICON_PROVIDER_SLUGS.map(async (provider) => {
      const icons = await scrapeIcons(provider)
      iconCount += icons.length
      await uploadIcons(icons, provider)
    }),
  )
  serverLogger.info(`⭐ Uploaded ${iconCount} icons`)

  // Upload licenses
  const scrapedLicenses = await scrapeLicenses()
  const uploadedLicenses = await uploadLicenses(scrapedLicenses)
  serverLogger.info(`📄 Uploaded ${uploadedLicenses.length} licenses`)

  process.exit(0) // file continues to run for some reason so we need to exit
}

await uploadAssets()
