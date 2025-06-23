# Environment Variables Implementation Specification

## High-Level Objective

Implement a robust environment variable system with Zod validation and Doppler injection using shell scripts for environment management, ensuring type safety and proper configuration across development, staging, and production environments.

## Requirements

### Part 1: Validation (Zod)

- Client environment variables: `NEXT_PUBLIC_ENVIRONMENT` and `NEXT_PUBLIC_VERSION`
- Rename all client environment variables to remove the `NEXT_PUBLIC_` prefix. You'll need to adjust `getClientEnv` in src/env/client.ts to process all process.env keys that start with `NEXT_PUBLIC_` and remove the prefix.
- Server environment variables: AWS configuration (ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION, S3_BUCKET_NAME)
- Validation executes during both dev and build scripts
- Fail fast with clear error messages

### Part 2: Injection (Doppler)

- Environment files: `env/.env.development`, `env/.env.staging`, `env/.env.production` (gitignored)
- Example files: `env/.env.development.example`, etc. (committed)
- Shell script architecture for environment management
- Doppler config names: `development`, `staging`, `production`
- Create a function get the version from the CHANGELOG.md file. Default to `0.0.0` if not found. Default `NEXT_PUBLIC_VERSION` to the return of this function.

## Technical Implementation Plan

### New Files to Create

1. `scripts/env.sh` - Core environment sourcing and validation logic
   - Validate that $ENVIRONMENT is set
   - Validate that `env/.env.$ENVIRONMENT` exists
   - Validate that `DOPPLER_TOKEN` is set & starts with `dp.` (aka is valid)
   - Export `DOPPLER_TOKEN` to the environment
2. `scripts/dev.sh` - Development script that sources env.sh and runs dev server
3. `scripts/build.sh` - Build script that sources env.sh and runs build
4. `env/.env.development.example` - Development environment file
5. `env/.env.staging.example` - Staging environment file
6. `env/.env.production.example` - Production environment file

### Files to Modify

1. `src/env/client.ts` - Remove unnecessary variables, keep only NEXT_PUBLIC_ENVIRONMENT
2. `src/env/server.ts` - Remove DOPPLER_TOKEN, keep AWS variables
3. `package.json` - Update scripts to use new shell scripts
4. `.gitignore` - Ensure actual env files are ignored while keeping the example files

### Environment Variables Schema

#### Client (src/env/client.ts)

```typescript
const clientSchema = z.object({
  NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']),
})
```

#### Server (src/env/server.ts)

```typescript
const serverSchema = z.object({
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  S3_BUCKET_NAME: z.string(),
})
```

### Shell Script Architecture

#### scripts/env.sh

```bash
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

# Export DOPPLER_TOKEN
export DOPPLER_TOKEN
```

#### scripts/dev.sh

```bash
#!/bin/bash
source scripts/env.sh
export DOPPLER_TOKEN
doppler run -- next dev --turbopack
```

#### scripts/build.sh

```bash
#!/bin/bash
source scripts/env.sh
export DOPPLER_TOKEN
doppler run -- next build
```

### Package.json Scripts

```json
{
  "scripts": {
    "dev": "bash scripts/dev.sh",
    "build": "bash scripts/build.sh",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Environment Files Structure

```
env/
├── .env.development      # DOPPLER_TOKEN=dev_token (gitignored)
├── .env.staging         # DOPPLER_TOKEN=staging_token (gitignored)
├── .env.production      # DOPPLER_TOKEN=prod_token (gitignored)
├── .env.development.example  # DOPPLER_TOKEN=abcd (committed)
├── .env.staging.example     # DOPPLER_TOKEN=abcd (committed)
└── .env.production.example  # DOPPLER_TOKEN=abcd (committed)
```

## Testing Strategy

- Test missing environment files (should fail)
- Test missing DOPPLER_TOKEN (should fail)
- Test invalid Zod validation (should fail)
- Test environment switching via NODE_ENV
- Verify Doppler integration works for each environment

## Edge Cases & Error Handling

- Missing env file → Clear error message and exit
- Missing DOPPLER_TOKEN → Clear error message and exit
- Invalid Doppler config → Doppler CLI will handle error
- Invalid environment variables → Zod validation will handle error

## Implementation Checklist

- [ ] Create `scripts/env.sh` with validation logic
- [ ] Create `scripts/dev.sh` and `scripts/build.sh`
- [ ] Update `src/env/client.ts` - remove unnecessary vars
- [ ] Update `src/env/server.ts` - remove DOPPLER_TOKEN
- [ ] Create actual environment files in `env/`
- [ ] Update `package.json` scripts
- [ ] Update `.gitignore` for environment files
- [ ] Test all environments and error scenarios
