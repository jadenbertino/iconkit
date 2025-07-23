import { ICON_PROVIDER_SLUGS, type IconProviderSlug } from '@/constants'
import { serverLogger } from '@/lib/logs/server'
import * as fs from 'fs'
import * as path from 'path'
import { scrapeIcons } from '../../build/icons/scrape'
import { addTags, type ScrapedIconWithTags } from '../../build/icons/tags'

// Use the unified addTags function for all providers

type MetadataTestResults = Record<IconProviderSlug, ScrapedIconWithTags[]>

type TagScrapeTest = {
  success: boolean
  numIcons: number
  numIconsWithTags: number
  icons: ScrapedIconWithTags[]
}

async function testMetadataExtraction(
  providerSlugs: readonly IconProviderSlug[] = ICON_PROVIDER_SLUGS,
) {
  serverLogger.info('Starting metadata extraction tests...')

  const TEST_ICON_COUNT = Infinity
  const results: MetadataTestResults = {} as MetadataTestResults
  let totalIconsProcessed = 0
  let totalIconsWithTags = 0

  for (const providerSlug of providerSlugs) {
    try {
      const providerName = providerSlug
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase())

      serverLogger.info(`Testing ${providerName} metadata extraction...`)

      // Use testTagScraping function for consistent logic
      const testResult = await testTagScraping({
        providerSlug,
        sampleSize: TEST_ICON_COUNT,
      })

      const tagsPercentage = Math.round(
        (testResult.numIconsWithTags / testResult.numIcons) * 100,
      )

      serverLogger.info(
        `${providerName}: ${testResult.numIconsWithTags}/${testResult.numIcons} icons have tags (${tagsPercentage}%)`,
      )

      // Log sample if icons with tags are available
      const iconsWithTags = testResult.icons.filter(
        (icon) => icon.tags.length > 0,
      )
      if (iconsWithTags.length > 0) {
        const sampleIcon = iconsWithTags[0]!
        serverLogger.info(
          `Sample: ${sampleIcon.name} -> [${sampleIcon.tags.join(', ')}]`,
        )
      } else {
        serverLogger.warn(`No icons with metadata found for ${providerSlug}`)
      }

      results[providerSlug] = testResult.icons.slice(0, TEST_ICON_COUNT)
      totalIconsProcessed += testResult.numIcons
      totalIconsWithTags += testResult.numIconsWithTags

      serverLogger.info(`✅ ${providerName} metadata extraction completed`)
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
  serverLogger.info(`Total providers tested: ${providerSlugs.length}`)
  serverLogger.info(`Total icons processed: ${totalIconsProcessed}`)
  serverLogger.info(
    `Total icons with tags: ${totalIconsWithTags} (${overallTagsPercentage}%)`,
  )

  // Provider-by-provider breakdown (sorted by percentage, lowest to highest)
  serverLogger.info('Provider breakdown (sorted by tag detection rate):')

  const providerStats = Object.entries(results).map(([provider, icons]) => {
    const iconsWithTagsCount = icons.reduce((count, icon) => {
      return icon.tags && icon.tags.length > 0 ? count + 1 : count
    }, 0)
    const percentage =
      icons.length > 0
        ? Math.round((iconsWithTagsCount / icons.length) * 100)
        : 0

    return {
      provider,
      iconsWithTags: iconsWithTagsCount,
      totalIcons: icons.length,
      percentage,
    }
  })

  // Sort by percentage (lowest to highest)
  providerStats.sort((a, b) => a.percentage - b.percentage)

  // Log sorted results
  providerStats.forEach(
    ({ provider, iconsWithTags, totalIcons, percentage }) => {
      serverLogger.info(
        `  ${provider}: ${iconsWithTags}/${totalIcons} (${percentage}%).`,
      )
    },
  )

  serverLogger.info('✅ Metadata extraction tests completed successfully!')
  process.exit(0)
}

// Individual test functions for each provider

/**
 * Generic function to test tag scraping for any provider
 */
async function testTagScraping<T extends IconProviderSlug>({
  providerSlug,
  sampleSize = Infinity,
}: {
  providerSlug: T
  sampleSize?: number
}): Promise<TagScrapeTest> {
  const icons = await scrapeIcons(providerSlug)
  const testIcons = icons.slice(0, sampleSize)
  const result = await addTags(providerSlug, testIcons)
  const iconsWithTags = result.filter((icon) => icon.tags.length > 0)

  return {
    success: result.length > 0,
    numIcons: result.length,
    numIconsWithTags: iconsWithTags.length,
    icons: result,
  }
}

// Export individual test functions for selective testing
export {
  testMetadataExtraction, // comprehensive test
  testTagScraping,
}
