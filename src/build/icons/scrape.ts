import { isValidJsxString } from '@/__test__/jsxString'
import {
  ICON_PROVIDERS,
  prettierSvgConfig,
  type IconProviderSlug,
} from '@/constants/index'
import { CLIENT_ENV } from '@/env/client'
import { htmlAttributesToReact, toPascalCase } from '@/lib'
import { withTimeout } from '@/lib/error'
import { fsp, pathExists } from '@/lib/fs'
import { serverLogger } from '@/lib/logs/server'
import type { ScrapedIcon } from '@/lib/schemas/database'
import { transform } from '@svgr/core'
import DOMPurify from 'isomorphic-dompurify'
import path from 'path'
import { cloneRepo } from '../utils'
import { addTags, type ScrapedIconWithTags } from './tags'

// Timeout constants (in milliseconds)
const SCRAPE_OPERATION_TIMEOUT = 10 * 60 * 1000 // 10 minutes for overall scraping
const FILE_READ_TIMEOUT = 30 * 1000 // 30 seconds for file operations

async function scrapeIcons(
  provider: IconProviderSlug,
): Promise<ScrapedIconWithTags[]> {
  // Wrap the entire scraping operation with timeout
  return withTimeout(
    _scrapeIconsInternal(provider),
    SCRAPE_OPERATION_TIMEOUT,
    `Scraping icons for ${provider}`,
  )
}

async function _scrapeIconsInternal(
  provider: IconProviderSlug,
): Promise<ScrapedIconWithTags[]> {
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
  const icons = await Promise.all(
    svgFiles.map(async (filePath): Promise<ScrapedIcon> => {
      const name = path.basename(filePath, '.svg')

      // Get SVG Content
      const svgContent = await withTimeout(
        fsp.readFile(filePath, 'utf-8'),
        FILE_READ_TIMEOUT,
        `Reading file: ${filePath}`,
      )
      const processedSvgContent = preprocessSvg(svgContent)

      // Convert SVG to JSX using @svgr/core (just get the JSX elements)
      const componentName = toPascalCase(name)
      const svgJsx = await transform(
        processedSvgContent,
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
        svg: processedSvgContent,
        build_id: CLIENT_ENV.BUILD_ID,
        source_url,
        jsx: jsxContent,
      }
    }),
  )

  const iconsWithTags = await addTags(provider, icons)
  return iconsWithTags
}

const preprocessSvg = (svgString: string): string => {
  let processedSvg = svgString
    .replace(/"/g, "'") // replace " with '
    .replace(/<!--[\s\S]*?-->/g, '') // remove HTML comments
    .trim()

  // Add fill="currentColor" to the svg tag if it doesn't exist
  // shouldn't add to all because some have fill="none"
  if (!/fill\s*=/.test(processedSvg)) {
    processedSvg = processedSvg.replace(
      /<svg([^>]*)>/,
      '<svg$1 fill="currentColor">',
    )
  }

  return DOMPurify.sanitize(processedSvg)

  // Old DOM-based implementation (more robust but heavier):
  //   // Parse the SVG string to check for existing fill attribute
  //   const parser = new DOMParser()
  //   const doc = parser.parseFromString(svgString, 'image/svg+xml')
  //   const svg = doc.querySelector('svg')
  //
  //   if (!svg) return svgString
  //
  //   // Check if fill attribute already exists
  //   const hasFill = svg.hasAttribute('fill')
  //
  //   // If fill already exists, return as-is
  //   if (hasFill) return svgString
  //
  //   // Clone the SVG element to modify it
  //   const modifiedSvg = svg.cloneNode(true) as SVGElement
  //
  //   // Add fill="currentColor" if not present
  //   modifiedSvg.setAttribute('fill', 'currentColor')
  //
  //   return modifiedSvg.outerHTML
}

export { scrapeIcons }
