#!/bin/bash
set -e

# If running this script locally, then do:
# doppler run -- ./scripts/build.sh

# Update version in Doppler
[ "$(git branch --show-current)" = "main" ] && ./scripts/version-manager.sh check
./scripts/version-manager.sh update

echo "🔍 Running ESLint..."
npm run lint

echo "🔄 Uploading icons to database..."
npx tsx src/build/index.ts "$@"

echo "🏗️  Building Next.js app..."
npx next build

echo "✅ Build completed successfully!"