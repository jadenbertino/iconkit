# Search Enhancement Specification

## Overview
Enhance IconKit's search functionality to provide better user experience, improved performance, and more comprehensive search capabilities. Currently, the search only performs basic substring matching on icon names with no advanced features.

## Current Implementation Analysis

### Search Flow
1. **Frontend**: SearchBar component with 500ms debouncing
2. **API**: `/api/icons` endpoint with `searchText`, `skip`, `limit` parameters
3. **Database**: Simple PostgreSQL `ILIKE '%searchText%'` query on `icon.name` field
4. **Results**: Alphabetical ordering, 105 icons per page

### Current Limitations
- **Limited scope**: Only searches icon names, not provider names, SVG content, or tags
- **Basic algorithm**: Simple substring matching with no fuzzy search or typo tolerance
- **No relevance scoring**: Results ordered alphabetically instead of by relevance
- **No filtering**: Cannot filter by provider, category, or other attributes
- **Performance**: No search-specific database indexes
- **No analytics**: No tracking of search terms or success rates

## Feature Requirements

### Phase 1: Core Search Improvements (High Impact, Low Effort)

#### 1. Multi-word Delimiter Search
**Priority**: High
**Effort**: Low

**Description**: Break search queries by delimiters (spaces, hyphens, underscores) and search for each term separately.

**Implementation**:
```typescript
// In src/app/api/icons/GET.ts
function parseSearchTerms(searchText: string): string[] {
  return searchText
    .split(/[\s\-_]+/)
    .filter(term => term.length > 0)
    .slice(0, 10); // Limit to 10 terms max
}

// SQL query becomes:
const terms = parseSearchTerms(searchText);
const whereConditions = terms.map((_, index) => `name ILIKE $${index + 3}`);
const query = `
  SELECT * FROM icon 
  WHERE version = $1 
  AND (${whereConditions.join(' AND ')})
  ORDER BY name
  LIMIT $2 OFFSET $${terms.length + 3}
`;
```

**Acceptance Criteria**:
- Search "arrow left" returns icons matching both "arrow" AND "left"
- Search "user-profile" returns icons matching both "user" AND "profile"
- Maximum 10 search terms processed
- Empty terms are filtered out

#### 2. Multi-field Search
**Priority**: High
**Effort**: Medium

**Description**: Extend search to include provider names and SVG content alongside icon names.

**Database Changes**:
```sql
-- Add search indexes
CREATE INDEX CONCURRENTLY idx_icon_name_gin ON icon USING gin(name gin_trgm_ops);
CREATE INDEX CONCURRENTLY idx_icon_search_fields ON icon USING gin(
  (name || ' ' || svg) gin_trgm_ops
);
```

**Implementation**:
```sql
-- Updated query
SELECT i.*, p.name as provider_name FROM icon i
JOIN provider p ON i.provider_id = p.id
WHERE i.version = $1 
AND (
  i.name ILIKE ANY($2) OR 
  p.name ILIKE ANY($2) OR 
  i.svg ILIKE ANY($2)
)
ORDER BY 
  CASE WHEN i.name ILIKE $3 THEN 1 ELSE 2 END, -- Exact name matches first
  i.name
```

**Acceptance Criteria**:
- Search "hero" returns Hero Icons provider icons
- Search "path" returns icons containing SVG path elements
- Exact name matches appear before partial matches
- Provider names are searchable

#### 3. Database Indexing
**Priority**: High
**Effort**: Low

**Description**: Add appropriate indexes to improve search performance.

**Database Changes**:
```sql
-- Required indexes for search performance
CREATE INDEX CONCURRENTLY idx_icon_version_name ON icon(version, name);
CREATE INDEX CONCURRENTLY idx_icon_name_trgm ON icon USING gin(name gin_trgm_ops);
CREATE INDEX CONCURRENTLY idx_provider_name ON provider(name);

-- Enable trigram extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

**Acceptance Criteria**:
- Search queries execute in <100ms for databases with 50k+ icons
- Query plans show index usage instead of sequential scans
- No performance regression on non-search queries

#### 4. Search Result Ranking
**Priority**: Medium
**Effort**: Medium

**Description**: Implement relevance scoring to show most relevant results first.

**Implementation**:
```sql
SELECT i.*, p.name as provider_name,
  CASE 
    WHEN i.name = $search_term THEN 100          -- Exact match
    WHEN i.name ILIKE $search_term || '%' THEN 90 -- Starts with
    WHEN i.name ILIKE '%' || $search_term || '%' THEN 70 -- Contains
    WHEN p.name ILIKE '%' || $search_term || '%' THEN 50  -- Provider match
    ELSE 30                                        -- SVG content match
  END as relevance_score
FROM icon i
JOIN provider p ON i.provider_id = p.id
WHERE i.version = $1 AND (search_conditions)
ORDER BY relevance_score DESC, i.name
```

**Acceptance Criteria**:
- Exact matches appear first
- Prefix matches appear before substring matches
- Provider matches have lower priority than name matches
- Results are consistently ordered

### Phase 2: User Experience Enhancements (Medium Impact, Medium Effort)

#### 5. Provider Filtering
**Priority**: Medium
**Effort**: Low

**API Changes**:
```typescript
// Update schema.ts
export const IconsQuerySchema = z.object({
  skip: z.number().default(0),
  limit: z.number().default(105),
  searchText: z.string().nullish(),
  providers: z.array(z.string()).optional(), // New field
});
```

**Implementation**:
- Add provider filter dropdown to SearchBar component
- Update API to accept `providers` array parameter
- Modify database query to filter by provider IDs

#### 6. Search Suggestions
**Priority**: Medium
**Effort**: Medium

**Description**: Provide autocomplete suggestions based on popular icon names and search history.

**Database Changes**:
```sql
-- New table for search analytics
CREATE TABLE search_analytics (
  id bigserial PRIMARY KEY,
  search_term text NOT NULL,
  result_count integer NOT NULL,
  created_at timestamp DEFAULT now()
);

CREATE INDEX idx_search_analytics_term ON search_analytics(search_term);
```

**Implementation**:
- Create autocomplete API endpoint
- Track search queries in analytics table
- Return top matching icon names and popular searches

#### 7. Result Highlighting
**Priority**: Low
**Effort**: Low

**Description**: Highlight matching search terms in icon names and descriptions.

**Implementation**:
- Add highlighting utility function
- Update IconCard component to highlight matches
- Use CSS classes for highlight styling

### Phase 3: Advanced Features (High Impact, High Effort)

#### 8. Full-text Search with PostgreSQL
**Priority**: Medium
**Effort**: High

**Database Changes**:
```sql
-- Add tsvector columns for full-text search
ALTER TABLE icon ADD COLUMN search_vector tsvector;

-- Update search vector
UPDATE icon SET search_vector = to_tsvector('english', name || ' ' || coalesce(svg, ''));

-- Add GIN index for full-text search
CREATE INDEX idx_icon_search_vector ON icon USING gin(search_vector);

-- Create trigger to maintain search_vector
CREATE OR REPLACE FUNCTION update_icon_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.name || ' ' || coalesce(NEW.svg, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER icon_search_vector_update
  BEFORE INSERT OR UPDATE ON icon
  FOR EACH ROW EXECUTE FUNCTION update_icon_search_vector();
```

#### 9. Fuzzy Search with Trigrams
**Priority**: Medium
**Effort**: Medium

**Implementation**:
```sql
-- Fuzzy search query
SELECT i.*, similarity(i.name, $search_term) as similarity_score
FROM icon i
WHERE similarity(i.name, $search_term) > 0.3
ORDER BY similarity_score DESC;
```

#### 10. Search Analytics Dashboard
**Priority**: Low
**Effort**: Medium

**Features**:
- Track popular search terms
- Monitor search success/failure rates
- Identify missing icons from failed searches
- Export search data for analysis

## API Changes

### Request Schema Updates
```typescript
// src/app/api/icons/schema.ts
export const IconsQuerySchema = z.object({
  skip: z.number().default(0),
  limit: z.number().default(105),
  searchText: z.string().nullish(),
  providers: z.array(z.string()).optional(),
  sortBy: z.enum(['relevance', 'name', 'created_at']).default('relevance'),
  fuzzy: z.boolean().default(false),
});

export type IconsQuery = z.infer<typeof IconsQuerySchema>;
```

### Response Schema Updates
```typescript
export const IconsResponseSchema = z.object({
  icons: z.array(IconSchema),
  total: z.number(),
  searchTime: z.number(), // milliseconds
  suggestions: z.array(z.string()).optional(),
});
```

## Database Migrations

### Migration 1: Search Indexes
```sql
-- 001_add_search_indexes.sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX CONCURRENTLY idx_icon_version_name ON icon(version, name);
CREATE INDEX CONCURRENTLY idx_icon_name_trgm ON icon USING gin(name gin_trgm_ops);
CREATE INDEX CONCURRENTLY idx_provider_name ON provider(name);
```

### Migration 2: Search Analytics
```sql
-- 002_add_search_analytics.sql
CREATE TABLE search_analytics (
  id bigserial PRIMARY KEY,
  search_term text NOT NULL,
  result_count integer NOT NULL,
  response_time_ms integer,
  created_at timestamp DEFAULT now()
);

CREATE INDEX idx_search_analytics_term ON search_analytics(search_term);
CREATE INDEX idx_search_analytics_created_at ON search_analytics(created_at);
```

### Migration 3: Full-text Search
```sql
-- 003_add_fulltext_search.sql
ALTER TABLE icon ADD COLUMN search_vector tsvector;

UPDATE icon SET search_vector = to_tsvector('english', name || ' ' || coalesce(svg, ''));

CREATE INDEX idx_icon_search_vector ON icon USING gin(search_vector);

CREATE OR REPLACE FUNCTION update_icon_search_vector()
RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', NEW.name || ' ' || coalesce(NEW.svg, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER icon_search_vector_update
  BEFORE INSERT OR UPDATE ON icon
  FOR EACH ROW EXECUTE FUNCTION update_icon_search_vector();
```

## Testing Requirements

### Unit Tests
- [ ] Search term parsing function
- [ ] Relevance scoring algorithm
- [ ] Provider filtering logic
- [ ] Search analytics recording

### Integration Tests
- [ ] Multi-word search functionality
- [ ] Provider filtering with search
- [ ] Search performance with large datasets
- [ ] Search analytics API endpoints

### Performance Tests
- [ ] Search response time <100ms for 50k+ icons
- [ ] Concurrent search requests handling
- [ ] Database index effectiveness
- [ ] Memory usage during complex searches

## Implementation Timeline

### Week 1: Core Search (Phase 1)
- [ ] Implement multi-word delimiter search
- [ ] Add database indexes
- [ ] Update API to support new search logic
- [ ] Add basic relevance scoring

### Week 2: Multi-field Search
- [ ] Extend search to provider names and SVG content
- [ ] Implement search result ranking
- [ ] Add search performance monitoring
- [ ] Create unit tests

### Week 3: User Experience (Phase 2)
- [ ] Add provider filtering UI
- [ ] Implement search suggestions
- [ ] Add result highlighting
- [ ] Create search analytics tracking

### Week 4: Advanced Features (Phase 3)
- [ ] Implement full-text search with tsvector
- [ ] Add fuzzy search capabilities
- [ ] Create search analytics dashboard
- [ ] Performance optimization and monitoring

## Success Metrics

### Performance
- Search response time: <100ms (currently 200-500ms)
- Search accuracy: >95% relevant results in top 10
- Zero-result searches: <10% of all searches

### User Experience
- Search usage: 20% increase in search queries
- Search success rate: 90% of searches result in icon selection
- User retention: Improved session duration after search improvements

### Technical
- Database query efficiency: All search queries use indexes
- Error rate: <0.1% search API errors
- Scalability: Support 10k concurrent users without performance degradation

## Deployment Considerations

### Database
- Run migrations during low-traffic periods
- Create indexes concurrently to avoid table locks
- Monitor query performance after index creation
- Set up search analytics data retention policy

### Application
- Feature flag complex search features for gradual rollout
- Cache popular search results to reduce database load
- Monitor search API response times and error rates
- Implement search result caching strategy

### Monitoring
- Set up alerts for search performance degradation
- Track search analytics for product insights
- Monitor database storage growth from new indexes
- Alert on high error rates or slow queries

## Future Enhancements

### Advanced Search Features
- Visual similarity search using SVG analysis
- Boolean search operators (AND, OR, NOT)
- Saved searches and search history
- Search by icon tags and categories

### AI-Powered Features
- Semantic search using embeddings
- Icon recommendation based on search history
- Automatic tagging of icons for better searchability
- Natural language icon descriptions

### Performance Optimizations
- Elasticsearch integration for complex search
- Search result pre-computation for popular queries
- CDN caching for search API responses
- Real-time search index updates