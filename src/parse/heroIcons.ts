import * as fs from 'fs'
import * as path from 'path'
import prettier from 'prettier'
import {
  Icon,
  ICON_PROVIDERS,
  OUTPUT_FILE,
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

  return await Promise.all(
    sizes.flatMap((size) => {
      const sizeDir = path.join(ICON_PROVIDERS.hero_icons.sub_dir ?? '.', size)
      return styles.flatMap((style) => {
        const styleDir = path.join(sizeDir, style)
        if (!fs.existsSync(styleDir)) return []

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
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(icons, null, 2))
    console.log(`Successfully generated icon list with ${icons.length} icons`)
  } catch (error) {
    console.error('Error generating icon list:', error)
    process.exit(1)
  }
}

export { createIconsList }