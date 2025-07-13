import { isValidJsxString } from '@/__test__/jsxString'
import {
  ICON_PROVIDERS,
  prettierSvgConfig,
  type IconProviderSlug,
} from '@/constants/index'
import { SERVER_ENV } from '@/env/server'
import { htmlAttributesToReact, toPascalCase, withTimeout } from '@/lib'
import { execAsync, fsp, pathExists } from '@/lib/fs'
import { serverLogger } from '@/lib/logs/server'
import type { ScrapedIcon } from '@/lib/schemas/database'
import { transform } from '@svgr/core'
import path from 'path'

// Timeout constants (in milliseconds)
const GIT_OPERATION_TIMEOUT = 5 * 60 * 1000 // 5 minutes for git operations
const SCRAPE_OPERATION_TIMEOUT = 10 * 60 * 1000 // 10 minutes for overall scraping
const FILE_READ_TIMEOUT = 30 * 1000 // 30 seconds for file operations

/**
 * Executes a command with timeout
 */
async function execWithTimeout(
  command: string,
  timeoutMs: number = GIT_OPERATION_TIMEOUT,
) {
  return withTimeout(execAsync(command), timeoutMs, `Command: ${command}`)
}

async function scrapeIcons(provider: IconProviderSlug): Promise<ScrapedIcon[]> {
  // Wrap the entire scraping operation with timeout
  return withTimeout(
    _scrapeIconsInternal(provider),
    SCRAPE_OPERATION_TIMEOUT,
    `Scraping icons for ${provider}`,
  )
}

async function _scrapeIconsInternal(
  provider: IconProviderSlug,
): Promise<ScrapedIcon[]> {
  // Clone repo to tmp dir
  const repoDir = await cloneRepo(provider)
  const { git } = ICON_PROVIDERS[provider]
  const iconsDir = path.join(repoDir, git.iconsDir)
  if (!(await pathExists(iconsDir))) {
    throw new Error(
      `Icons directory for ${provider} does not exist: ${iconsDir}`,
    )
  }

  // Get all files recursively
  const filenames = await fsp.readdir(iconsDir, { recursive: true })
  const files = filenames.map((f) => path.join(iconsDir, f))
  const svgFiles = files.filter((file) => file.endsWith('.svg'))

  serverLogger.info(`Found ${svgFiles.length} SVG files for ${provider}`)

  // Parse svg files with timeout for each file
  return await Promise.all(
    svgFiles.map(async (filePath): Promise<ScrapedIcon> => {
      const name = path.basename(filePath, '.svg')

      // Add timeout to file reading operation
      const svgContent = await withTimeout(
        fsp.readFile(filePath, 'utf-8'),
        FILE_READ_TIMEOUT,
        `Reading file: ${filePath}`,
      )

      // Remove the SVG wrapper tags and get the inner content
      const cleanedSvgContent = svgContent
        .replace(/"/g, "'") // replace " with '
        .replace(/<!--[\s\S]*?-->/g, '') // remove HTML comments
        .trim()

      // Convert SVG to JSX using @svgr/core (just get the JSX elements)
      const componentName = toPascalCase(name)
      const svgJsx = await transform(
        cleanedSvgContent,
        {
          jsxRuntime: 'automatic', // prevent React import
          expandProps: false, // prevent props expansion
          prettierConfig: prettierSvgConfig,
          icon: true, // sizing
          dimensions: false, // sizing
        },
        { componentName },
      )

      // Convert kebab-case attributes to camelCase
      const camelCaseSvgJsx = htmlAttributesToReact(svgJsx)

      // Create full React component with PascalCase name
      const jsxContent = `const ${componentName} = () => (
  ${camelCaseSvgJsx}
)

export default ${componentName}`
      const jsxValidation = isValidJsxString(jsxContent)
      if (!jsxValidation.isValid) {
        serverLogger.error(`Invalid JSX for ${name}: ${jsxValidation.errors}`)
        throw new Error(`Invalid JSX for ${name}: ${jsxValidation.errors}`)
      }

      // Construct source URL
      const relativePath = path.relative(repoDir, filePath)
      const repoUrl = git.url.replace(/\.git$/, '') // Remove .git suffix if present
      const source_url = `${repoUrl}/blob/${git.branch}/${relativePath}`

      return {
        name,
        svg: cleanedSvgContent,
        version: SERVER_ENV.VERSION,
        source_url,
        jsx: jsxContent,
      }
    }),
  )
}

async function cloneRepo(provider: IconProviderSlug): Promise<string> {
  const { git } = ICON_PROVIDERS[provider]
  const { url: gitUrl, branch } = git
  const randomId = 'dd000030-8ae8-4fda-adf8-c2d5416318af' as const // to avoid collisions
  const repoDir = path.join(`/tmp/iconProviders-${randomId}`, provider)

  // Cache hit
  if (await pathExists(repoDir)) {
    try {
      const { stdout: currentRemote } = await execWithTimeout(
        `cd ${repoDir} && git remote get-url origin`,
      )
      if (currentRemote.trim() === gitUrl) {
        await execWithTimeout(`cd ${repoDir} && git checkout ${branch}`)
        await execWithTimeout(`cd ${repoDir} && git pull`)
        const { stdout: currentBranch } = await execWithTimeout(
          `cd ${repoDir} && git branch --show-current`,
        )
        serverLogger.info(`Updated ${provider} repo.`, {
          branch: currentBranch.trim(),
        })
        return repoDir
      } else {
        throw new Error('Invalid git repository remote')
      }
    } catch (error) {
      // If git command fails, directory might be corrupted
      serverLogger.warn(`Invalid git repository at ${repoDir}, removing...`, {
        error,
      })
      await execWithTimeout(`rm -rf ${repoDir}`)
    }
  }

  // Cache miss / invalid remote
  await fsp.mkdir(path.dirname(repoDir), { recursive: true })

  serverLogger.info(`Cloning repository ${gitUrl} to ${repoDir}...`)
  await execWithTimeout(`git clone ${gitUrl} ${repoDir}`)
  await execWithTimeout(`cd ${repoDir} && git checkout ${branch}`)
  await execWithTimeout(`cd ${repoDir} && git pull`)

  const { stdout: currentBranch } = await execWithTimeout(
    `cd ${repoDir} && git branch --show-current`,
  )
  serverLogger.info(`Cloned repo from ${gitUrl} to ${repoDir}`, {
    branch: currentBranch.trim(),
  })
  return repoDir
}

export { scrapeIcons }
