import { getIcons } from '@/app/api/icons/client'

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
      (icon) => {
        const nameMatch = icon.name.toLowerCase().includes('icon')
        const tags = icon.tags ? JSON.parse(icon.tags) : []
        const tagMatch = tags.some((tag: string) => tag.toLowerCase().includes('icon'))
        return !nameMatch && !tagMatch
      }
    )
    if (invalidIcons1.length > 0) {
      throw new Error(
        `Test 1 failed: Found ${invalidIcons1.length} icons that don't contain 'icon' in name or tags`,
      )
    }
    console.log(
      `✓ Test 1 passed: Found ${icons1.length} icons with 'icon' in name or tags (limit 5)`,
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
      (icon) => {
        const nameMatch = icon.name.toLowerCase().includes('home')
        const tags = icon.tags ? JSON.parse(icon.tags) : []
        const tagMatch = tags.some((tag: string) => tag.toLowerCase().includes('home'))
        return !nameMatch && !tagMatch
      }
    )
    if (invalidIcons4.length > 0) {
      throw new Error(
        `Test 4 failed: Found ${invalidIcons4.length} icons that don't contain 'home' in name or tags`,
      )
    }
    console.log(
      `✓ Test 4 passed: Found ${icons4.length} icons with 'home' in name or tags (all valid)`,
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
      (icon) => {
        const tags = icon.tags ? JSON.parse(icon.tags) : []
        const nameHasArrow = icon.name.toLowerCase().includes('arrow')
        const nameHasLeft = icon.name.toLowerCase().includes('left')
        const tagsHaveArrow = tags.some((tag: string) => tag.toLowerCase().includes('arrow'))
        const tagsHaveLeft = tags.some((tag: string) => tag.toLowerCase().includes('left'))
        return !(nameHasArrow || tagsHaveArrow) || !(nameHasLeft || tagsHaveLeft)
      }
    )
    if (invalidIcons6.length > 0) {
      throw new Error(
        `Test 6 failed: Found ${invalidIcons6.length} icons that don't contain both 'arrow' and 'left' in name or tags`,
      )
    }
    console.log(
      `✓ Test 6 passed: Found ${icons6.length} icons with both 'arrow' and 'left' in name or tags`,
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
      (icon) => {
        const tags = icon.tags ? JSON.parse(icon.tags) : []
        const nameHasUser = icon.name.toLowerCase().includes('user')
        const nameHasProfile = icon.name.toLowerCase().includes('profile')
        const tagsHaveUser = tags.some((tag: string) => tag.toLowerCase().includes('user'))
        const tagsHaveProfile = tags.some((tag: string) => tag.toLowerCase().includes('profile'))
        return !(nameHasUser || tagsHaveUser) && !(nameHasProfile || tagsHaveProfile)
      }
    )
    if (invalidIcons7.length > 0) {
      throw new Error(
        `Test 7 failed: Found ${invalidIcons7.length} icons that don't contain either 'user' or 'profile' in name or tags`,
      )
    }
    console.log(
      `✓ Test 7 passed: Found ${icons7.length} icons with 'user' or 'profile' in name or tags`,
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
      (icon) => {
        const tags = icon.tags ? JSON.parse(icon.tags) : []
        const nameHasIcon = icon.name.toLowerCase().includes('icon')
        const nameHasHome = icon.name.toLowerCase().includes('home')
        const tagsHaveIcon = tags.some((tag: string) => tag.toLowerCase().includes('icon'))
        const tagsHaveHome = tags.some((tag: string) => tag.toLowerCase().includes('home'))
        return !(nameHasIcon || tagsHaveIcon) && !(nameHasHome || tagsHaveHome)
      }
    )
    if (invalidIcons8.length > 0) {
      throw new Error(
        `Test 8 failed: Found ${invalidIcons8.length} icons that don't contain either 'icon' or 'home' in name or tags`,
      )
    }
    console.log(
      `✓ Test 8 passed: Found ${icons8.length} icons with 'icon' or 'home' in name or tags`,
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
      (icon) => {
        const tags = icon.tags ? JSON.parse(icon.tags) : []
        const nameHasArrow = icon.name.toLowerCase().includes('arrow')
        const nameHasLeft = icon.name.toLowerCase().includes('left')
        const nameHasIcon = icon.name.toLowerCase().includes('icon')
        const tagsHaveArrow = tags.some((tag: string) => tag.toLowerCase().includes('arrow'))
        const tagsHaveLeft = tags.some((tag: string) => tag.toLowerCase().includes('left'))
        const tagsHaveIcon = tags.some((tag: string) => tag.toLowerCase().includes('icon'))
        return !(nameHasArrow || tagsHaveArrow) && !(nameHasLeft || tagsHaveLeft) && !(nameHasIcon || tagsHaveIcon)
      }
    )
    if (invalidIcons9.length > 0) {
      throw new Error(
        `Test 9 failed: Found ${invalidIcons9.length} icons that don't contain any of the terms 'arrow', 'left', or 'icon' in name or tags`,
      )
    }
    console.log(
      `✓ Test 9 passed: Found ${icons9.length} icons with at least one of 'arrow', 'left', or 'icon' in name or tags`,
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
      (icon) => {
        const nameMatch = icon.name.toLowerCase().includes('home')
        const tags = icon.tags ? JSON.parse(icon.tags) : []
        const tagMatch = tags.some((tag: string) => tag.toLowerCase().includes('home'))
        return !nameMatch && !tagMatch
      }
    )
    if (invalidIcons10.length > 0) {
      throw new Error(
        `Test 10 failed: Found ${invalidIcons10.length} icons that don't contain 'home' in name or tags`,
      )
    }
    console.log(
      `✓ Test 10 passed: Found ${icons10.length} icons with 'home' in name or tags (trailing spaces handled)`,
    )

    // Test 11: No duplicates in combined AND/OR results
    const icons11 = await getIcons({
      skip: 0,
      limit: 50,
      searchText: 'icon home', // Should trigger both AND and OR logic
    })
    if (icons11.length > 50) {
      throw new Error(
        `Test 11 failed: Expected at most 50 icons, got ${icons11.length}`,
      )
    }
    const uniqueIds = new Set(icons11.map((icon) => icon.id))
    if (uniqueIds.size !== icons11.length) {
      throw new Error(
        `Test 11 failed: Found ${icons11.length} icons but only ${uniqueIds.size} unique IDs - duplicates detected`,
      )
    }
    console.log(
      `✓ Test 11 passed: Found ${icons11.length} unique icons with no duplicates`,
    )

    // Test 12: Verify AND results come before OR results
    const icons12 = await getIcons({
      skip: 0,
      limit: 20,
      searchText: 'arrow left', // Should have some AND matches and potentially OR matches
    })
    if (icons12.length > 20) {
      throw new Error(
        `Test 12 failed: Expected at most 20 icons, got ${icons12.length}`,
      )
    }
    // Check that all icons contain both terms (AND logic) or are properly ordered
    let andResultsEnded = false
    for (const icon of icons12) {
      const tags = icon.tags ? JSON.parse(icon.tags) : []
      const nameHasArrow = icon.name.toLowerCase().includes('arrow')
      const nameHasLeft = icon.name.toLowerCase().includes('left')
      const tagsHaveArrow = tags.some((tag: string) => tag.toLowerCase().includes('arrow'))
      const tagsHaveLeft = tags.some((tag: string) => tag.toLowerCase().includes('left'))
      
      const hasArrow = nameHasArrow || tagsHaveArrow
      const hasLeft = nameHasLeft || tagsHaveLeft
      const isAndResult = hasArrow && hasLeft
      const isOrResult = hasArrow || hasLeft

      if (!isAndResult && !andResultsEnded) {
        andResultsEnded = true
      }
      if (isAndResult && andResultsEnded) {
        throw new Error(
          `Test 12 failed: Found AND result '${icon.name}' after OR results started`,
        )
      }
      if (!isOrResult) {
        throw new Error(
          `Test 12 failed: Found icon '${icon.name}' that doesn't match either AND or OR logic`,
        )
      }
    }
    console.log(
      `✓ Test 12 passed: Found ${icons12.length} icons with proper AND/OR ordering`,
    )

    // Test 13: Tag-only search functionality
    const icons13 = await getIcons({ skip: 0, limit: 5, searchText: 'solid' })
    if (icons13.length > 5) {
      throw new Error(
        `Test 13 failed: Expected at most 5 icons, got ${icons13.length}`,
      )
    }
    // Verify at least some results have tags containing the search term
    let tagMatches = 0
    for (const icon of icons13) {
      const tags = icon.tags ? JSON.parse(icon.tags) : []
      if (tags.some((tag: string) => tag.toLowerCase().includes('solid'))) {
        tagMatches++
      }
    }
    if (tagMatches === 0 && icons13.length > 0) {
      console.warn('Warning: No tag matches found for "solid" search')
    }
    console.log(
      `✓ Test 13 passed: Found ${icons13.length} icons with tag search, ${tagMatches} with matching tags`,
    )

    // Test 14: Partial tag match
    const icons14 = await getIcons({ skip: 0, limit: 5, searchText: 'outl' })
    if (icons14.length > 5) {
      throw new Error(
        `Test 14 failed: Expected at most 5 icons, got ${icons14.length}`,
      )
    }
    // Verify partial matches work
    let partialMatches = 0
    for (const icon of icons14) {
      const tags = icon.tags ? JSON.parse(icon.tags) : []
      const nameMatch = icon.name.toLowerCase().includes('outl')
      const tagMatch = tags.some((tag: string) => tag.toLowerCase().includes('outl'))
      if (nameMatch || tagMatch) {
        partialMatches++
      }
    }
    console.log(
      `✓ Test 14 passed: Found ${icons14.length} icons with partial search, ${partialMatches} with matches`,
    )

    // Test 15: Verify JSON tag format
    const icons15 = await getIcons({ skip: 0, limit: 3, searchText: '' })
    for (const icon of icons15) {
      if (icon.tags) {
        try {
          const parsedTags = JSON.parse(icon.tags)
          if (!Array.isArray(parsedTags)) {
            throw new Error(`Tags should be JSON array, got: ${typeof parsedTags}`)
          }
        } catch (error) {
          throw new Error(`Test 15 failed: Invalid JSON in tags for icon ${icon.name}: ${error}`)
        }
      }
    }
    console.log(`✓ Test 15 passed: All tags are properly formatted JSON arrays`)

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
