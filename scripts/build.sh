#!/bin/bash

# Validate environment variables
npx tsx src/env/client.ts
npx tsx src/env/server.ts

npx next build