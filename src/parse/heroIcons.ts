import { fse, fsp, pathExists } from '@/lib/fs.js'
import { logger } from '@/lib/logs/index.js'
import { exec } from 'child_process'
import * as path from 'path'
import prettier from 'prettier'
import tmp from 'tmp'
import { promisify } from 'util'
import {
  Icon,
  ICON_PROVIDERS,
  ICONS_JSON_FILEPATH,
  prettierSvgConfig,
} from '../constants.js'
const execAsync = promisify(exec)
tmp.setGracefulCleanup()

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
  const { gitUrl, subDir } = ICON_PROVIDERS.hero_icons

  // Clone icons repo to tmp dir
  const tmpDir = tmp.dirSync({ unsafeCleanup: true })
  const repoDir = path.join(tmpDir.name, 'heroicons')
  await execAsync(`git clone ${gitUrl} ${repoDir}`)
  logger.info(`Cloned repo from ${gitUrl} to ${repoDir}`)
  const iconsDir = path.join(repoDir, subDir)
  if (!(await pathExists(iconsDir))) {
    throw new Error(`Icons directory does not exist: ${iconsDir}`)
  }

  // Get all icons
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
          const formattedSvg = await prettier.format(
            svgContent,
            prettierSvgConfig,
          )
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
  return nestedResults.flat().flat()
}

async function createIconsList() {
  try {
    const icons = await getHeroIcons()
    await fsp.writeFile(ICONS_JSON_FILEPATH, JSON.stringify(icons, null, 2))
    logger.info(`Successfully generated icon list with ${icons.length} icons`)
  } catch (error) {
    logger.error('Error generating icon list:', error)
    process.exit(1)
  }
}

export { createIconsList }
