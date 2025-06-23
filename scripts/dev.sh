#!/bin/bash
export ENVIRONMENT=${ENVIRONMENT:-development}

# Load DOPPLER_TOKEN from env file
source scripts/get_doppler_token.sh
export DOPPLER_TOKEN

doppler run -- next dev --turbopack