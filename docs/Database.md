# Database

## General notes

- Language: Postgres
- Provider: Supabase
- Naming conventions: snake_case, singular

## Integration

- Website queries `icon` table by:
  - `version` to only include icons associated with the currently deployed version
  - an `ilike` query on `name` to search for icons by name
- For each `icon`, the website queries the `provider` table to get the provider details
- For each `provider`, the website queries the `license` table and then the `license_type` table to get the license details for the provider

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
- `license_type_id` (VARCHAR): Foreign key reference to license_type table
- `url` (VARCHAR): URL to the full license text for this specific provider

### license_type

- `id` (VARCHAR): Unique identifier for the license type (e.g., 'mit', 'cc_by_4', 'apache_2')
- `name` (VARCHAR): License name (e.g., 'MIT License', 'Creative Commons Attribution 4.0')
- `type` (VARCHAR): License category (e.g., 'MIT', 'CC BY', 'Apache', 'ISC', 'CC0')
- `user_obligations` (TEXT): What users must do when using icons with this license type
- `website_obligations` (TEXT): What the website must do regarding this license type
