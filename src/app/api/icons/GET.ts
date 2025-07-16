import { validateQueryParams } from '@/lib/api'
import { supabaseAdmin } from '@/lib/clients/server'
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
    const { data, error } = await supabaseAdmin
      .from('icon')
      .select('*')
      .eq('version', SERVER_ENV.VERSION)
      .range(skip, skip + limit - 1)
      .order('name')

    if (error) {
      throw error
    }

    return data
  }

  // Parse search terms and build multi-word search
  const terms = parseSearchTerms(searchText)

  if (terms.length === 0) {
    // If no valid terms after parsing, return all icons
    const { data, error } = await supabaseAdmin
      .from('icon')
      .select('*')
      .eq('version', SERVER_ENV.VERSION)
      .range(skip, skip + limit - 1)
      .order('name')

    if (error) {
      throw error
    }

    return data
  }

  // Build query with AND logic for all terms
  let query = supabaseAdmin
    .from('icon')
    .select('*')
    .eq('version', SERVER_ENV.VERSION)

  // Apply each term as an AND condition
  terms.forEach((term) => {
    query = query.ilike('name', `%${term}%`)
  })

  const { data, error } = await query
    .range(skip, skip + limit - 1)
    .order('name')

  if (error) {
    throw error
  }

  return data
}

export default GET
export { getIcons }
