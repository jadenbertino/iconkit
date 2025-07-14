import { ICON_PROVIDER_SLUGS } from '@/constants'
import { serverLogger } from '@/lib/logs/server'
import { scrapeIcons } from './icons/scrape'
import { uploadIcons } from './icons/upload'

async function uploadAssets(): Promise<void> {
  // Upload icons
  let count = 0
  await Promise.all(
    ICON_PROVIDER_SLUGS.map(async (provider) => {
      const icons = await scrapeIcons(provider)
      count += icons.length
      await uploadIcons(icons, provider)
    }),
  )
  serverLogger.info(`⭐ Uploaded ${count} icons`)

  // Upload licenses

  process.exit(0) // file continues to run for some reason so we need to exit
}

await uploadAssets()
