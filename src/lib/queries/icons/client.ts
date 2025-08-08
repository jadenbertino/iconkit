import { PAGE_SIZE } from '@/constants'
import { DELIMITERS, MAX_SEARCH_TERMS } from '@/constants/query'
import { CLIENT_ENV } from '@/env/client'
import { supabase } from '@/lib/clients/client'
import { clientLogger } from '@/lib/logs/client'
import type { Pagination } from '@/lib/schemas'
import { z } from 'zod'
import DEFAULT_ICONS from './default'
import { sortByRelevance, type WeightPreset } from './relevance'
import { GetRequestSchema } from './schema'

type IconQuery = z.infer<typeof GetRequestSchema>

type SearchParams = Pagination & {
  searchText: string | null
  scoringStrategy?: WeightPreset
}

async function getIcons({
  scoringStrategy = 'fuzzy',
  ...searchParams
}: SearchParams) {
  const { skip, limit, searchText } = GetRequestSchema.parse(searchParams)

  // Handle no search text
  if (!searchText?.trim()) {
    const isFirstPage = skip === 0 && limit === PAGE_SIZE
    if (isFirstPage) {
      return DEFAULT_ICONS
    }
    const { data: icons } = await baseQuery()
      .range(skip, skip + limit - 1)
      .order('name')
      .throwOnError()
    return icons
  }
  const terms = parseSearchTerms(searchText)

  // Fetch icons
  clientLogger.debug('Fetching icons', searchParams)
  const orResults = await searchIconsByOr({
    searchText,
    skip,
    limit,
  })

  // Sort results (DB query already applies pagination via range)
  const sortedResults = sortByRelevance(orResults, terms, scoringStrategy)
  return sortedResults
}

async function searchIconsByOr({
  searchText,
  excludeIds = [],
  skip,
  limit,
}: SearchParams & { excludeIds?: number[] }) {
  const terms = parseSearchTerms(searchText)
  let orQuery = baseQuery()

  // Exclude already found icons
  if (excludeIds.length > 0) {
    orQuery = orQuery.not('id', 'in', `(${excludeIds.join(',')})`)
  }

  // Create OR conditions for individual terms (search both name and tags)
  const allConditions: string[] = []
  terms.forEach((term) => {
    allConditions.push(`name.ilike.%${term}%`)
    allConditions.push(`tags.ov.{${term}}`)
  })
  orQuery = orQuery.or(allConditions.join(','))

  const { data: orResults } = await orQuery
    .range(skip, skip + limit - 1)
    .order('name')
    .throwOnError()
  return orResults
}

function parseSearchTerms(searchText: string | null): string[] {
  if (!searchText) return []
  return searchText
    .trim()
    .split(DELIMITERS)
    .filter((term) => term.length > 0)
    .slice(0, MAX_SEARCH_TERMS) // Use constant for consistency
}

const baseQuery = () =>
  supabase.from('icon').select('*').eq('build_id', CLIENT_ENV.BUILD_ID)

export { getIcons }
export type { IconQuery }
