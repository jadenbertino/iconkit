# Database

## General notes

- Language: Postgres
- Provider: Supabase
- Naming conventions: snake_case, singular

## Integration

- Website queries `icon` table by:
  - `version` to only include icons associated with the currently deployed version
  - an `ilike` query on `name` to search for icons by name
- For each icon, the website queries the `provider` table to get the provider details

## Table Schemas

### icon

- `id` (UUID): Unique identifier for the icon
- `version` (VARCHAR): Git tag or commit hash when icon was scraped
- `provider_id` (VARCHAR): Foreign key reference to provider table
- `name` (VARCHAR): Icon filename without extension
- `svg_content` (TEXT): Cleaned SVG markup content
- `source_url` (VARCHAR): Direct GitHub URL to the original icon file

### provider

- `id` (VARCHAR): Unique identifier matching provider constants (e.g., 'heroicons', 'lucide')
- `name` (VARCHAR): Human-readable provider name (e.g., 'Hero Icons', 'Lucide')
- `git_url` (VARCHAR): Repository URL for the icon provider
- `git_branch` (VARCHAR): Default branch to scrape from
- `git_icons_dir` (VARCHAR): Directory path within repo containing icon files

### license

- `id` (UUID): Unique identifier for the license
- `provider_id` (VARCHAR): Foreign key reference to provider table
- `name` (VARCHAR): License name (e.g., 'MIT License', 'Apache 2.0')
- `type` (VARCHAR): License type/category (e.g., 'MIT', 'Apache', 'BSD', 'Custom')
- `url` (VARCHAR): URL to the full license text
- `attribution_required` (BOOLEAN): Whether attribution is required when using icons