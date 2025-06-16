import {
  Icon,
  ICON_PROVIDER_IDS,
  ICON_PROVIDERS,
  IconProviderId,
  prettierSvgConfig,
} from '@/constants.js'
import { cloneRepo, fs, fsp, pathExists } from '@/lib/fs.js'
import { logger } from '@/lib/logs/index.js'
import path from 'path'
import prettier from 'prettier'

async function getAllIcons(): Promise<void> {
  await Promise.all(ICON_PROVIDER_IDS.map(getIconsFromProvider))
}

async function getIconsFromProvider(provider: IconProviderId) {
  // Clone repo to tmp dir
  const start = Date.now()
  const { gitUrl, subDir } = ICON_PROVIDERS[provider]
  const repoDir = await cloneRepo(gitUrl, provider)
  const iconsDir = path.join(repoDir, subDir)
  if (!(await pathExists(iconsDir))) {
    throw new Error(
      `Icons directory for ${provider} does not exist: ${iconsDir}`,
    )
  }

  // Get all files recursively
  const svgFiles = (fs.readdirSync(iconsDir, { recursive: true }) as string[])
    .filter((file) => file.endsWith('.svg'))
    .map((file) => path.join(iconsDir, file))

  // Parse svg files
  const icons: Icon[] = await Promise.all(
    svgFiles.map(async (filePath): Promise<Icon> => {
      const name = path.basename(filePath, '.svg')
      const svgContent = await fsp.readFile(filePath, 'utf-8')
      const formattedSvg = await prettier.format(svgContent, prettierSvgConfig)

      return {
        id: crypto.randomUUID(),
        name,
        svg_content: formattedSvg,
        provider: 'hero_icons',
      }
    }),
  )

  // Log and write to file
  const stop = Date.now()
  const seconds = (stop - start) / 1000
  logger.info(`${provider} Icons parsed`, {
    count: icons.length,
    seconds,
  })
  const outputDir = path.join(process.cwd(), 'icons')
  await fsp.mkdir(outputDir, { recursive: true })
  const outputPath = path.join(outputDir, `${provider}.json`)
  await fsp.writeFile(outputPath, JSON.stringify(icons, null, 2))
  logger.info(
    `Successfully generated icon list for ${provider} with ${icons.length} icons`,
  )
}

export { getAllIcons }
