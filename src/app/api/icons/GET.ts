import { Icon } from '@/constants'
import { handleErrors } from '@/lib/error'
import { NextRequest, NextResponse } from 'next/server'
import { GetResponse } from './schema'
import { allIcons } from './tmp'

const GET = handleErrors(
  async (_req: NextRequest): Promise<NextResponse<GetResponse>> => {
    return NextResponse.json({
      icons: allIcons as Icon[],
    })
  },
)

export default GET
