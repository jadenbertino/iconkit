#!/bin/bash
export ENVIRONMENT=${ENVIRONMENT:-development}

# Load DOPPLER_TOKEN from env file
source scripts/utils/get_doppler_token.sh
export DOPPLER_TOKEN

doppler run -- npx next dev --turbopack