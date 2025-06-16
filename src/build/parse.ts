import {
  Icon,
  ICON_PROVIDER_IDS,
  ICON_PROVIDERS,
  IconProviderId,
} from '@/constants.js'
import { execAsync, fsp, pathExists } from '@/lib/fs.js'
import { logger } from '@/lib/logs/index.js'
import path from 'path'

async function getAllIcons(outputDir: string): Promise<void> {
  await fsp.mkdir(outputDir, { recursive: true })
  await Promise.all(
    ICON_PROVIDER_IDS.map((provider) => {
      const outputFile = path.join(outputDir, `${provider}.json`)
      return getIconsFromProvider(provider, outputFile)
    }),
  )
}

async function getIconsFromProvider(
  provider: IconProviderId,
  outputFile: string,
) {
  // Clone repo to tmp dir
  const start = Date.now()
  const iconsDir = await getIconDir(provider)

  // Get all files recursively
  const filenames = await fsp.readdir(iconsDir, { recursive: true })
  const files = filenames.map((f) => path.join(iconsDir, f))
  const svgFiles = files.filter((file) => file.endsWith('.svg'))

  // Parse svg files
  const icons: Icon[] = await Promise.all(
    svgFiles.map(async (filePath): Promise<Icon> => {
      const name = path.basename(filePath, '.svg')
      const svgContent = await fsp.readFile(filePath, 'utf-8')
      // Remove the SVG wrapper tags and get the inner content
      const innerContent = svgContent
        .replace(/<\/?svg[^>]*>/g, '') // remove svg wrapper tags
        .replace(/"/g, "'") // replace " with '
        .trim()
      if (!innerContent) {
        throw new Error(`Failed to parse svg content from file: ${filePath}`)
      }

      return {
        id: crypto.randomUUID(),
        name,
        innerSvgContent: innerContent,
        provider,
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
  await fsp.writeFile(outputFile, JSON.stringify(icons, null, 2))
  logger.info(
    `Successfully generated icon list for ${provider} with ${icons.length} icons`,
  )
}

async function getIconDir(provider: IconProviderId) {
  const { gitUrl, subDir } = ICON_PROVIDERS[provider]
  const repoDir = await cloneRepo(gitUrl, provider)
  const iconsDir = path.join(repoDir, subDir)
  if (!(await pathExists(iconsDir))) {
    throw new Error(
      `Icons directory for ${provider} does not exist: ${iconsDir}`,
    )
  }
  return iconsDir
}

/**
 * Clones a git repository to a temporary directory
 * @param gitUrl - The git repository URL to clone
 * @param repoName - Optional name for the repository directory (defaults to 'repo')
 * @returns The path to the cloned repository directory
 */
async function cloneRepo(gitUrl: string, repoName: string): Promise<string> {
  if (!isValidGitUrl(gitUrl)) {
    throw new Error(`Invalid git URL: ${gitUrl}`)
  }
  const randomId = 'dd000030-8ae8-4fda-adf8-c2d5416318af' as const // to avoid collisions
  const repoDir = path.join(`/tmp/iconProviders-${randomId}`, repoName)

  // Cache hit
  if (await pathExists(repoDir)) {
    try {
      const { stdout: currentRemote } = await execAsync(
        `cd ${repoDir} && git remote get-url origin`,
      )
      if (currentRemote.trim() === gitUrl) {
        logger.info(`Using existing repo at ${repoDir}`)
        await execAsync(`cd ${repoDir} && git pull`)
        logger.info(`Updated repo at ${repoDir}`)
        return repoDir
      } else {
        throw new Error('Invalid git repository remote')
      }
    } catch (error) {
      // If git command fails, directory might be corrupted
      logger.warn(`Invalid git repository at ${repoDir}, removing...`)
      await execAsync(`rm -rf ${repoDir}`)
    }
  }

  // Cache miss / invalid remote
  await fsp.mkdir(path.dirname(repoDir), { recursive: true })
  await execAsync(`git clone ${gitUrl} ${repoDir}`)
  logger.info(`Cloned repo from ${gitUrl} to ${repoDir}`)
  return repoDir
}

function isValidGitUrl(gitUrl: string): boolean {
  return (
    gitUrl.endsWith('.git') &&
    (gitUrl.startsWith('https://') ||
      gitUrl.startsWith('http://') ||
      gitUrl.startsWith('git@'))
  )
}

export { getAllIcons }
