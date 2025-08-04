#!/bin/bash
set -e

echo "📝 Updating NEXT_PUBLIC_VERSION in Doppler from CHANGELOG.md..."
npx tsx src/build/version.ts

echo "✅ NEXT_PUBLIC_VERSION updated in Doppler"