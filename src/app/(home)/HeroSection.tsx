'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PAGE_SIZE } from '@/constants'
import { ICON_LIBRARY_COUNT } from '@/constants/provider'
import { useSearch } from '@/context/SearchContext'
import { CLIENT_ENV } from '@/env/client'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { useIconQueries } from '@/lib/queries/icons'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useRef } from 'react'

const HeroSection = () => {
  const router = useRouter()
  const { prefetchPage, useIconsQuery } = useIconQueries()
  const inputRef = useRef<HTMLInputElement>(null)
  const { search } = useSearch()
  useIconsQuery({
    // functions as prefetching
    skip: 0,
    limit: PAGE_SIZE,
    searchText: search.text,
  })

  const handleSearch = useCallback(() => {
    router.push('/search')
  }, [router])

  const { searchText, setSearchText, onSubmit } = useDebouncedSearch(
    300,
    handleSearch,
  )

  const prefetchSearch = useCallback(() => {
    if (searchText.trim().length) {
      prefetchPage(1, searchText.trim())
    }
  }, [searchText, prefetchPage])

  return (
    <section className='container mx-auto px-4 pt-24 pb-16 text-center'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-4xl md:text-6xl font-bold text-slate-900 mb-8'>
          Your favorite icons,
          <br />
          all in one place.
        </h1>

        <div className='max-w-2xl mx-auto mb-8'>
          <div className='flex flex-wrap justify-center gap-4'>
            <Badge
              variant='outline'
              className='text-lg px-4 py-2 bg-slate-100'
            >
              {CLIENT_ENV.ICON_COUNT.toLocaleString()}+ icons
            </Badge>
            <Badge
              variant='outline'
              className='text-lg px-4 py-2 bg-slate-100'
            >
              {ICON_LIBRARY_COUNT}+ libraries
            </Badge>
            <Badge
              variant='outline'
              className='text-lg px-4 py-2 bg-slate-100'
            >
              1 search bar
            </Badge>
          </div>
        </div>

        <div className='max-w-2xl mx-auto mb-8'>
          <form
            onSubmit={onSubmit}
            className='relative'
          >
            <input
              ref={inputRef}
              type='text'
              placeholder='search icons...'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className='w-full h-14 text-lg pl-6 pr-32 rounded-full border-2 border-slate-200 focus:border-slate-400 shadow-lg focus:outline-none'
            />
            <Button
              type='submit'
              onMouseEnter={prefetchSearch}
              className='absolute right-2 top-2 h-10 px-6 rounded-full bg-slate-900 hover:bg-slate-800 flex items-center'
            >
              <Search className='h-4 w-4 mr-2' />
              <span className='-mt-0.5'>search</span>
            </Button>
          </form>
        </div>

        <p className='text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed'>
          Find any icon from Hero Icons, Lucide, Font Awesome, Simple Icons, and
          8 more libraries—all in one search.
        </p>
      </div>
    </section>
  )
}

export { HeroSection }
