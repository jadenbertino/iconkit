import { Icon } from '@/constants'
import { NextRequest, NextResponse } from 'next/server'
import icons from '../../../../icons/boxicons.json'
import { GetResponse } from './schema'

async function GET(_req: NextRequest): Promise<NextResponse<GetResponse>> {
  return NextResponse.json({
    icons: icons as Icon[],
  })
}

export default GET
