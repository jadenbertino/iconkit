import { Icon } from '@/constants'
import { NextRequest, NextResponse } from 'next/server'
import { GetResponse } from './schema'
import { allIcons } from './tmp'

async function GET(_req: NextRequest): Promise<NextResponse<GetResponse>> {
  return NextResponse.json({
    icons: allIcons as Icon[],
  })
}

export default GET
