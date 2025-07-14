import { isValidJsxString } from '@/__test__/jsxString'
import {
  ICON_PROVIDERS,
  prettierSvgConfig,
  type IconProviderSlug,
} from '@/constants/index'
import { SERVER_ENV } from '@/env/server'
import { htmlAttributesToReact, toPascalCase } from '@/lib'
import { withTimeout } from '@/lib/error'
import { fsp, pathExists } from '@/lib/fs'
import { serverLogger } from '@/lib/logs/server'
import type { ScrapedIcon } from '@/lib/schemas/database'
import { transform } from '@svgr/core'
import path from 'path'
import { cloneRepo } from '../utils'

// Timeout constants (in milliseconds)
const SCRAPE_OPERATION_TIMEOUT = 10 * 60 * 1000 // 10 minutes for overall scraping
const FILE_READ_TIMEOUT = 30 * 1000 // 30 seconds for file operations

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

      // Validate JSX
      const jsxValidation = isValidJsxString(jsxContent)
      if (!jsxValidation.isValid) {
        serverLogger.error(`Invalid JSX for ${name}`, {
          ...jsxValidation,
          jsx: jsxContent,
        })
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

export { scrapeIcons }
