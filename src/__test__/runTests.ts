#!/usr/bin/env node

import { testGetIcons } from './getIcons.js'
import { testSearchPerformance } from './searchPerformance.js'

async function runAllTests() {
  console.log('='.repeat(50))
  console.log('Running IconKit Search Tests')
  console.log('='.repeat(50))
  
  try {
    console.log('\n1. Running backward compatibility tests...')
    await testGetIcons()
    console.log('✅ Backward compatibility tests passed!\n')
    
    console.log('2. Running performance tests...')
    await testSearchPerformance()
    console.log('✅ Performance tests passed!\n')
    
    console.log('🎉 All tests completed successfully!')
    console.log('✅ RPC implementation maintains backward compatibility')
    console.log('✅ Performance improvements verified')
    
  } catch (error) {
    console.error('❌ Test suite failed:')
    console.error(error)
    process.exit(1)
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests()
}

export { runAllTests }