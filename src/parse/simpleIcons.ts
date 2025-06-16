import { Icon } from '@/constants.js'
import { getIconDir } from '@/lib/fs.js'
import { logger } from '@/lib/logs/index.js'
import { getIconsFromDir } from './utils.js'

async function getSimpleIcons(): Promise<Icon[]> {
  const iconsDir = await getIconDir('simple_icons')
  const icons = await getIconsFromDir(iconsDir, 'simple_icons')
  logger.info('Simple Icons parsed', { count: icons.length })
  return icons
}

export { getSimpleIcons }
