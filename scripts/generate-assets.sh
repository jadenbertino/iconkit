#!/bin/bash
set -e

# If running this script locally, then do:
# doppler run -- ./scripts/generate-assets.sh

echo "🔄 Uploading icons to database for environment: $ENVIRONMENT"
npx tsx src/build/index.ts "$@"

echo "✅ Assets generation completed successfully!"