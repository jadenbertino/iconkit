import { CLIENT_ENV } from '@/env/client'
import { supabase } from '@/lib/clients/client'
import { z } from 'zod'
import { GetRequestSchema } from './schema'

type IconQuery = z.infer<typeof GetRequestSchema>

type SearchParams = {
  skip: number
  limit: number
  searchText: string | null
}

async function getIcons({ skip, limit, searchText }: SearchParams) {
  // Validate that we have search terms
  const terms = parseSearchTerms(searchText?.trim() ?? '')
  if (terms.length === 0) {
    return getAllIcons({ skip, limit })
  }

  // Do AND query for exact matches first
  const andResults = await searchIconsByAnd({ terms, skip, limit })
  if (andResults.length >= limit) {
    return andResults
  }

  // If we need more results, do OR query excluding AND results
  const excludeIds = andResults.map((icon) => icon.id)
  const remainingLimit = limit - andResults.length
  const remainingSkip = Math.max(0, skip - andResults.length)

  // Get additional OR results excluding already found icons
  const orResults = await searchIconsByOr({ 
    terms, 
    excludeIds, 
    skip: remainingSkip, 
    limit: remainingLimit 
  })

  // Combine results (AND results first, then OR results)
  return [...andResults, ...orResults]
}

async function getAllIcons({ skip, limit }: Omit<SearchParams, 'searchText'>) {
  const { data } = await baseQuery()
    .range(skip, skip + limit - 1)
    .order('name')
    .throwOnError()
  return data
}

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

function parseSearchTerms(searchText: string): string[] {
  return searchText
    .split(/[\s\-_]+/)
    .filter((term) => term.length > 0)
    .slice(0, 10) // Limit to 10 terms max
}

const baseQuery = () =>
  supabase.from('icon').select('*').eq('version', CLIENT_ENV.VERSION)

export { getIcons }
export type { IconQuery }
