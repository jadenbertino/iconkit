import { Icon } from '@/constants.js'
import { getIconDir } from '@/lib/fs.js'
import { logger } from '@/lib/logs/index.js'
import { getIconsFromDir } from './utils.js'

async function getLucideIcons(): Promise<Icon[]> {
  const iconsDir = await getIconDir('lucide')
  const icons = await getIconsFromDir(iconsDir, 'lucide')
  logger.info('Lucide Icons parsed', { count: icons.length })
  return icons
}

export { getLucideIcons }
