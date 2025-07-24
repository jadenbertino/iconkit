-- Enable pg_trgm extension for trigram matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index directly on the tags array for efficient searching
CREATE INDEX IF NOT EXISTS idx_icon_tags_gin 
ON icon USING gin(tags);

-- RPC function for AND search logic
-- All search terms must match either icon name or tags (using partial matching)
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
BEGIN
  RETURN QUERY
  SELECT i.id, i.created_at, i.version, i.name, i.svg, i.source_url, i.provider_id, i.jsx, i.tags
  FROM icon i
  WHERE i.version = version_filter
  AND (
    -- For each term, check if it matches name OR any tag (using array_to_string for partial matching)
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

-- RPC function for OR search logic  
-- Any search term can match either icon name or tags (using partial matching)
-- Excludes icons with IDs in the exclude_ids array
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