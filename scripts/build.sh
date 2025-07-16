#!/bin/bash
set -e

# If running this script locally, then do:
# doppler run -- ./scripts/build.sh

# Source and run version management
source scripts/version-manager.sh

echo "🔍 Running ESLint..."
npm run lint

echo "🔄 Uploading icons to database..."
npx tsx src/build/index.ts

echo "🏗️  Building Next.js app..."
npx next build

echo "✅ Build completed successfully!"