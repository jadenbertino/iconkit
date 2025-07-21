'use client'

import { Button } from '@/components/ui/button'
import { ICON_LIBRARY_COUNT } from '@/constants/provider'
import { useSearch } from '@/context/SearchContext'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { useIconQueries } from '@/lib/queries/icons'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

const HeroSection = () => {
  const router = useRouter()
  const { setSearch } = useSearch()
  const { searchText, setSearchText } = useDebouncedSearch(300)
  const { prefetchPage } = useIconQueries()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    if (!searchText.trim().length) {
      inputRef.current?.focus()
      return
    }
    setSearch((prev) => ({ ...prev, text: searchText.trim(), page: 1 }))
    router.push('/search')
  }

  const handleButtonHover = () => {
    if (searchText.trim().length) {
      prefetchPage(1, searchText.trim())
    }
  }

  return (
    <div className='space-y-8 py-16'>
      <div className='space-y-4'>
        <div className='space-y-2'>
          <div className='text-3xl font-semibold text-foreground'>
            40,000+ icons
          </div>
          <div className='text-3xl font-semibold text-foreground'>
            {ICON_LIBRARY_COUNT}+ libraries
          </div>
          <div className='text-3xl font-semibold text-foreground'>
            1 search bar
          </div>
        </div>
      </div>

      <div className='max-w-lg flex gap-2'>
        <input
          ref={inputRef}
          type='text'
          placeholder='search icons...'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className='flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent'
        />
        <Button
          onClick={handleSearch}
          onMouseEnter={handleButtonHover}
          className='px-6 h-auto'
        >
          search
        </Button>
      </div>

      <p className='text-lg text-muted-foreground max-w-2xl'>
        Find any icon from Hero Icons, Lucide, Font Awesome, Simple Icons, and 8
        more libraries—all in one search.
      </p>
    </div>
  )
}

export { HeroSection }
