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

# Validate environment variables
doppler run -- npx tsx src/env/client.ts
doppler run -- npx tsx src/env/server.ts

# Export DOPPLER_TOKEN
export DOPPLER_TOKEN