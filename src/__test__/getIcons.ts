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

    // Test 6: Multi-word search with spaces
    const icons6 = await getIcons({
      skip: 0,
      limit: 10,
      searchText: 'arrow left',
    })
    if (icons6.length > 10) {
      throw new Error(
        `Test 6 failed: Expected at most 10 icons, got ${icons6.length}`,
      )
    }
    const invalidIcons6 = icons6.filter(
      (icon) =>
        !icon.name.toLowerCase().includes('arrow') ||
        !icon.name.toLowerCase().includes('left'),
    )
    if (invalidIcons6.length > 0) {
      throw new Error(
        `Test 6 failed: Found ${invalidIcons6.length} icons that don't contain both 'arrow' and 'left' in name`,
      )
    }
    console.log(
      `✓ Test 6 passed: Found ${icons6.length} icons with both 'arrow' and 'left' in name`,
    )

    // Test 7: Multi-word search with hyphens
    const icons7 = await getIcons({
      skip: 0,
      limit: 10,
      searchText: 'user-profile',
    })
    if (icons7.length > 10) {
      throw new Error(
        `Test 7 failed: Expected at most 10 icons, got ${icons7.length}`,
      )
    }
    const invalidIcons7 = icons7.filter(
      (icon) =>
        !icon.name.toLowerCase().includes('user') ||
        !icon.name.toLowerCase().includes('profile'),
    )
    if (invalidIcons7.length > 0) {
      throw new Error(
        `Test 7 failed: Found ${invalidIcons7.length} icons that don't contain both 'user' and 'profile' in name`,
      )
    }
    console.log(
      `✓ Test 7 passed: Found ${icons7.length} icons with both 'user' and 'profile' in name`,
    )

    // Test 8: Multi-word search with underscores
    const icons8 = await getIcons({
      skip: 0,
      limit: 10,
      searchText: 'icon_home',
    })
    if (icons8.length > 10) {
      throw new Error(
        `Test 8 failed: Expected at most 10 icons, got ${icons8.length}`,
      )
    }
    const invalidIcons8 = icons8.filter(
      (icon) =>
        !icon.name.toLowerCase().includes('icon') ||
        !icon.name.toLowerCase().includes('home'),
    )
    if (invalidIcons8.length > 0) {
      throw new Error(
        `Test 8 failed: Found ${invalidIcons8.length} icons that don't contain both 'icon' and 'home' in name`,
      )
    }
    console.log(
      `✓ Test 8 passed: Found ${icons8.length} icons with both 'icon' and 'home' in name`,
    )

    // Test 9: Multi-word search with mixed delimiters
    const icons9 = await getIcons({
      skip: 0,
      limit: 10,
      searchText: 'arrow-left icon',
    })
    if (icons9.length > 10) {
      throw new Error(
        `Test 9 failed: Expected at most 10 icons, got ${icons9.length}`,
      )
    }
    const invalidIcons9 = icons9.filter(
      (icon) =>
        !icon.name.toLowerCase().includes('arrow') ||
        !icon.name.toLowerCase().includes('left') ||
        !icon.name.toLowerCase().includes('icon'),
    )
    if (invalidIcons9.length > 0) {
      throw new Error(
        `Test 9 failed: Found ${invalidIcons9.length} icons that don't contain all terms 'arrow', 'left', and 'icon' in name`,
      )
    }
    console.log(
      `✓ Test 9 passed: Found ${icons9.length} icons with all terms 'arrow', 'left', and 'icon' in name`,
    )

    // Test 10: Empty terms filtering
    const icons10 = await getIcons({
      skip: 0,
      limit: 10,
      searchText: 'home   ',
    })
    if (icons10.length > 10) {
      throw new Error(
        `Test 10 failed: Expected at most 10 icons, got ${icons10.length}`,
      )
    }
    const invalidIcons10 = icons10.filter(
      (icon) => !icon.name.toLowerCase().includes('home'),
    )
    if (invalidIcons10.length > 0) {
      throw new Error(
        `Test 10 failed: Found ${invalidIcons10.length} icons that don't contain 'home' in name`,
      )
    }
    console.log(
      `✓ Test 10 passed: Found ${icons10.length} icons with 'home' in name (trailing spaces handled)`,
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
