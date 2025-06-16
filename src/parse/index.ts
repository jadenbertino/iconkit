import { ICONS_JSON_FILEPATH, IconSchema } from '@/constants.js'
import { fsp, readJsonFile } from '@/lib/fs.js'
import { logger } from '@/lib/logs/index.js'
import { z } from 'zod'
import { getHeroIcons } from './heroIcons.js'

async function createIconsList() {
  try {
    const iconProviders = await Promise.all([getHeroIcons()])
    const icons = iconProviders.flatMap((icons) => icons)

    await fsp.writeFile(ICONS_JSON_FILEPATH, JSON.stringify(icons, null, 2))
    logger.info(`Successfully generated icon list with ${icons.length} icons`)
  } catch (error) {
    logger.error('Error generating icon list:', error)
    process.exit(1)
  }
}

const result = await readJsonFile(ICONS_JSON_FILEPATH, z.array(IconSchema))
console.log(result.slice(0, 5))
