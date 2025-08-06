import { ICON_PROVIDER_SLUGS } from '@/constants/provider'
import { serverLogger } from '@/lib/logs/server'
import fs from 'fs-extra'
import path from 'path'
import { updateIconCountSecret } from './count'
import { scrapeIcons } from './icons/scrape'
import { uploadIcons } from './icons/upload'
import { scrapeLicenses } from './licenses/scrape'
import { uploadLicenses } from './licenses/upload'

async function uploadAssets(): Promise<void> {
  const isDebug = process.argv.includes('--debug')
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

  if (isDebug) {
    const debugDir = path.join(process.cwd(), 'tmp', 'build', timestamp)
    await fs.ensureDir(debugDir)
    serverLogger.info(
      `🐛 Debug mode enabled - writing first 100 icons per provider to ${debugDir}`,
    )
  }

  // Upload icons
  let iconCount = 0
  await Promise.all(
    ICON_PROVIDER_SLUGS.map(async (provider) => {
      const icons = await scrapeIcons(provider)
      iconCount += icons.length

      if (isDebug) {
        const debugDir = path.join(process.cwd(), 'tmp', 'build', timestamp)
        const debugIcons = icons.slice(0, 100)
        const debugFile = path.join(debugDir, `${provider}.json`)
        await fs.writeFile(debugFile, JSON.stringify(debugIcons, null, 2))
        serverLogger.info(
          `🐛 Debug: Wrote ${debugIcons.length} icons for ${provider} to ${debugFile}`,
        )
      }

      try {
        await uploadIcons(icons, provider)
      } catch (error) {
        serverLogger.error(`❌ Failed to upload icons for ${provider}:`, error)
        throw error
      }
    }),
  )
  serverLogger.info(`⭐ Uploaded ${iconCount} icons`)

  // Upload licenses
  const scrapedLicenses = await scrapeLicenses()
  const uploadedLicenses = await uploadLicenses(scrapedLicenses)
  serverLogger.info(`📄 Uploaded ${uploadedLicenses.length} licenses`)

  // Update icon count in Doppler
  try {
    const finalIconCount = await updateIconCountSecret()
    serverLogger.info(`🔢 Updated ICON_COUNT in Doppler: ${finalIconCount}`)
  } catch (error) {
    serverLogger.error('Failed to update icon count in Doppler:', error)
  }

  process.exit(0) // file continues to run for some reason so we need to exit
}

await uploadAssets()
