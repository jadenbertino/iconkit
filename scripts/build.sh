#!/bin/bash
set -e

# If running this script locally, then do:
# doppler run -- ./scripts/build.sh

# Detect version from CHANGELOG.md & update NEXT_PUBLIC_VERSION in Doppler
npx tsx src/build/version.ts

echo "🔍 Running ESLint..."
npm run lint

echo "🔄 Uploading icons to database..."
npx tsx src/build/index.ts "$@"

echo "🏗️  Building Next.js app..."
npx next build

echo "✅ Build completed successfully!"