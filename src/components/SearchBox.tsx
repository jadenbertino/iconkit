'use client'

import { Button } from '@/components/ui/button'
import { PAGE_SIZE } from '@/constants'
import { useSearch } from '@/context/SearchContext'
import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { useIconQueries } from '@/lib/queries/icons'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { useWindowSize } from 'usehooks-ts'
import { MagnifyingGlassHero } from './icons'

export function SearchBox() {
  const router = useRouter()
  const { prefetchPage, useIconsQuery } = useIconQueries()
  const { search } = useSearch()
  const { width = 0 } = useWindowSize()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)

  const isMobile = width < 640 // sm breakpoint

  // Prefetch icons for performance
  useIconsQuery({
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

  const handlePrefetch = useCallback(() => {
    if (searchText.trim().length) {
      prefetchPage(1, searchText.trim())
    }
  }, [searchText, prefetchPage])

  const handleBlur = useCallback(() => {
    setIsFocused(false)
    // Force re-render of TypeAnimation with new key to start from random position
    setAnimationKey((prev) => prev + 1)
  }, [])

  const getRandomizedSequence = useCallback(() => {
    const randomStartIndex = Math.floor(
      Math.random() * exampleSearchTerms.length,
    )
    const reorderedTerms = [
      ...exampleSearchTerms.slice(randomStartIndex),
      ...exampleSearchTerms.slice(0, randomStartIndex),
    ]
    return reorderedTerms.flatMap((term) => [term, TYPING_DELAY_MS])
  }, [])

  return (
    <div className='max-w-2xl mx-auto mb-8'>
      <form
        onSubmit={onSubmit}
        className='flex items-center gap-3 p-2 rounded-full border-2 border-default focus-within:border-focus shadow-lg text-body bg-surface'
      >
        <div className='flex-1 relative'>
          <input
            ref={inputRef}
            type='text'
            placeholder={
              searchText
                ? 'Search for icons...'
                : isFocused && isMobile
                  ? ''
                  : isFocused
                    ? 'Search for icons...'
                    : ''
            }
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            className='w-full h-10 pl-4 pr-2 bg-transparent rounded-full focus:outline-none text-neutral-high'
          />
          {!searchText && !isFocused && (
            <div className='absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-lowest'>
              <TypeAnimation
                key={animationKey}
                sequence={getRandomizedSequence()}
                wrapper='span'
                speed={50}
                repeat={Infinity}
                cursor={true}
              />
            </div>
          )}
        </div>
        <Button
          type='submit'
          onMouseEnter={handlePrefetch}
          className='h-10 px-4 sm:px-6 rounded-full bg-inverse hover:bg-slate-800 flex items-center flex-shrink-0 text-small'
        >
          <MagnifyingGlassHero className='size-5' />
          <span className='-mt-0.5'>
            search <span className='hidden sm:inline '>icons</span>
          </span>
        </Button>
      </form>
    </div>
  )
}

const exampleSearchTerms = [
  'user',
  'arrow',
  'heart',
  'home',
  'search',
  'settings',
  'bell',
  'star',
  'lock',
  'play',
  'download',
  'share',
  'email',
  'phone',
  'camera',
  'calendar',
  'clock',
  'edit',
  'trash',
  'check',
  'close',
  'menu',
  'plus',
  'minus',
  'eye',
  'location',
  'map',
  'bookmark',
  'folder',
  'file',
  'image',
  'video',
  'music',
  'mic',
  'speaker',
  'wifi',
  'battery',
  'shopping',
  'cart',
  'credit card',
  'money',
  'notification',
  'message',
  'chat',
  'cloud',
  'upload',
  'refresh',
  'filter',
  'sort',
  'grid',
]

const TYPING_DELAY_MS = 2000
