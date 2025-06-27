import { ICON_PROVIDER_IDS } from '@/constants'
import { fsp } from '@/lib/fs'
import path from 'path'
import { scrapeIcons } from './scrape'

async function getAllIcons(outputDir: string): Promise<void> {
  await fsp.mkdir(outputDir, { recursive: true })
  await Promise.all(
    ICON_PROVIDER_IDS.map(async (provider) => {
      const icons = await scrapeIcons(provider)
      // TODO: upload icons to db
    }),
  )
}

const outputDir = path.join(process.cwd(), 'icons')
await getAllIcons(outputDir)
