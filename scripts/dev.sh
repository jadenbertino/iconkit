#!/bin/bash
export ENVIRONMENT=${ENVIRONMENT:-development}

# Load DOPPLER_TOKEN from env file
source scripts/utils/get_doppler_token.sh
export DOPPLER_TOKEN

# Was having issues with turbopack on mac
if [[ "$OSTYPE" == "darwin"* ]]; then
  doppler run -- npx next dev
else
  doppler run -- npx next dev --turbopack
fi