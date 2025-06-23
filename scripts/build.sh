#!/bin/bash
export ENVIRONMENT=${ENVIRONMENT:-staging}

# Load DOPPLER_TOKEN from env file if not set
if [ -z "$DOPPLER_TOKEN" ]; then
  source scripts/utils/get_doppler_token.sh
  export DOPPLER_TOKEN
fi

doppler run -- next build