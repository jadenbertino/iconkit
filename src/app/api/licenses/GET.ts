import { supabase } from '@/lib/clients/client'
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
  const { data } = await supabase
    .from('license')
    .select('*')
    .throwOnError()

  return data
}

export default GET
export { getLicenses }
