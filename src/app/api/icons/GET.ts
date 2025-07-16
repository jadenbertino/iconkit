import { validateQueryParams } from '@/lib/api'
import { supabase } from '@/lib/clients/client'
import { handleErrors } from '@/lib/error'
import { SERVER_ENV } from '@/env/server'
import { NextRequest, NextResponse } from 'next/server'
import { GetRequestSchema, type GetResponse } from './schema'

function parseSearchTerms(searchText: string): string[] {
  return searchText
    .split(/[\s\-_]+/)
    .filter((term) => term.length > 0)
    .slice(0, 10) // Limit to 10 terms max
}

const GET = handleErrors(
  async (req: NextRequest): Promise<NextResponse<GetResponse>> => {
    const { skip, limit, searchText } = validateQueryParams(
      req,
      GetRequestSchema,
    )
    const icons = await getIcons({ skip, limit, searchText: searchText ?? '' })
    return NextResponse.json({
      icons,
    })
  },
)

async function getIcons({
  skip,
  limit,
  searchText,
}: {
  skip: number
  limit: number
  searchText: string
}) {
  if (!searchText.trim()) {
    // If no search text, return all icons
    const { data } = await supabase
      .from('icon')
      .select('*')
      .eq('version', SERVER_ENV.VERSION)
      .range(skip, skip + limit - 1)
      .order('name')
      .throwOnError()

    return data
  }

  // Parse search terms and build multi-word search
  const terms = parseSearchTerms(searchText)

  if (terms.length === 0) {
    // If no valid terms after parsing, return all icons
    const { data } = await supabase
      .from('icon')
      .select('*')
      .eq('version', SERVER_ENV.VERSION)
      .range(skip, skip + limit - 1)
      .order('name')
      .throwOnError()

    return data
  }

  // First try AND logic for exact matches
  let andQuery = supabase
    .from('icon')
    .select('*')
    .eq('version', SERVER_ENV.VERSION)

  // Apply each term as an AND condition
  terms.forEach((term) => {
    andQuery = andQuery.ilike('name', `%${term}%`)
  })

  const { data: andResults } = await andQuery
    .range(skip, skip + limit - 1)
    .order('name')
    .throwOnError()

  // If we have enough results from AND query, return them
  if (andResults.length >= limit) {
    return andResults
  }

  // If we need more results, do OR query excluding AND results
  const foundIds = andResults.map((icon) => icon.id)
  const remainingLimit = limit - andResults.length
  const remainingSkip = Math.max(0, skip - andResults.length)

  // Build OR query with individual terms, excluding already found icons
  let orQuery = supabase
    .from('icon')
    .select('*')
    .eq('version', SERVER_ENV.VERSION)

  if (foundIds.length > 0) {
    orQuery = orQuery.not('id', 'in', `(${foundIds.join(',')})`)
  }

  // Create OR conditions for individual terms
  if (terms.length > 1) {
    const orConditions = terms.map((term) => `name.ilike.%${term}%`).join(',')
    orQuery = orQuery.or(orConditions)
  } else {
    // Single term fallback (shouldn't happen but just in case)
    orQuery = orQuery.ilike('name', `%${terms[0]}%`)
  }

  const { data: orResults } = await orQuery
    .range(remainingSkip, remainingSkip + remainingLimit - 1)
    .order('name')
    .throwOnError()

  // Combine results (AND results first, then OR results)
  return [...andResults, ...orResults]
}

export default GET
export { getIcons }
