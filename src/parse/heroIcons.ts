import { formatSvg, fsp, getIconDir, pathExists } from '@/lib/fs.js'
import { logger } from '@/lib/logs/index.js'
import path from 'path'
import { Icon } from '../constants.js'

/**
 * Retrieves and processes Hero Icons from the file system.
 *
 * The function expects the following directory structure:
 * ```
 * hero_icons/
 * ├── 16/
 * │   ├── solid/
 * │   │   └── *.svg
 * │   └── outline/
 * │       └── *.svg
 * ├── 20/
 * │   ├── solid/
 * │   │   └── *.svg
 * │   └── outline/
 * │       └── *.svg
 * └── 24/
 *     ├── solid/
 *     │   └── *.svg
 *     └── outline/
 *         └── *.svg
 * ```
 *
 */
async function getHeroIcons(): Promise<Icon[]> {
  // Get all icons
  const iconsDir = await getIconDir('hero_icons')
  const sizes = ['16', '20', '24']
  const styles = ['solid', 'outline']
  const iconPromises = sizes.flatMap((size) => {
    const sizeDir = path.join(iconsDir, size)
    return styles.flatMap(async (style) => {
      const styleDir = path.join(sizeDir, style)

      // Verify dir exists
      if (!(await pathExists(styleDir))) {
        logger.warn(`Style directory does not exist: ${styleDir}`)
        return []
      }

      // Get svg files
      const files = await fsp.readdir(styleDir)
      const svgFiles = files.filter((file) => file.endsWith('.svg'))

      // Parse svg files
      return Promise.all(
        svgFiles.map(async (file): Promise<Icon> => {
          const name = path.basename(file, '.svg')
          const svgPath = path.join(styleDir, file)
          const svgContent = await fsp.readFile(svgPath, 'utf-8')
          const formattedSvg = await formatSvg(svgContent)
          return {
            id: crypto.randomUUID(),
            name,
            style: style as 'solid' | 'outline',
            pixels: parseInt(size),
            svg_content: formattedSvg,
            provider: 'hero_icons',
          }
        }),
      )
    })
  })

  const nestedResults = await Promise.all(iconPromises)
  const icons = nestedResults.flat().flat()
  logger.info('Hero Icons parsed', { count: icons.length })
  return icons
}

export { getHeroIcons }
