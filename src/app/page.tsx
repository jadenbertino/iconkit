'use client'

import { CLIENT_ENV } from '@/env/client'
import type { Icon } from '@/lib/schemas/database'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { getIcons } from './api/icons/client'
import { SvgThumnail } from './components/SvgThumbnail'

export default function Home() {
  const [icons, setIcons] = useState<Icon[]>([])

  useEffect(() => {
    console.debug({ env: CLIENT_ENV.ENVIRONMENT })
    getIcons().then(setIcons)
  }, [])

  return (
    <Container>
      <div className='flex flex-wrap gap-2'>
        {icons.map((icon) => (
          <a
            href={icon.source_url}
            target='_blank'
            rel='noopener noreferrer'
            key={icon.id}
          >
            <SvgThumnail icon={icon} />
          </a>
        ))}
      </div>
    </Container>
  )
}

const Container = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='max-w-[1200px]'>{children}</div>
    </div>
  )
}
