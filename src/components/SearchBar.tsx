import { useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useSearch } from '../context/SearchContext'
import { MagnifyingGlassHero } from './icons/MagnifyingGlass'

export function SearchBar() {
  const { setSearch, search } = useSearch()
  const [searchText, setSearchText] = useState(search.text)

  // Debounce the search update function
  const debouncedSetSearch = useDebounceCallback((text: string) => {
    setSearch((prev) => ({ ...prev, text, page: 1 }))
  }, 300)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchText(value) // Update input immediately
    debouncedSetSearch(value) // Debounce the search context update
  }

  return (
    <div className='flex items-center gap-2 relative'>
      <div className='absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none w-10 h-full flex items-center justify-center'>
        <MagnifyingGlassHero className='size-6 text-gray-500' />
      </div>
      <input
        type='text'
        placeholder='Search icons...'
        value={searchText}
        onChange={handleInputChange}
        className='flex-1 pr-4 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent'
      />
    </div>
  )
}
