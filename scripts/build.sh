#!/bin/bash
set -e

# If running this script locally, then do:
# doppler run -- ./scripts/build.sh

# Update version in Doppler
git_branch=$(git branch --show-current)
echo "🔍 Git branch: $git_branch"
if [ "$git_branch" = "main" ] || [ "$git_branch" = "master" ]; then
    ./scripts/version-manager.sh check # local & git is "main" but vercel clones to "master" for some reason
fi
./scripts/version-manager.sh update

echo "🔍 Running ESLint..."
npm run lint

echo "🔄 Uploading icons to database..."
npx tsx src/build/index.ts "$@"

echo "🏗️  Building Next.js app..."
npx next build

echo "✅ Build completed successfully!"