import { DELIMITERS, MAX_SEARCH_TERMS } from '@/constants/query'
import { CLIENT_ENV } from '@/env/client'
import { supabase } from '@/lib/clients/client'
import type { Pagination } from '@/lib/schemas'
import { z } from 'zod'
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
  if (!searchText?.trim()) {
    return getAllIcons({ skip, limit })
  }
  const terms = parseSearchTerms(searchText)

  // Do AND query for exact matches first
  const andResults = await searchIconsByAnd({
    searchText,
    skip,
    limit,
  })

  // If we need more results, do OR query excluding AND results
  let allResults = andResults
  if (andResults.length < limit) {
    // Update search params
    const excludeIds = andResults.map((icon) => icon.id)
    const remainingLimit = limit - andResults.length
    const remainingSkip = Math.max(0, skip - andResults.length)

    // Get additional OR results excluding already found icons
    const orResults = await searchIconsByOr({
      searchText,
      excludeIds,
      skip: remainingSkip,
      limit: remainingLimit,
    })

    // Combine results (AND results first, then OR results)
    allResults = [...andResults, ...orResults]
  }

  // Apply relevance scoring and sort
  const sortedResults = sortByRelevance(allResults, terms, scoringStrategy)
  return sortedResults
}

async function getAllIcons({ skip, limit }: Pagination) {
  const { data } = await baseQuery()
    .range(skip, skip + limit - 1)
    .order('name')
    .throwOnError()
  return data
}

async function searchIconsByAnd({ searchText, skip, limit }: SearchParams) {
  const terms = parseSearchTerms(searchText)
  let andQuery = baseQuery()

  // For AND logic, each term must match either name OR tags
  terms.forEach((term) => {
    andQuery = andQuery.or(`name.ilike.%${term}%,tags.ov.{${term}}`)
  })

  const { data: andResults } = await andQuery
    .range(skip, skip + limit - 1)
    .order('name')
    .throwOnError()

  return andResults
}

async function searchIconsByOr({
  searchText,
  excludeIds,
  skip,
  limit,
}: SearchParams & { excludeIds: number[] }) {
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
