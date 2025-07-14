import { scrapeLicenses } from '@/build/scrapeLicenses'
import { serverLogger } from '@/lib/logs/server'
import * as fs from 'fs'
import * as path from 'path'

async function testLicenseScraping() {
  serverLogger.info('Starting license scraping test...')

  try {
    // Step 1: Scrape licenses from all providers
    serverLogger.info('Scraping licenses from all providers...')
    const scrapedLicenses = await scrapeLicenses()

    serverLogger.info(`Successfully scraped ${scrapedLicenses.length} licenses`)

    // Step 2: Write scraped licenses to tmp file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const tmpDir = path.join(process.cwd(), 'tmp', '__test__')
    const outputFile = path.join(tmpDir, `license-${timestamp}.json`)

    // Ensure tmp/__test__ directory exists
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true })
    }

    // Write all scraped licenses to file
    fs.writeFileSync(outputFile, JSON.stringify(scrapedLicenses, null, 2))
    serverLogger.info(`License data written to ${outputFile}`)

    // Step 3: Log summary of scraped licenses
    if (scrapedLicenses.length > 0) {
      const licenseCounts = scrapedLicenses.reduce(
        (acc, license) => {
          acc[license.type] = (acc[license.type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      serverLogger.info('License type breakdown:')
      Object.entries(licenseCounts).forEach(([type, count]) => {
        serverLogger.info(`  ${type}: ${count}`)
      })

      // Log sample licenses
      serverLogger.info('Sample licenses:')
      scrapedLicenses.slice(0, 3).forEach((license, index) => {
        serverLogger.info(
          `  ${index + 1}. Provider ID ${license.provider_id}: ${license.type}`,
        )
        serverLogger.info(`     URL: ${license.url}`)
      })
    }

    serverLogger.info('✅ License scraping test completed successfully!')
    process.exit(0) // will continue to run in claude if we don't exit here
  } catch (error) {
    serverLogger.error('❌ License scraping test failed:', error)
    process.exit(1)
  }
}

// Run the test
testLicenseScraping()
