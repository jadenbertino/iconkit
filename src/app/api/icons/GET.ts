import { getRequestBody } from '@/lib/api'
import { supabaseAdmin } from '@/lib/clients/server'
import { handleErrors } from '@/lib/error'
import { NextRequest, NextResponse } from 'next/server'
import { GetRequestSchema, type GetResponse } from './schema'

const GET = handleErrors(
  async (req: NextRequest): Promise<NextResponse<GetResponse>> => {
    const { skip, limit, searchText } = await getRequestBody(
      req,
      GetRequestSchema,
    )
    const icons = await getIcons({ skip, limit, searchText })
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
  const { data, error } = await supabaseAdmin
    .from('icon')
    .select('*')
    .ilike('name', `%${searchText}%`)
    .range(skip, skip + limit - 1)
    .order('name')

  if (error) {
    throw error
  }

  return data
}

export default GET
export { getIcons }
