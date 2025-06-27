'use client'

import { useIconQueries } from '@/lib/queries/icons'
import type { ReactNode } from 'react'
import { SvgThumnail } from './components/SvgThumbnail'

export default function Home() {
  const { getIconsQuery } = useIconQueries()
  const {
    data: icons,
    isLoading,
    error,
  } = getIconsQuery({
    skip: 0,
    limit: 50,
    searchText: '',
  })

  if (isLoading) return <Container>Loading...</Container>
  if (error) return <Container>Error loading icons</Container>

  return (
    <Container>
      <div className='flex flex-wrap gap-2'>
        {icons?.map((icon) => (
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
