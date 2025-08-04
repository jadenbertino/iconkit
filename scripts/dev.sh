#!/bin/bash
export ENVIRONMENT=${ENVIRONMENT:-development}
echo "ENVIRONMENT: $ENVIRONMENT"

# Load DOPPLER_TOKEN from env file
source scripts/utils/get_doppler_token.sh
export DOPPLER_TOKEN

# Was having issues with turbopack
doppler run -- npx next dev 