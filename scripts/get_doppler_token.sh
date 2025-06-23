#!/bin/bash
set -e

# Early return if DOPPLER_TOKEN already set
if [ ! -z "$DOPPLER_TOKEN" ]; then
  return 0
fi

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

# Validate DOPPLER_TOKEN is set and starts with dp.
if [ -z "$DOPPLER_TOKEN" ]; then
  echo "❌ DOPPLER_TOKEN not set in $ENV_FILE"
  exit 1
fi

if [[ ! "$DOPPLER_TOKEN" =~ ^dp\. ]]; then
  echo "❌ DOPPLER_TOKEN must start with 'dp.' (invalid token format)"
  exit 1
fi

# Export DOPPLER_TOKEN
export DOPPLER_TOKEN