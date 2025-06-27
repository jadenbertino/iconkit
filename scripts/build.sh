#!/bin/bash
set -e

echo "🔍 Running ESLint..."
npm run lint

echo "🔄 Uploading icons to database..."
doppler run -- npx tsx src/build/index.ts

echo "🏗️  Building Next.js app..."
npx next build

echo "✅ Build completed successfully!"