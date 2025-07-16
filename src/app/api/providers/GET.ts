import { supabase } from '@/lib/clients/client'
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
  const { data } = await supabase
    .from('provider')
    .select('*')
    .order('name')
    .throwOnError()

  return data
}

export default GET
export { getProviders }
