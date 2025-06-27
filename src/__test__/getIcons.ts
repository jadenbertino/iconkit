import { getIcons } from '@/app/api/icons/GET'

async function testGetIcons() {
  try {
    console.log('Testing getIcons function...')

    // Test 1: Basic search
    const icons1 = await getIcons({ skip: 0, limit: 5, searchText: 'icon' })
    if (icons1.length > 5) {
      throw new Error(
        `Test 1 failed: Expected at most 5 icons, got ${icons1.length}`,
      )
    }
    const invalidIcons1 = icons1.filter(
      (icon) => !icon.name.toLowerCase().includes('icon'),
    )
    if (invalidIcons1.length > 0) {
      throw new Error(
        `Test 1 failed: Found ${invalidIcons1.length} icons that don't contain 'icon' in name`,
      )
    }
    console.log(
      `✓ Test 1 passed: Found ${icons1.length} icons with 'icon' in name (limit 5)`,
    )

    // Test 2: Empty search (should return all)
    const icons2 = await getIcons({ skip: 0, limit: 3, searchText: '' })
    if (icons2.length !== 3) {
      throw new Error(
        `Test 2 failed: Expected exactly 3 icons, got ${icons2.length}`,
      )
    }
    console.log(
      `✓ Test 2 passed: Found exactly ${icons2.length} icons with empty search`,
    )

    // Test 3: Pagination
    const icons3 = await getIcons({ skip: 5, limit: 3, searchText: '' })
    if (icons3.length > 3) {
      throw new Error(
        `Test 3 failed: Expected at most 3 icons, got ${icons3.length}`,
      )
    }
    // Verify no overlap with previous results
    const icon2Names = new Set(icons2.map((icon) => icon.name))
    const overlaps = icons3.filter((icon) => icon2Names.has(icon.name))
    if (overlaps.length > 0) {
      throw new Error(
        `Test 3 failed: Found ${overlaps.length} overlapping icons with previous page`,
      )
    }
    console.log(
      `✓ Test 3 passed: Found ${icons3.length} icons with skip=5, limit=3 (no overlap)`,
    )

    // Test 4: Specific search term
    const icons4 = await getIcons({ skip: 0, limit: 10, searchText: 'home' })
    if (icons4.length > 10) {
      throw new Error(
        `Test 4 failed: Expected at most 10 icons, got ${icons4.length}`,
      )
    }
    const invalidIcons4 = icons4.filter(
      (icon) => !icon.name.toLowerCase().includes('home'),
    )
    if (invalidIcons4.length > 0) {
      throw new Error(
        `Test 4 failed: Found ${invalidIcons4.length} icons that don't contain 'home' in name`,
      )
    }
    console.log(
      `✓ Test 4 passed: Found ${icons4.length} icons with 'home' in name (all valid)`,
    )

    // Test 5: No results
    const icons5 = await getIcons({
      skip: 0,
      limit: 5,
      searchText: 'nonexistenticon12345',
    })
    if (icons5.length !== 0) {
      throw new Error(
        `Test 5 failed: Expected 0 icons for non-existent search, got ${icons5.length}`,
      )
    }
    console.log(
      `✓ Test 5 passed: Found exactly ${icons5.length} icons for non-existent search`,
    )

    console.log('All tests passed!')
  } catch (error) {
    console.error('Test failed:', error)
    throw error
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testGetIcons()
}

export { getIcons, testGetIcons }
