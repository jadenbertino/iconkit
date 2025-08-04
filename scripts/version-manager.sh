#!/bin/bash
set -e

# Version Manager Script
# Handles version validation, comparison, and Doppler updates for IconKit

extract_version() {
  local changelog_path="${1:-CHANGELOG.md}"
  if [ ! -f "$changelog_path" ]; then
    echo "❌ Error: CHANGELOG.md not found at $changelog_path"
    exit 1
  fi
  head -n 1 "$changelog_path" | tr -d '\r'
}

validate_version_format() {
  local version="$1"
  local label="${2:-version}"
  
  if ! echo "$version" | grep -E '^[0-9]+\.[0-9]+\.[0-9]+$' > /dev/null; then
    echo "❌ Error: Invalid $label format"
    echo "Expected format: x.x.x (e.g., 1.2.3)"
    echo "Found: $version"
    exit 1
  fi
}

check_version_change() {
  echo "🔍 Checking version changes..."
  
  # Extract current version
  local current_version=$(extract_version)
  echo "Current version: $current_version"
  
  # Extract previous version from git
  local previous_version
  if git rev-parse HEAD~1 >/dev/null 2>&1; then
    previous_version=$(git show HEAD~1:CHANGELOG.md | head -n 1 | tr -d '\r')
    echo "Previous version: $previous_version"
  else
    echo "⚠️  Warning: No previous commit found, skipping version comparison"
    validate_version_format "$current_version" "current version"
    echo "✅ Current version format is valid: $current_version"
    return 0
  fi
  
  echo ""
  echo "🔍 Extracted versions:"
  echo "  Current:  $current_version"
  echo "  Previous: $previous_version"
  echo ""
  
  # Validate both versions
  validate_version_format "$current_version" "current version"
  validate_version_format "$previous_version" "previous version"
  
  echo "✅ Both versions have valid format"
  echo ""
  
  # Compare versions
  if [ "$current_version" = "$previous_version" ]; then
    echo "❌ ERROR: Version has not been updated!"
    echo ""
    echo "The version in CHANGELOG.md ($current_version) is the same as the previous commit."
    echo "Please update the version number in CHANGELOG.md before deploying to production."
    echo ""
    echo "Current version: $current_version"
    echo "Previous version: $previous_version"
    echo ""
    exit 1
  else
    echo "✅ SUCCESS: Version has been updated!"
    echo "Ready for production deployment with version $current_version"
    echo ""
  fi
}

# Function to update version in Doppler
update_doppler_version() {
  echo "🔄 Updating version in Doppler..."
  npx tsx src/build/version.ts
}

# Function to display help
show_help() {
  echo "Version Manager Script"
  echo "Usage: $0 [command]"
  echo ""
  echo "Commands:"
  echo "  check          Check if version has changed from previous commit"
  echo "  update         Update NEXT_PUBLIC_VERSION in Doppler from CHANGELOG.md"
  echo "  validate       Validate current version format only"
  echo "  extract        Extract and display current version"
  echo "  help           Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 check       # Validate version change (used in CI/CD)"
  echo "  $0 update      # Update Doppler with current version (used in build)"
  echo "  $0 validate    # Just check if current version format is valid"
}

# Main script logic
case "${1:-}" in
  "check")
    check_version_change
    ;;
  "update")
    update_doppler_version
    ;;
  "validate")
    current_version=$(extract_version)
    validate_version_format "$current_version" "current version"
    echo "✅ Version format is valid: $current_version"
    ;;
  "extract")
    current_version=$(extract_version)
    echo "$current_version"
    ;;
  "help"|"-h"|"--help")
    show_help
    ;;
  "")
    echo "❌ Error: No command specified"
    echo ""
    show_help
    exit 1
    ;;
  *)
    echo "❌ Error: Unknown command '$1'"
    echo ""
    show_help
    exit 1
    ;;
esac