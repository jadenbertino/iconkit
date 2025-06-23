#!/bin/bash
export ENVIRONMENT=${ENVIRONMENT:-staging}

# Load DOPPLER_TOKEN from env file if not set
source scripts/get_doppler_token.sh
export DOPPLER_TOKEN

doppler run -- next build