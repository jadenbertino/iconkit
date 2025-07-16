#!/bin/bash
set -e

# Version management script for IconKit builds
# Handles version validation, conflict checking, and Doppler updates

get_version_from_changelog() {
  if ! VERSION=$(npx tsx scripts/get-version.mjs); then
    echo "❌ Error: Failed to get version from changelog"
    exit 1
  fi

  if [ -z "$VERSION" ]; then
    echo "❌ Error: Version is empty"
    exit 1
  fi
  echo "$VERSION"
}

check_prod_version_conflicts() {
  local version="$1"
  
  # Only check conflicts in production
  if [ "$NEXT_PUBLIC_ENVIRONMENT" = "production" ]; then
    echo "🔍 Checking for version conflicts in production..."

    if [ -z "$DOPPLER_TOKEN" ]; then
      echo "❌ Error: DOPPLER_TOKEN is not set"
      exit 1
    fi
    
    if ! CURRENT_VERSION=$(doppler secrets get NEXT_PUBLIC_VERSION --plain 2>/dev/null); then
      echo "❌ Error: Failed to fetch current version from Doppler"
      exit 1
    fi
    
    if [ "$version" = "$CURRENT_VERSION" ]; then
      echo "❌ Error: Version $version is already deployed in production"
      echo "   Please update the version in CHANGELOG.md before running a new production build"
      exit 1
    fi
    
    echo "✅ Version check passed: $CURRENT_VERSION -> $version"
  fi
}

update_doppler_version() {
  local version="$1"

  if [ -z "$version" ]; then
    echo "❌ Error: Version is empty"
    exit 1
  fi

  if [ -z "$DOPPLER_TOKEN" ]; then
    echo "❌ Error: DOPPLER_TOKEN is not set"
    exit 1
  fi

  if ! doppler secrets set NEXT_PUBLIC_VERSION="$version"; then
    echo "❌ Error: Failed to set NEXT_PUBLIC_VERSION in Doppler"
    exit 1
  fi

  echo "✅ Set NEXT_PUBLIC_VERSION to: $version"
}

# If script is executed directly, run the validation
version=$(get_version_from_changelog)
echo "📝 Got version from changelog: '$version'"
check_prod_version_conflicts "$version"
update_doppler_version "$version"