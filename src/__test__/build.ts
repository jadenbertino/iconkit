import { type IconProviderId } from '@/constants'
import { supabaseAdmin } from '@/lib/clients/server'
import { serverLogger } from '@/lib/logs/server'
import { scrapeIcons } from '../build/scrape'
import { uploadIcons } from '../build/upload'

async function testUpload() {
  const TEST_PROVIDER: IconProviderId = 'hero_icons'
  const TEST_ICON_COUNT = 10

  serverLogger.info(`Starting test upload for ${TEST_PROVIDER}`)

  try {
    // Step 1: Scrape icons from the test provider
    serverLogger.info(`Scraping icons from ${TEST_PROVIDER}...`)
    const allIcons = await scrapeIcons(TEST_PROVIDER)

    // Step 2: Take only the first 10 icons for testing
    const testIcons = allIcons.slice(0, TEST_ICON_COUNT)
    serverLogger.info(`Selected ${testIcons.length} icons for testing`)

    // Step 3: Upload the test icons
    serverLogger.info('Uploading test icons...')
    await uploadIcons(testIcons, TEST_PROVIDER)

    // Step 4: Verify upload by querying the database
    const { data: uploadedIcons, error: queryError } = await supabaseAdmin
      .from('icon')
      .select('id, name, provider_id')
      .in(
        'name',
        testIcons.map((icon) => icon.name),
      )
      .order('created_at', { ascending: false })
      .limit(TEST_ICON_COUNT)

    if (queryError) {
      throw new Error(`Failed to query uploaded icons: ${queryError.message}`)
    }

    serverLogger.info(
      `Successfully verified ${uploadedIcons?.length || 0} uploaded icons`,
    )

    // Step 5: Clean up - delete the test icons
    if (uploadedIcons && uploadedIcons.length > 0) {
      serverLogger.info('Cleaning up test icons...')
      const iconIds = uploadedIcons.map((icon) => icon.id)

      const { error: deleteError } = await supabaseAdmin
        .from('icon')
        .delete()
        .in('id', iconIds)

      if (deleteError) {
        throw new Error(`Failed to delete test icons: ${deleteError.message}`)
      }

      serverLogger.info(`Successfully deleted ${iconIds.length} test icons`)
    }

    serverLogger.info('✅ Test upload completed successfully!')
  } catch (error) {
    serverLogger.error('❌ Test upload failed:', error)
    process.exit(1)
  }
}

// Run the test
testUpload()
