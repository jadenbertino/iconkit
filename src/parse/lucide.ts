import { Icon } from '@/constants.js'
import { formatSvg, fsp, getIconDir } from '@/lib/fs.js'
import { logger } from '@/lib/logs/index.js'
import path from 'path'

async function getLucideIcons(): Promise<Icon[]> {
  // Get all svg files
  const iconsDir = await getIconDir('lucide')
  const files = await fsp.readdir(iconsDir)
  const svgFiles = files.filter((file) => file.endsWith('.svg'))

  // Parse svg files
  const icons = await Promise.all(
    svgFiles.map(async (file): Promise<Icon> => {
      const name = path.basename(file, '.svg')
      const svgFilePath = path.join(iconsDir, file)
      const svgContent = await fsp.readFile(svgFilePath, 'utf-8')
      const formattedSvg = await formatSvg(svgContent)
      return {
        id: crypto.randomUUID(),
        name,
        pixels: null,
        style: null,
        svg_content: formattedSvg,
        provider: 'lucide',
      }
    }),
  )
  logger.info('Lucide Icons parsed', { count: icons.length })
  return icons
}

export { getLucideIcons }
