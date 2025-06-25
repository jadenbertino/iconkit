# Sync Database Documentation

Synchronize the database documentation with the actual database schema by comparing migration files against docs.

## Process

### 1. Read Database Migration Files

Read all SQL migration files in `supabase/migrations/*.sql` to understand the current database schema:

```bash
# Find all migration files
find supabase/migrations -name "*.sql" -type f
```

Focus on:
- Table creation statements (`CREATE TABLE`)
- Column definitions and data types
- Primary keys and foreign key constraints
- Index definitions

### 2. Read Current Documentation

Read the existing database documentation:
- `docs/Database.md` - Main database schema documentation

### 3. Compare and Identify Differences

Compare the actual schema from migrations against the documented schema, looking for:

**Column Types**:
- Verify data types match (TEXT vs VARCHAR vs other types)
- Check for type consistency across similar columns

**Column Names**:
- Ensure column names in docs match actual schema
- Look for renamed or missing columns

**Table Structure**:
- Verify all columns are documented
- Check for missing or extra columns in documentation

**Constraints**:
- Foreign key relationships
- Primary key definitions
- Unique constraints

### 4. Update Documentation

If differences are found, update `docs/Database.md` to match the actual schema:

- Fix column data types to match migration files
- Update column names to match actual schema
- Remove documented columns that don't exist in schema  
- Add any missing columns from actual schema
- Ensure foreign key relationships are accurately described

### 5. Report Changes

Summarize what changes were made:
- List specific column type changes
- Note any missing/added columns
- Highlight structural differences that were corrected

## Important Notes

- Only update documentation to match actual schema
- Do NOT modify migration files or database schema
- Focus on accuracy - documentation should reflect reality
- Preserve existing documentation structure and formatting
- Keep TODO sections for planned but unimplemented tables