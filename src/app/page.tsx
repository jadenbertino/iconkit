'use client'

import { useIconQueries } from '@/lib/queries/icons'
import { useState } from 'react'
import { Container, Row } from './components/Layout'
import { SvgThumnail } from './components/SvgThumbnail'

export default function Home() {
  const [searchText, setSearchText] = useState('')
  const [querySearchText, setQuerySearchText] = useState('')

  const { getIconsQuery } = useIconQueries()
  const {
    data: icons,
    isLoading,
    error,
  } = getIconsQuery({
    skip: 0,
    limit: 100,
    searchText: querySearchText,
  })

  const handleSearch = () => {
    setQuerySearchText(searchText)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  if (isLoading) return <Container>Loading...</Container>
  if (error) return <Container>Error loading icons</Container>

  return (
    <Container>
      <div className='w-full space-y-6'>
        <Row className='pt-8'>
          <div className='flex items-center gap-2'>
            <input
              type='text'
              placeholder='Search icons...'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyPress}
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <button
              onClick={handleSearch}
              className='px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Search
            </button>
          </div>
        </Row>
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
      </div>
    </Container>
  )
}
