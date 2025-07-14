import { supabaseAdmin } from '@/lib/clients/server'
import { handleErrors } from '@/lib/error'
import { NextRequest, NextResponse } from 'next/server'
import { type GetResponse } from './schema'

const GET = handleErrors(
  async (_req: NextRequest): Promise<NextResponse<GetResponse>> => {
    const providers = await getProviders()
    return NextResponse.json({
      providers,
    })
  },
)

async function getProviders() {
  const { data, error } = await supabaseAdmin
    .from('provider')
    .select('*')
    .order('name')

  if (error) {
    throw error
  }

  return data
}

export default GET
export { getProviders }
