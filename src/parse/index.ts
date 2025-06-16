import { fsp } from '@/lib/fs.js'
import { logger } from '@/lib/logs/index.js'
import { getHeroIcons } from './heroIcons.js'
import { getLucideIcons } from './lucide.js'

async function createIconsList(filepath: string) {
  try {
    const iconProviders = await Promise.all([
      getHeroIcons(),
      getLucideIcons(),
      // TODO: Simple Icons
      // TODO: FontAwesome Free
      // TODO: Feather
    ])
    const icons = iconProviders.flat()

    await fsp.writeFile(filepath, JSON.stringify(icons, null, 2))
    logger.info(`Successfully generated icon list with ${icons.length} icons`)
  } catch (error) {
    logger.error('Error generating icon list:', error)
    process.exit(1)
  }
}

export { createIconsList }
