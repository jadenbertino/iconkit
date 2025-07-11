import { useState } from 'react'
import { useDebounceCallback } from 'usehooks-ts'
import { useSearch } from '../context/SearchContext'

export function SearchBar() {
  const { setSearch, search } = useSearch()
  const [searchText, setSearchText] = useState(search.text)

  // Debounce the search update function
  const debouncedSetSearch = useDebounceCallback((text: string) => {
    setSearch((prev) => ({ ...prev, text, page: 1 }))
  }, 500)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchText(value) // Update input immediately
    debouncedSetSearch(value) // Debounce the search context update
  }

  return (
    <div className='flex items-center gap-2'>
      <input
        type='text'
        placeholder='Search icons...'
        value={searchText}
        onChange={handleInputChange}
        className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
      />
    </div>
  )
}
