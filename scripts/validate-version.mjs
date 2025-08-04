#!/usr/bin/env node

import { CLIENT_ENV } from '../src/env/client.ts'
import { getVersionFromChangelog } from '../src/env/utils.ts'

const changelogVersion = getVersionFromChangelog()

if (changelogVersion !== CLIENT_ENV.VERSION) {
  console.error(
    `❌ Error: Version in CHANGELOG.md (${changelogVersion}) does not match version in src/env/client.ts (${CLIENT_ENV.VERSION})`,
  )
  process.exit(1)
}

console.log(`💡 Version: ${changelogVersion}`)
console.log(`💡 Build ID: ${CLIENT_ENV.BUILD_ID}`)
process.exit(0)
