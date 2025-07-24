import { getIcons } from '@/app/api/icons/client'

async function testSearchPerformance() {
  try {
    console.log('Testing search performance with RPC functions...')

    // Performance test scenarios
    const testCases = [
      { searchText: 'arrow', description: 'Single common term' },
      { searchText: 'nav', description: 'Single partial match term' },
      { searchText: 'arrow left', description: 'Two-word search' },
      { searchText: 'form icon nav', description: 'Three-word search' },
      { searchText: 'navigation formatting', description: 'Partial tag matching' },
    ]

    const results = []

    for (const testCase of testCases) {
      console.log(`\nTesting: ${testCase.description} ("${testCase.searchText}")`)
      
      // Run test multiple times for average
      const iterations = 3
      const times = []
      
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now()
        
        const icons = await getIcons({
          skip: 0,
          limit: 50,
          searchText: testCase.searchText
        })
        
        const endTime = performance.now()
        const duration = endTime - startTime
        times.push(duration)
        
        console.log(`  Iteration ${i + 1}: ${duration.toFixed(2)}ms (${icons.length} results)`)
      }
      
      const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length
      const minTime = Math.min(...times)
      const maxTime = Math.max(...times)
      
      results.push({
        testCase: testCase.description,
        searchText: testCase.searchText,
        avgTime: avgTime.toFixed(2),
        minTime: minTime.toFixed(2),
        maxTime: maxTime.toFixed(2),
        iterations,
      })
      
      console.log(`  Average: ${avgTime.toFixed(2)}ms, Min: ${minTime.toFixed(2)}ms, Max: ${maxTime.toFixed(2)}ms`)
      
      // Performance assertion - should be under 500ms
      if (avgTime > 500) {
        throw new Error(
          `Performance test failed: Average time ${avgTime.toFixed(2)}ms exceeds 500ms threshold for "${testCase.searchText}"`
        )
      }
    }

    // Test large result set performance
    console.log('\nTesting large result set performance...')
    const startTimeLarge = performance.now()
    
    const largeResults = await getIcons({
      skip: 0,
      limit: 100,
      searchText: 'icon' // Should return many results
    })
    
    const endTimeLarge = performance.now()
    const largeDuration = endTimeLarge - startTimeLarge
    
    console.log(`Large result set: ${largeDuration.toFixed(2)}ms (${largeResults.length} results)`)
    
    if (largeDuration > 1000) {
      throw new Error(
        `Large result set performance test failed: Time ${largeDuration.toFixed(2)}ms exceeds 1000ms threshold`
      )
    }

    // Test pagination performance
    console.log('\nTesting pagination performance...')
    const paginationTests = [
      { skip: 0, limit: 20 },
      { skip: 20, limit: 20 },
      { skip: 100, limit: 20 },
    ]
    
    for (const paginationTest of paginationTests) {
      const startTimePagination = performance.now()
      
      const paginatedResults = await getIcons({
        skip: paginationTest.skip,
        limit: paginationTest.limit,
        searchText: 'arrow'
      })
      
      const endTimePagination = performance.now()
      const paginationDuration = endTimePagination - startTimePagination
      
      console.log(`Pagination (skip: ${paginationTest.skip}, limit: ${paginationTest.limit}): ${paginationDuration.toFixed(2)}ms (${paginatedResults.length} results)`)
      
      if (paginationDuration > 300) {
        throw new Error(
          `Pagination performance test failed: Time ${paginationDuration.toFixed(2)}ms exceeds 300ms threshold`
        )
      }
    }

    // Print summary table
    console.log('\n=== Performance Test Summary ===')
    console.log('Test Case'.padEnd(25) + 'Search Text'.padEnd(20) + 'Avg Time'.padEnd(12) + 'Min Time'.padEnd(12) + 'Max Time')
    console.log('-'.repeat(75))
    
    for (const result of results) {
      console.log(
        result.testCase.padEnd(25) + 
        `"${result.searchText}"`.padEnd(20) + 
        `${result.avgTime}ms`.padEnd(12) + 
        `${result.minTime}ms`.padEnd(12) + 
        `${result.maxTime}ms`
      )
    }

    console.log('\n✓ All performance tests passed!')
    console.log('✓ RPC search functions are performing within acceptable thresholds')
    
  } catch (error) {
    console.error('Performance test failed:', error)
    throw error
  }
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testSearchPerformance()
}

export { testSearchPerformance }