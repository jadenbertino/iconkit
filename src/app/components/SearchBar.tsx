import { useState } from 'react'
import { useSearch } from '../context/SearchContext'

export function SearchBar() {
  const [searchText, setSearchText] = useState('')
  const { setSearch } = useSearch()

  const handleSearch = () => {
    setSearch({ text: searchText })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
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
  )
}
