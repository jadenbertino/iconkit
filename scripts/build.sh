#!/bin/bash
set -e

# If running this script locally, then do:
# doppler run -- ./scripts/build.sh

# Update version in Doppler
git_branch="${VERCEL_GIT_COMMIT_REF:-$(git branch --show-current)}"
echo "🔍 Git branch: $git_branch"
if [ "$git_branch" = "main" ]; then
  ./scripts/version-manager.sh check
fi
./scripts/version-manager.sh update

echo "🔍 Running ESLint..."
npm run lint

echo "🔄 Generating assets..."
npm run generate-assets "$@"

echo "🏗️  Building Next.js app..."
npx next build

echo "✅ Build completed successfully!"