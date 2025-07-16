import { supabaseAdmin } from '@/lib/clients/server'
import { handleErrors } from '@/lib/error'
import { NextRequest, NextResponse } from 'next/server'
import { type GetResponse } from './schema'

const GET = handleErrors(
  async (_req: NextRequest): Promise<NextResponse<GetResponse>> => {
    const licenses = await getLicenses()
    return NextResponse.json({
      licenses,
    })
  },
)

async function getLicenses() {
  const { data } = await supabaseAdmin
    .from('license')
    .select('*')
    .throwOnError()

  return data
}

export default GET
export { getLicenses }
