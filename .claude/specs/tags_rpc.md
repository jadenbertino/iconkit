# Tags RPC Function Specification

## Overview

This specification outlines the implementation of a PostgreSQL RPC (Remote Procedure Call) function to enable efficient database-level partial text search within icon tags arrays using `array_to_string()`. This will replace the current JavaScript-based filtering approach with a more performant database-level solution.

## Current State Analysis

### Current Implementation
- **Location**: `src/app/api/icons/client.ts`
- **Method**: PostgREST queries with exact tag matching using `tags.cs.{term}`
- **Functions**: `searchIconsByAnd()`, `searchIconsByOr()`, `getIcons()`, `getAllIcons()`
- **Limitation**: Only supports exact tag matches, not partial text search within tags
- **Architecture**: AND/OR search pattern with exclusion logic

### Current Search Logic

#### Main Function: `getIcons()`
```typescript
async function getIcons({ skip, limit, searchText }: SearchParams) {
  const terms = parseSearchTerms(searchText?.trim() ?? '')
  if (terms.length === 0) {
    return getAllIcons({ skip, limit })
  }

  // Do AND query first (all terms must match)
  const andResults = await searchIconsByAnd({ terms, skip, limit })
  if (andResults.length >= limit) {
    return andResults
  }

  // If we need more results, do OR query excluding AND results
  const excludeIds = andResults.map((icon) => icon.id)
  const remainingLimit = limit - andResults.length
  const remainingSkip = Math.max(0, skip - andResults.length)

  const orResults = await searchIconsByOr({ 
    terms, 
    excludeIds, 
    skip: remainingSkip, 
    limit: remainingLimit 
  })

  return [...andResults, ...orResults]
}
```

#### AND Search Logic: `searchIconsByAnd()`
```typescript
async function searchIconsByAnd({ terms, skip, limit }) {
  let andQuery = baseQuery()
  terms.forEach((term) => {
    // Each term must match either name OR tags (exact tag match only)
    andQuery = andQuery.or(`name.ilike.%${term}%,tags.cs.{${term}}`)
  })
  return await andQuery.range(skip, skip + limit - 1).order('name').throwOnError()
}
```

#### OR Search Logic: `searchIconsByOr()`
```typescript
async function searchIconsByOr({ terms, excludeIds, skip, limit }) {
  let orQuery = baseQuery()
  
  if (excludeIds.length > 0) {
    orQuery = orQuery.not('id', 'in', `(${excludeIds.join(',')})`)
  }

  // Create OR conditions for individual terms
  const orConditions = terms
    .map((term) => `name.ilike.%${term}%,tags.cs.{${term}}`)
    .join(',')
  orQuery = orQuery.or(orConditions)
  
  return await orQuery.range(skip, skip + limit - 1).order('name').throwOnError()
}
```

#### Current Limitations
1. **Exact Tag Matching Only**: `tags.cs.{term}` requires exact matches
   - Searching "nav" won't find icons with "navigation" tags  
   - Searching "form" won't find icons with "formatting" tags
2. **PostgREST Constraint**: Cannot use `array_to_string()` directly in query syntax
3. **Limited Flexibility**: Users must know exact tag values to find icons

## Proposed Solution

### PostgreSQL RPC Functions

Create two PostgreSQL functions to handle AND and OR search logic with database-level performance.

#### Function 1: `search_icons_and`
```sql
CREATE OR REPLACE FUNCTION search_icons_and(
  search_terms TEXT[],
  version_filter TEXT,
  result_limit INT DEFAULT 50,
  result_offset INT DEFAULT 0
)
RETURNS TABLE(
  id BIGINT,
  created_at TIMESTAMPTZ,
  version TEXT,
  name TEXT,
  svg TEXT,
  source_url TEXT,
  provider_id BIGINT,
  jsx TEXT,
  tags TEXT[]
) AS $$
DECLARE
  term TEXT;
BEGIN
  -- Start with base query
  RETURN QUERY
  SELECT i.id, i.created_at, i.version, i.name, i.svg, i.source_url, i.provider_id, i.jsx, i.tags
  FROM icon i
  WHERE i.version = version_filter
  AND (
    -- For each term, check if it matches name OR any tag (using array_to_string)
    SELECT bool_and(
      i.name ILIKE '%' || unnest_terms.term || '%' 
      OR array_to_string(i.tags, ' ') ILIKE '%' || unnest_terms.term || '%'
    )
    FROM unnest(search_terms) AS unnest_terms(term)
  )
  ORDER BY i.name
  LIMIT result_limit OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;
```

#### Function 2: `search_icons_or`
```sql
CREATE OR REPLACE FUNCTION search_icons_or(
  search_terms TEXT[],
  exclude_ids BIGINT[],
  version_filter TEXT,
  result_limit INT DEFAULT 50,
  result_offset INT DEFAULT 0
)
RETURNS TABLE(
  id BIGINT,
  created_at TIMESTAMPTZ,
  version TEXT,
  name TEXT,
  svg TEXT,
  source_url TEXT,
  provider_id BIGINT,
  jsx TEXT,
  tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT i.id, i.created_at, i.version, i.name, i.svg, i.source_url, i.provider_id, i.jsx, i.tags
  FROM icon i
  WHERE i.version = version_filter
  AND i.id != ALL(exclude_ids)  -- Exclude already found icons
  AND (
    -- For any term, check if it matches name OR any tag
    SELECT bool_or(
      i.name ILIKE '%' || unnest_terms.term || '%' 
      OR array_to_string(i.tags, ' ') ILIKE '%' || unnest_terms.term || '%'
    )
    FROM unnest(search_terms) AS unnest_terms(term)
  )
  ORDER BY i.name
  LIMIT result_limit OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;
```

## Implementation Plan

### Step 1: Database Migration
Create a new migration file to add the RPC functions:

```sql
-- migrations/add_search_functions.sql
-- Add the two functions above
-- Consider adding indexes for performance:
CREATE INDEX IF NOT EXISTS idx_icon_tags_searchable 
ON icon USING gin(array_to_string(tags, ' ') gin_trgm_ops);
```

### Step 2: Update Client Code

#### Updated RPC-based Functions
Replace the existing functions in `src/app/api/icons/client.ts`:

```typescript
async function searchIconsByAnd({ terms, skip, limit }: { terms: string[], skip: number, limit: number }) {
  const { data: andResults } = await supabase
    .rpc('search_icons_and', {
      search_terms: terms,
      version_filter: CLIENT_ENV.VERSION,
      result_limit: limit,
      result_offset: skip
    })
    .throwOnError()
  
  return andResults || []
}

async function searchIconsByOr({ terms, excludeIds, skip, limit }: { terms: string[], excludeIds: number[], skip: number, limit: number }) {
  const { data: orResults } = await supabase
    .rpc('search_icons_or', {
      search_terms: terms,
      exclude_ids: excludeIds,
      version_filter: CLIENT_ENV.VERSION,
      result_limit: limit,
      result_offset: skip
    })
    .throwOnError()
  
  return orResults || []
}
```

**Note**: The main `getIcons()` function and its orchestration logic remains unchanged. Only the implementation of the two search functions changes from PostgREST queries to RPC calls.

#### Functions That Don't Change
The following functions and their logic remain exactly the same:

- `getIcons()` - Main orchestration function
- `getAllIcons()` - Non-search icon retrieval  
- `parseSearchTerms()` - Text parsing utility
- `baseQuery()` - Base query helper (still used by `getAllIcons()`)

The API interface, function signatures, and return types all remain identical. This is purely an internal implementation change to enable partial tag matching.

#### What Changes
Only the internal implementation of:
- `searchIconsByAnd()` - Changes from PostgREST query to RPC call
- `searchIconsByOr()` - Changes from PostgREST query to RPC call

The behavior changes from exact tag matching to partial tag matching, which is the desired improvement.

### Step 3: Testing Strategy

#### Unit Tests
```typescript
// tests/search-rpc.test.ts
describe('RPC Search Functions', () => {
  test('searchIconsByAnd with partial tag matching', async () => {
    const results = await searchIconsByAnd({ 
      terms: ['nav'], 
      skip: 0, 
      limit: 5 
    })
    
    expect(results.length).toBeGreaterThan(0)
    expect(results.some(icon => 
      icon.tags?.some(tag => tag.includes('navigation'))
    )).toBe(true)
  })

  test('searchIconsByOr excludes provided IDs', async () => {
    const excludeIds = [1, 2, 3]
    const results = await searchIconsByOr({
      terms: ['arrow'],
      excludeIds,
      skip: 0,
      limit: 10
    })
    
    expect(results.every(icon => !excludeIds.includes(icon.id))).toBe(true)
  })
})
```

#### Performance Tests
```typescript
describe('Performance Comparison', () => {
  test('RPC vs JavaScript filtering performance', async () => {
    const startTime = performance.now()
    
    // Test RPC approach
    const rpcResults = await searchIconsByAnd({ terms: ['arrow'], skip: 0, limit: 50 })
    const rpcTime = performance.now() - startTime
    
    // Compare with previous JavaScript approach (if still available)
    expect(rpcTime).toBeLessThan(500) // Should be under 500ms
    expect(rpcResults.length).toBeGreaterThan(0)
  })
})
```

## Benefits

### Functional Improvements
- **Partial Tag Matching**: `"nav"` will find icons with `"navigation"` tags
- **Better User Experience**: Users don't need to know exact tag values
- **More Flexible Search**: `"form"` finds `"formatting"`, `"arch"` finds `"architecture"`
- **Consistent with Name Search**: Both name and tag search use partial matching

### Performance
- **Database-level filtering**: Only matching records are returned (vs current PostgREST approach)
- **Indexing support**: PostgreSQL can optimize queries with proper indexes
- **Efficient string operations**: `array_to_string()` performed at database level
- **Optimized queries**: PostgreSQL query planner can optimize RPC functions

### Scalability
- **Consistent performance**: Query time won't increase significantly with more icons
- **Better resource usage**: Less CPU and memory usage on the application server
- **Concurrent users**: Database can handle multiple search requests efficiently

### Maintainability
- **Centralized logic**: Search logic in database functions
- **Type safety**: Supabase generates types for RPC functions
- **Easier testing**: Can test database functions independently

## Migration Strategy

### Phase 1: Parallel Implementation
1. Create RPC functions alongside existing JavaScript approach
2. Add feature flag to switch between approaches
3. Test thoroughly in development

### Phase 2: Gradual Rollout
1. Deploy RPC functions to staging
2. Run A/B tests comparing performance
3. Monitor for any differences in search results

### Phase 3: Full Migration
1. Switch to RPC approach in production
2. Remove JavaScript filtering code
3. Add performance monitoring

## Considerations

### Database Permissions
- Ensure Supabase service role has permission to execute RPC functions
- Test RPC functions work with Row Level Security (RLS) if enabled

### Error Handling
```typescript
try {
  const results = await supabase.rpc('search_icons_and', params)
  if (results.error) throw results.error
  return results.data || []
} catch (error) {
  // Log error and fallback to basic search if needed
  console.error('RPC search failed:', error)
  throw error
}
```

### Backward Compatibility
- Keep existing function signatures unchanged
- Internal implementation change should be transparent to API consumers
- Maintain same response format and structure

## Success Metrics

### Performance Targets
- Search response time: < 200ms for typical queries
- Memory usage: < 50MB during search operations
- Database CPU: < 10% for search queries

### Quality Metrics
- Search result accuracy: 100% match with current JavaScript approach
- No regression in search functionality
- Improved user experience with faster search

## Files to Modify

### Database
- `migrations/YYYY-MM-DD-add-search-functions.sql`

### Application Code
- `src/app/api/icons/client.ts` - Update search functions
- `src/app/api/icons/schema.ts` - Update if needed for RPC response types

### Tests
- `tests/search-rpc.test.ts` - New RPC-specific tests
- Update existing search tests to use RPC approach

### Documentation
- Update API documentation with RPC approach details
- Add performance benchmarks and comparisons