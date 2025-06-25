#!/bin/bash
set -e

echo "🔍 Running ESLint..."
npm run lint

echo "🏗️  Building Next.js app..."
npx next build

echo "✅ Build completed successfully!"