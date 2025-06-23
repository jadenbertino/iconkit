#!/bin/bash
set -e

# Determine environment, throw if not set
if [ -z "$ENVIRONMENT" ]; then
  echo "❌ ENVIRONMENT not set"
  exit 1
fi

# Check if env file exists
ENV_FILE="env/.env.${ENVIRONMENT}"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ Environment file not found: $ENV_FILE"
  exit 1
fi

# Source the environment file
source "$ENV_FILE"

# Validate DOPPLER_TOKEN is set
if [ -z "$DOPPLER_TOKEN" ]; then
  echo "❌ DOPPLER_TOKEN not set in $ENV_FILE"
  exit 1
fi

# Validate DOPPLER_TOKEN is valid
if ! doppler configure get project --token "$DOPPLER_TOKEN" > /dev/null 2>&1; then
  echo "❌ Invalid DOPPLER_TOKEN in $ENV_FILE"
  exit 1
fi

# Validate environment variables
npx tsx src/env/client.ts
npx tsx src/env/server.ts

# Export DOPPLER_TOKEN
export DOPPLER_TOKEN