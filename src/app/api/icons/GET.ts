import { Icon } from '@/constants'
import { NextResponse } from 'next/server'
import { GetResponse } from './schema'
import { allIcons } from './tmp'

async function GET(): Promise<NextResponse<GetResponse>> {
  return NextResponse.json({
    icons: allIcons as Icon[],
  })
}

export default GET
