import type { IconProviderSlug } from '@/constants'
import { withTimeout } from '@/lib/error'
import { fsp, pathExists } from '@/lib/fs'
import { serverLogger } from '@/lib/logs/server'
import type { ScrapedIcon } from '@/lib/schemas/database'
import path from 'path'
import { z } from 'zod'
import { cloneRepo } from '../utils'

// Zod schemas for Simple Icons data structure
const SimpleIconDuplicateSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  hex: z.string().optional(),
  source: z.string().optional(),
  guidelines: z.string().optional(),
  loc: z.record(z.string(), z.string()).optional(),
})

const SimpleIconAliasesSchema = z
  .object({
    aka: z.array(z.string()).optional(),
    old: z.array(z.string()).optional(),
    dup: z.array(SimpleIconDuplicateSchema).optional(),
    loc: z.record(z.string(), z.string()).optional(),
  })
  .optional()

const SimpleIconLicenseSchema = z
  .union([
    z.object({
      type: z.string(),
    }),
    z.object({
      type: z.literal('custom'),
      url: z.string(),
    }),
  ])
  .optional()

const SimpleIconSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  hex: z.string().regex(/^[0-9A-F]{6}$/),
  source: z.string(),
  guidelines: z.string().optional(),
  aliases: SimpleIconAliasesSchema,
  license: SimpleIconLicenseSchema,
})

const SimpleIconsDataSchema = z.array(SimpleIconSchema)

type SimpleIcon = z.infer<typeof SimpleIconSchema>
type SimpleIconsData = z.infer<typeof SimpleIconsDataSchema>

type ScrapedIconWithTags = ScrapedIcon & { tags: string[] }

// Timeout constants (in milliseconds)
const FILE_READ_TIMEOUT = 30 * 1000 // 30 seconds for file operations

const FILEPATH_KEYWORDS = [
  'regular',
  'outline',
  'fill',
  'solid',
  'filled',
  'sharp',
  'light',
  'thin',
  'bold',
  'duotone',
  'brand',
  'logos',
] as const

/**
 * Extracts keywords from filepath by splitting path segments and filename,
 * then filtering against known icon style keywords.
 */
function extractKeywordsFromFilepath(filePath: string): string[] {
  const keywords: string[] = []

  // Split path by directory separators and hyphens
  const pathSegments = filePath.split(/[\/\\-]/)

  for (const segment of pathSegments) {
    if (FILEPATH_KEYWORDS.includes(segment as any)) {
      keywords.push(segment)
    }
  }

  return [...new Set(keywords)] // Remove duplicates
}

/**
 * Extracts style keywords from Hero Icons filepath structure.
 * Uses extractKeywordsFromFilepath to extract style from optimized/20/solid/ structure.
 */
async function scrapeHeroIcons(
  icons: ScrapedIcon[],
): Promise<ScrapedIconWithTags[]> {
  return icons.map((icon) => ({
    ...icon,
    tags: extractKeywordsFromFilepath(icon.source_url),
  }))
}

/**
 * Extracts metadata from Lucide icons by reading adjacent JSON files.
 * Each icon has a corresponding JSON file (e.g., accessibility.json next to accessibility.svg)
 * containing tags, categories, and contributors arrays which are combined into tags.
 */
async function scrapeLucide(
  icons: ScrapedIcon[],
): Promise<ScrapedIconWithTags[]> {
  const repoDir = await cloneRepo('lucide')
  const iconsDir = path.join(repoDir, 'icons')

  return await Promise.all(
    icons.map(async (icon): Promise<ScrapedIcon & { tags: string[] }> => {
      const jsonPath = path.join(iconsDir, `${icon.name}.json`)

      try {
        if (await pathExists(jsonPath)) {
          const jsonContent = await withTimeout(
            fsp.readFile(jsonPath, 'utf-8'),
            FILE_READ_TIMEOUT,
            `Reading metadata file: ${jsonPath}`,
          )

          const metadata = JSON.parse(jsonContent)
          const tags: string[] = [
            ...(metadata.tags || []),
            ...(metadata.categories || []),
            ...(metadata.contributors || []),
          ]

          return { ...icon, tags }
        }
      } catch (error) {
        serverLogger.warn(`Failed to read metadata for ${icon.name}`, { error })
      }

      return { ...icon, tags: [] }
    }),
  )
}

/**
 * Extracts metadata from Simple Icons by parsing central data/simple-icons.json file.
 * Matches icons by creating slugs from title field and extracts all alias properties.
 */
async function scrapeSimpleIcons(
  icons: ScrapedIcon[],
): Promise<ScrapedIconWithTags[]> {
  const repoDir = await cloneRepo('simple_icons')
  const dataPath = path.join(repoDir, 'data', 'simple-icons.json')

  let iconsData: SimpleIconsData = []
  try {
    const dataContent = await withTimeout(
      fsp.readFile(dataPath, 'utf-8'),
      FILE_READ_TIMEOUT,
      `Reading metadata file: ${dataPath}`,
    )
    const rawData = JSON.parse(dataContent)

    // Validate and parse the data structure
    const validationResult = SimpleIconsDataSchema.safeParse(rawData)
    if (!validationResult.success) {
      serverLogger.warn('Simple Icons data validation failed', {
        error: validationResult.error,
        sampleErrors: validationResult.error.errors.slice(0, 5), // Log first 5 errors
      })
      throw new Error(
        `Simple Icons data validation failed: ${validationResult.error.message}`,
      )
    }

    iconsData = validationResult.data
  } catch (error) {
    serverLogger.warn('Failed to read Simple Icons metadata', { error })
    throw error
  }

  // Create lookup mapping from filenames to metadata
  // We need to reverse-engineer which metadata entry corresponds to each filename
  const metadata: Record<string, SimpleIcon> = {}

  // First pass: Try to match using existing slug field if available
  for (const item of iconsData) {
    if (item.slug) {
      metadata[item.slug] = item
    }
  }

  // Second pass: For remaining items, try common transformations
  const usedItems = new Set(Object.values(metadata))
  for (const item of iconsData) {
    if (usedItems.has(item)) continue // Already mapped

    // Try various slug transformations that Simple Icons might use
    const possibleSlugs = [
      item.title.toLowerCase().replace(/[^a-z0-9]/g, ''), // Remove all non-alphanumeric
      item.title
        .toLowerCase()
        .replace(/&/g, 'and')
        .replace(/[^a-z0-9]/g, ''), // & -> and
      item.title
        .toLowerCase()
        .replace(/\./g, 'dot')
        .replace(/[^a-z0-9]/g, ''), // . -> dot
      item.title
        .toLowerCase()
        .replace(/\+/g, 'plus')
        .replace(/[^a-z0-9]/g, ''), // + -> plus
      item.title
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, ''), // Remove spaces
    ]

    for (const slug of possibleSlugs) {
      if (!metadata[slug]) {
        metadata[slug] = item
        usedItems.add(item)
        break
      }
    }
  }

  return icons.map((icon) => {
    const iconData = metadata[icon.name]
    const tags: string[] = []

    if (iconData) {
      // Add title as a tag
      if (iconData.title) {
        tags.push(iconData.title)
      }

      // Add all alias sub-properties
      if (iconData.aliases) {
        // Handle 'aka' aliases (alternative known as)
        if (iconData.aliases.aka && Array.isArray(iconData.aliases.aka)) {
          tags.push(...iconData.aliases.aka)
        }

        // Handle 'old' aliases (former names)
        if (iconData.aliases.old && Array.isArray(iconData.aliases.old)) {
          tags.push(...iconData.aliases.old)
        }

        // Handle 'dup' aliases (duplicates with different names)
        if (iconData.aliases.dup && Array.isArray(iconData.aliases.dup)) {
          iconData.aliases.dup.forEach((dup) => {
            if (dup.title) tags.push(dup.title)
          })
        }

        // Handle 'loc' aliases (localized names)
        if (iconData.aliases.loc && typeof iconData.aliases.loc === 'object') {
          Object.values(iconData.aliases.loc).forEach((localizedName) => {
            if (typeof localizedName === 'string') {
              tags.push(localizedName)
            }
          })
        }
      }
    }

    return { ...icon, tags }
  })
}

/**
 * Extracts metadata from Feather Icons by parsing src/tags.json file.
 * Maps icon names to search tags arrays directly.
 */
async function scrapeFeatherIcons(
  icons: ScrapedIcon[],
): Promise<ScrapedIconWithTags[]> {
  const repoDir = await cloneRepo('feather_icons')
  const tagsPath = path.join(repoDir, 'src', 'tags.json')

  let tagsData: Record<string, string[]> = {}
  try {
    const tagsContent = await withTimeout(
      fsp.readFile(tagsPath, 'utf-8'),
      FILE_READ_TIMEOUT,
      `Reading metadata file: ${tagsPath}`,
    )
    tagsData = JSON.parse(tagsContent)
  } catch (error) {
    serverLogger.warn('Failed to read Feather Icons metadata', { error })
  }

  return icons.map((icon) => ({
    ...icon,
    tags: [...(tagsData[icon.name] || []), icon.name],
  }))
}

/**
 * Extracts metadata from Font Awesome Free by parsing metadata/icons.json file.
 * Extracts search.terms array and label field, combines with filename splitting.
 */
async function scrapeFontAwesomeFree(
  icons: ScrapedIcon[],
): Promise<ScrapedIconWithTags[]> {
  const repoDir = await cloneRepo('font_awesome_free')
  const metadataPath = path.join(repoDir, 'metadata', 'icons.json')

  let iconsData: Record<string, any> = {}
  try {
    const metadataContent = await withTimeout(
      fsp.readFile(metadataPath, 'utf-8'),
      FILE_READ_TIMEOUT,
      `Reading metadata file: ${metadataPath}`,
    )
    iconsData = JSON.parse(metadataContent)
  } catch (error) {
    serverLogger.warn('Failed to read Font Awesome metadata', { error })
  }

  return icons.map((icon) => {
    const iconData = iconsData[icon.name]
    const tags: string[] = [icon.name]

    if (iconData?.search?.terms) {
      tags.push(...iconData.search.terms)
    }
    if (iconData?.label) {
      tags.push(iconData.label)
    }

    return { ...icon, tags }
  })
}

/**
 * Extracts metadata from Remix Icon by parsing tags.json file.
 * Maps individual icons to their category and tag information.
 */
async function scrapeRemixIcon(
  icons: ScrapedIcon[],
): Promise<ScrapedIconWithTags[]> {
  const repoDir = await cloneRepo('remix_icon')
  const tagsPath = path.join(repoDir, 'tags.json')

  let categoriesData: Record<string, any> = {}
  try {
    const tagsContent = await withTimeout(
      fsp.readFile(tagsPath, 'utf-8'),
      FILE_READ_TIMEOUT,
      `Reading metadata file: ${tagsPath}`,
    )
    categoriesData = JSON.parse(tagsContent)
  } catch (error) {
    serverLogger.warn('Failed to read Remix Icon metadata', { error })
  }

  return icons.map((icon) => {
    const tags: string[] = []

    // Remove -fill/-line suffix to match the base name in tags.json
    const baseName = icon.name.replace(/-(fill|line)$/, '')

    // Find which category this icon belongs to and extract tags
    for (const [categoryName, categoryIcons] of Object.entries(
      categoriesData,
    )) {
      // Skip the _comment entry
      if (categoryName === '_comment') continue

      // Check if this icon exists in the category
      if (typeof categoryIcons === 'object' && categoryIcons[baseName]) {
        // Add category name as primary tag
        tags.push(categoryName)

        // Parse the comma-separated tag string
        const iconTags = categoryIcons[baseName]
        if (typeof iconTags === 'string') {
          const parsedTags = iconTags
            .split(',')
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0)
            .filter((tag) => !/[\u4e00-\u9fff]/.test(tag)) // Exclude Chinese characters
          tags.push(...parsedTags)
        }

        break
      }
    }

    return { ...icon, tags }
  })
}

/**
 * Extracts metadata from Octicons by parsing keywords.json file.
 * Maps icon names to keyword arrays directly.
 */
async function scrapeOcticons(
  icons: ScrapedIcon[],
): Promise<ScrapedIconWithTags[]> {
  const repoDir = await cloneRepo('octicons')
  const keywordsPath = path.join(repoDir, 'keywords.json')

  let keywordsData: Record<string, string[]> = {}
  try {
    const keywordsContent = await withTimeout(
      fsp.readFile(keywordsPath, 'utf-8'),
      FILE_READ_TIMEOUT,
      `Reading metadata file: ${keywordsPath}`,
    )
    keywordsData = JSON.parse(keywordsContent)
  } catch (error) {
    serverLogger.warn('Failed to read Octicons metadata', { error })
  }

  return icons.map((icon) => {
    // Octicons files have size suffixes like "-16", "-24" that need to be stripped
    // to match the base names in keywords.json
    const baseName = icon.name.replace(/-\d+$/, '')

    return {
      ...icon,
      tags: keywordsData[baseName] || [],
    }
  })
}

/**
 * Extracts style keywords from Boxicons filepath structure.
 * Uses extractKeywordsFromFilepath to extract style from svg/regular/ structure.
 */
async function scrapeBoxicons(
  icons: ScrapedIcon[],
): Promise<ScrapedIconWithTags[]> {
  return icons.map((icon) => ({
    ...icon,
    tags: extractKeywordsFromFilepath(icon.source_url),
  }))
}

/**
 * Extracts metadata from Ionicons by parsing src/data.json file.
 * Matches by name field in icons array and extracts tags array.
 */
async function scrapeIonicons(
  icons: ScrapedIcon[],
): Promise<ScrapedIconWithTags[]> {
  const repoDir = await cloneRepo('ionicons')
  const dataPath = path.join(repoDir, 'src', 'data.json')

  let iconsLookup: Record<string, string[]> = {}
  try {
    const dataContent = await withTimeout(
      fsp.readFile(dataPath, 'utf-8'),
      FILE_READ_TIMEOUT,
      `Reading metadata file: ${dataPath}`,
    )
    const data = JSON.parse(dataContent)

    // Create lookup by name
    if (data.icons) {
      for (const iconData of data.icons) {
        if (iconData.name && iconData.tags) {
          iconsLookup[iconData.name] = iconData.tags
        }
      }
    }
  } catch (error) {
    serverLogger.warn('Failed to read Ionicons metadata', { error })
  }

  return icons.map((icon) => ({
    ...icon,
    tags: [...(iconsLookup[icon.name] || []), icon.name],
  }))
}

/**
 * Extracts style keywords from Eva Icons filepath structure.
 * Uses extractKeywordsFromFilepath to extract style from package/icons/outline/ structure.
 */
async function scrapeEvaIcons(
  icons: ScrapedIcon[],
): Promise<ScrapedIconWithTags[]> {
  return icons.map((icon) => ({
    ...icon,
    tags: extractKeywordsFromFilepath(icon.source_url),
  }))
}

/**
 * Extracts metadata from Tabler Icons by parsing aliases.json file.
 * Maps icon names directly to tags arrays.
 */
async function scrapeTablerIcons(
  icons: ScrapedIcon[],
): Promise<ScrapedIconWithTags[]> {
  const repoDir = await cloneRepo('tabler_icons')
  const aliasesPath = path.join(repoDir, 'aliases.json')

  let aliasesData: Record<string, string[]> = {}
  try {
    const aliasesContent = await withTimeout(
      fsp.readFile(aliasesPath, 'utf-8'),
      FILE_READ_TIMEOUT,
      `Reading metadata file: ${aliasesPath}`,
    )
    aliasesData = JSON.parse(aliasesContent)
  } catch (error) {
    serverLogger.warn('Failed to read Tabler Icons metadata', { error })
  }

  return icons.map((icon) => ({
    ...icon,
    tags: [...(aliasesData[icon.name] || []), icon.name],
  }))
}

export {
  scrapeBoxicons,
  scrapeEvaIcons,
  scrapeFeatherIcons,
  scrapeFontAwesomeFree,
  scrapeHeroIcons,
  scrapeIonicons,
  scrapeLucide,
  scrapeOcticons,
  scrapeRemixIcon,
  scrapeSimpleIcons,
  scrapeTablerIcons,
}
