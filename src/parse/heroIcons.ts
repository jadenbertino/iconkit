import { logger } from '@/lib/logs/index.js'
import * as fs from 'fs'
import * as path from 'path'
import prettier from 'prettier'
import {
  Icon,
  ICON_PROVIDERS,
  ICONS_JSON_FILEPATH,
  prettierSvgConfig,
} from '../constants.js'

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
  const sizes = ['16', '20', '24']
  const styles = ['solid', 'outline']
  const iconsDir = ICON_PROVIDERS.hero_icons.sub_dir
  if (!iconsDir) throw new Error('iconsDir is not defined')
  logger.debug(`iconsDir: ${iconsDir}`)

  return await Promise.all(
    sizes.flatMap((size) => {
      const sizeDir = path.join(iconsDir, size)
      return styles.flatMap((style) => {
        const styleDir = path.join(sizeDir, style)
        if (!fs.existsSync(styleDir)) {
          logger.warn(`styleDir does not exist: ${styleDir}`)
          return []
        }

        return fs
          .readdirSync(styleDir)
          .filter((file) => file.endsWith('.svg'))
          .map(async (file) => {
            const name = path.basename(file, '.svg')
            const svgPath = path.join(styleDir, file)
            const svgContent = fs.readFileSync(svgPath, 'utf-8')
            const formattedSvg = await prettier.format(
              svgContent,
              prettierSvgConfig,
            )

            const icon: Icon = {
              id: crypto.randomUUID(),
              name,
              style: style as 'solid' | 'outline',
              pixels: parseInt(size),
              svg_content: formattedSvg,
              provider: 'hero_icons',
            }

            return icon
          })
      })
    }),
  )
}

async function createIconsList() {
  try {
    const icons = await getHeroIcons()
    fs.writeFileSync(ICONS_JSON_FILEPATH, JSON.stringify(icons, null, 2))
    logger.info(`Successfully generated icon list with ${icons.length} icons`)
  } catch (error) {
    logger.error('Error generating icon list:', error)
    process.exit(1)
  }
}

export { createIconsList }
