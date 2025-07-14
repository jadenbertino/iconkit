# Start Command

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

IconKit is a Next.js application that scrapes SVG icons from popular icon libraries (Hero Icons, Lucide, Simple Icons, etc.) and serves them through a centralized Supabase (PostgreSQL) database and web interface. It uses TypeScript types and Zod schemas for runtime validation that are both auto-generated from the database schema.

## Project Structure

> Do not read any of these files yet, just aim to gain an overview of the project structure

- `src/build/` - Git-clones provider repositories, extracts SVG files, uploads to database
- `src/__test__/` - Test files
- `src/lib/schemas/` - Database types and Zod validation schemas
- `src/constants/provider.ts` - Icon provider configurations (11 supported providers)
- `src/app/api/` - API endpoints
- `scripts/` - Build and schema generation scripts
- `docs/` - Documentation
- `src/env/` - Zod schemas for environment variable validation

> Run the following command to understand the broader project structure:

```bash
eza --tree --git-ignore --level=10 --no-permissions --no-user --no-time --all
```

### Database

> Read the following files to understand the database schema:

- `docs/Database.md` contains documentation on the overall database architecture
- `src/lib/schemas/database.ts` contains the database schema

### Environment Variables

- `env/.env.*` stores a `DOPPLER_TOKEN` for the `doppler` CLI
- During dev & build scripts, the `doppler` CLI is used to inject environment variables into the project
- `src/env/*` contains Zod schemas for environment variable validation

### API Routes

- `src/app/api/` contains the API routes
- Each API route contains the following files:
  - `schema.ts` contains the Zod schema for the request & response bodies
  - `route.ts` imports the relevant `GET`, `POST`, `PUT`, `DELETE` functions and re-exports them
  - `GET.ts`, `POST.ts`, `PUT.ts`, `DELETE.ts` contain the actual logic for the API route(s)
  - `client.ts` contains client-side abstractions to interact with the API route(s)

### Code Rules

Please read through `.claude/context/rules.md` for the code rules.

## Next Steps: Begin development session

Ask me:
"What would you like to build today?"
