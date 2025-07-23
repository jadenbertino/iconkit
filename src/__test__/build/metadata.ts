import { ICON_PROVIDER_SLUGS, type IconProviderSlug } from '@/constants'
import { serverLogger } from '@/lib/logs/server'
import type { ScrapedIcon } from '@/lib/schemas/database'
import * as fs from 'fs'
import * as path from 'path'
import {
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
} from '../../build/icons/metadata'
import { scrapeIcons } from '../../build/icons/scrape'

// Map provider slugs to their metadata extraction functions
const METADATA_SCRAPERS = {
  hero_icons: scrapeHeroIcons,
  lucide: scrapeLucide,
  simple_icons: scrapeSimpleIcons,
  feather_icons: scrapeFeatherIcons,
  font_awesome_free: scrapeFontAwesomeFree,
  remix_icon: scrapeRemixIcon,
  octicons: scrapeOcticons,
  boxicons: scrapeBoxicons,
  ionicons: scrapeIonicons,
  eva_icons: scrapeEvaIcons,
  tabler_icons: scrapeTablerIcons,
} as const satisfies Record<
  IconProviderSlug,
  (icons: ScrapedIcon[]) => Promise<(ScrapedIcon & { tags: string[] })[]>
>

type MetadataTestResults = Record<
  IconProviderSlug,
  (ScrapedIcon & { tags: string[] })[]
>

async function testMetadataExtraction() {
  serverLogger.info('Starting metadata extraction tests...')

  const TEST_ICON_COUNT = 100
  const results: MetadataTestResults = {} as MetadataTestResults
  let totalIconsProcessed = 0
  let totalIconsWithTags = 0

  for (const providerSlug of ICON_PROVIDER_SLUGS) {
    try {
      serverLogger.info(`Testing ${providerSlug} metadata extraction...`)

      // Step 1: Scrape raw icons from the provider
      const allIcons = await scrapeIcons(providerSlug)
      const testIcons = allIcons.slice(0, TEST_ICON_COUNT)

      serverLogger.info(
        `Scraped ${testIcons.length} icons from ${providerSlug}`,
      )

      // Step 2: Extract metadata using provider-specific function
      const metadataScraper = METADATA_SCRAPERS[providerSlug]
      const iconsWithMetadata = await metadataScraper(testIcons)

      // Step 3: Verify some icons have metadata (tags)
      const iconsWithTags = iconsWithMetadata.filter(
        (icon) => icon.tags && icon.tags.length > 0,
      )

      const tagsPercentage = Math.round(
        (iconsWithTags.length / iconsWithMetadata.length) * 100,
      )

      serverLogger.info(
        `${providerSlug}: ${iconsWithTags.length}/${iconsWithMetadata.length} icons have tags (${tagsPercentage}%)`,
      )

      // Step 4: Log sample of icons with their metadata
      if (iconsWithTags.length > 0) {
        const sampleIcons = iconsWithTags.slice(0, 3)
        serverLogger.info(`Sample icons with metadata for ${providerSlug}:`)
        sampleIcons.forEach((icon, index) => {
          serverLogger.info(
            `  ${index + 1}. ${icon.name}: [${icon.tags.join(', ')}]`,
          )
        })
      } else {
        serverLogger.warn(`No icons with metadata found for ${providerSlug}`)
      }

      // Step 5: Store results
      results[providerSlug] = iconsWithMetadata
      totalIconsProcessed += iconsWithMetadata.length
      totalIconsWithTags += iconsWithTags.length

      serverLogger.info(`✅ ${providerSlug} metadata extraction completed`)
    } catch (error) {
      serverLogger.error(
        `❌ ${providerSlug} metadata extraction failed:`,
        error,
      )
      // Continue with other providers even if one fails
      results[providerSlug] = []
    }
  }

  // Step 6: Write all results to JSON file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const tmpDir = path.join(process.cwd(), 'tmp', '__test__')
  const outputFile = path.join(tmpDir, `metadata-test-${timestamp}.json`)

  // Ensure tmp/__test__ directory exists
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true })
  }

  // Write all results to file
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2))
  serverLogger.info(`Metadata test results written to ${outputFile}`)

  // Step 7: Final summary
  const overallTagsPercentage = Math.round(
    (totalIconsWithTags / totalIconsProcessed) * 100,
  )

  serverLogger.info('=== METADATA EXTRACTION TEST SUMMARY ===')
  serverLogger.info(`Total providers tested: ${ICON_PROVIDER_SLUGS.length}`)
  serverLogger.info(`Total icons processed: ${totalIconsProcessed}`)
  serverLogger.info(
    `Total icons with tags: ${totalIconsWithTags} (${overallTagsPercentage}%)`,
  )

  // Provider-by-provider breakdown
  serverLogger.info('Provider breakdown:')
  for (const [provider, icons] of Object.entries(results)) {
    const iconsWithTags = icons.filter(
      (icon) => icon.tags && icon.tags.length > 0,
    )
    const percentage =
      icons.length > 0
        ? Math.round((iconsWithTags.length / icons.length) * 100)
        : 0

    serverLogger.info(
      `  ${provider}: ${iconsWithTags.length}/${icons.length} (${percentage}%)`,
    )
  }

  serverLogger.info('✅ Metadata extraction tests completed successfully!')
  process.exit(0)
}

// Individual test functions for each provider
async function testHeroIcons() {
  serverLogger.info('Testing Hero Icons metadata extraction...')

  const icons = await scrapeIcons('hero_icons')
  const testIcons = icons.slice(0, 10)
  const result = await scrapeHeroIcons(testIcons)

  const iconsWithTags = result.filter((icon) => icon.tags.length > 0)
  serverLogger.info(
    `Hero Icons: ${iconsWithTags.length}/${result.length} icons have filepath-based tags`,
  )

  if (iconsWithTags.length > 0) {
    serverLogger.info(
      `Sample: ${iconsWithTags[0]!.name} -> [${iconsWithTags[0]!.tags.join(', ')}]`,
    )
  }

  return result.length > 0 && iconsWithTags.length > 0
}

async function testLucide() {
  serverLogger.info('Testing Lucide metadata extraction...')

  const icons = await scrapeIcons('lucide')
  const testIcons = icons.slice(0, 10)
  const result = await scrapeLucide(testIcons)

  const iconsWithTags = result.filter((icon) => icon.tags.length > 0)
  serverLogger.info(
    `Lucide: ${iconsWithTags.length}/${result.length} icons have JSON metadata`,
  )

  if (iconsWithTags.length > 0) {
    serverLogger.info(
      `Sample: ${iconsWithTags[0]!.name} -> [${iconsWithTags[0]!.tags.join(', ')}]`,
    )
  }

  return result.length > 0
}

async function testSimpleIcons() {
  serverLogger.info('Testing Simple Icons metadata extraction...')

  const icons = await scrapeIcons('simple_icons')
  const testIcons = icons.slice(0, 10)
  const result = await scrapeSimpleIcons(testIcons)

  const iconsWithTags = result.filter((icon) => icon.tags.length > 0)
  serverLogger.info(
    `Simple Icons: ${iconsWithTags.length}/${result.length} icons have alias metadata`,
  )

  if (iconsWithTags.length > 0) {
    serverLogger.info(
      `Sample: ${iconsWithTags[0]!.name} -> [${iconsWithTags[0]!.tags.join(', ')}]`,
    )
  }

  return result.length > 0
}

async function testFeatherIcons() {
  serverLogger.info('Testing Feather Icons metadata extraction...')

  const icons = await scrapeIcons('feather_icons')
  const testIcons = icons.slice(0, 10)
  const result = await scrapeFeatherIcons(testIcons)

  const iconsWithTags = result.filter((icon) => icon.tags.length > 0)
  serverLogger.info(
    `Feather Icons: ${iconsWithTags.length}/${result.length} icons have tag metadata`,
  )

  if (iconsWithTags.length > 0) {
    serverLogger.info(
      `Sample: ${iconsWithTags[0]!.name} -> [${iconsWithTags[0]!.tags.join(', ')}]`,
    )
  }

  return result.length > 0 && iconsWithTags.length > 0
}

async function testFontAwesome() {
  serverLogger.info('Testing Font Awesome metadata extraction...')

  const icons = await scrapeIcons('font_awesome_free')
  const testIcons = icons.slice(0, 10)
  const result = await scrapeFontAwesomeFree(testIcons)

  const iconsWithTags = result.filter((icon) => icon.tags.length > 1) // Always has name
  serverLogger.info(
    `Font Awesome: ${iconsWithTags.length}/${result.length} icons have search term metadata`,
  )

  if (iconsWithTags.length > 0) {
    serverLogger.info(
      `Sample: ${iconsWithTags[0]!.name} -> [${iconsWithTags[0]!.tags.join(', ')}]`,
    )
  }

  return result.length > 0 && iconsWithTags.length > 0
}

async function testRemixIcon() {
  serverLogger.info('Testing Remix Icon metadata extraction...')

  const icons = await scrapeIcons('remix_icon')
  const testIcons = icons.slice(0, 10)
  const result = await scrapeRemixIcon(testIcons)

  const iconsWithTags = result.filter((icon) => icon.tags.length > 0)
  serverLogger.info(
    `Remix Icon: ${iconsWithTags.length}/${result.length} icons have category metadata`,
  )

  if (iconsWithTags.length > 0) {
    serverLogger.info(
      `Sample: ${iconsWithTags[0]!.name} -> [${iconsWithTags[0]!.tags.join(', ')}]`,
    )
  }

  return result.length > 0
}

async function testOcticons() {
  serverLogger.info('Testing Octicons metadata extraction...')

  const icons = await scrapeIcons('octicons')
  const testIcons = icons.slice(0, 10)
  const result = await scrapeOcticons(testIcons)

  const iconsWithTags = result.filter((icon) => icon.tags.length > 0)
  serverLogger.info(
    `Octicons: ${iconsWithTags.length}/${result.length} icons have keyword metadata`,
  )

  if (iconsWithTags.length > 0) {
    serverLogger.info(
      `Sample: ${iconsWithTags[0]!.name} -> [${iconsWithTags[0]!.tags.join(', ')}]`,
    )
  }

  return result.length > 0
}

async function testBoxicons() {
  serverLogger.info('Testing Boxicons metadata extraction...')

  const icons = await scrapeIcons('boxicons')
  const testIcons = icons.slice(0, 10)
  const result = await scrapeBoxicons(testIcons)

  const iconsWithTags = result.filter((icon) => icon.tags.length > 0)
  serverLogger.info(
    `Boxicons: ${iconsWithTags.length}/${result.length} icons have filepath-based tags`,
  )

  if (iconsWithTags.length > 0) {
    serverLogger.info(
      `Sample: ${iconsWithTags[0]!.name} -> [${iconsWithTags[0]!.tags.join(', ')}]`,
    )
  }

  return result.length > 0 && iconsWithTags.length > 0
}

async function testIonicons() {
  serverLogger.info('Testing Ionicons metadata extraction...')

  const icons = await scrapeIcons('ionicons')
  const testIcons = icons.slice(0, 10)
  const result = await scrapeIonicons(testIcons)

  const iconsWithTags = result.filter((icon) => icon.tags.length > 1) // Always has name
  serverLogger.info(
    `Ionicons: ${iconsWithTags.length}/${result.length} icons have tag metadata`,
  )

  if (iconsWithTags.length > 0) {
    serverLogger.info(
      `Sample: ${iconsWithTags[0]!.name} -> [${iconsWithTags[0]!.tags.join(', ')}]`,
    )
  }

  return result.length > 0 && iconsWithTags.length > 0
}

async function testEvaIcons() {
  serverLogger.info('Testing Eva Icons metadata extraction...')

  const icons = await scrapeIcons('eva_icons')
  const testIcons = icons.slice(0, 10)
  const result = await scrapeEvaIcons(testIcons)

  const iconsWithTags = result.filter((icon) => icon.tags.length > 0)
  serverLogger.info(
    `Eva Icons: ${iconsWithTags.length}/${result.length} icons have filepath-based tags`,
  )

  if (iconsWithTags.length > 0) {
    serverLogger.info(
      `Sample: ${iconsWithTags[0]!.name} -> [${iconsWithTags[0]!.tags.join(', ')}]`,
    )
  }

  return result.length > 0 && iconsWithTags.length > 0
}

async function testTablerIcons() {
  serverLogger.info('Testing Tabler Icons metadata extraction...')

  const icons = await scrapeIcons('tabler_icons')
  const testIcons = icons.slice(0, 10)
  const result = await scrapeTablerIcons(testIcons)

  const iconsWithTags = result.filter((icon) => icon.tags.length > 1) // Always has name
  serverLogger.info(
    `Tabler Icons: ${iconsWithTags.length}/${result.length} icons have alias metadata`,
  )

  if (iconsWithTags.length > 0) {
    serverLogger.info(
      `Sample: ${iconsWithTags[0]!.name} -> [${iconsWithTags[0]!.tags.join(', ')}]`,
    )
  }

  return result.length > 0 && iconsWithTags.length > 0
}

// Export individual test functions for selective testing
export {
  testBoxicons,
  testEvaIcons,
  testFeatherIcons,
  testFontAwesome,
  testHeroIcons,
  testIonicons,
  testLucide,
  testMetadataExtraction, // comprehensive test
  testOcticons,
  testRemixIcon,
  testSimpleIcons,
  testTablerIcons,
}
