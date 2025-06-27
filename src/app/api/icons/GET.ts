import { handleErrors } from '@/lib/error'
import type { Icon } from '@/lib/schemas/database'
import { NextRequest, NextResponse } from 'next/server'
import type { GetResponse } from './schema'
import { allIcons } from './tmp'

const GET = handleErrors(
  async (_req: NextRequest): Promise<NextResponse<GetResponse>> => {
    return NextResponse.json({
      icons: allIcons as Icon[],
    })
  },
)

export default GET
