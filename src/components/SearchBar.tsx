import { useDebouncedSearch } from '@/hooks/useDebouncedSearch'
import { MagnifyingGlassHero } from './icons/MagnifyingGlass'

export function SearchBar() {
  const { searchText, setSearchText, onSubmit } = useDebouncedSearch(300)

  return (
    <form
      onSubmit={onSubmit}
      className='flex items-center gap-2 relative'
    >
      <div className='absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none w-10 h-full flex items-center justify-center'>
        <MagnifyingGlassHero className='size-6 text-gray-500' />
      </div>
      <input
        type='text'
        placeholder='Search icons...'
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className='flex-1 pr-4 pl-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black-500 focus:border-transparent'
      />
    </form>
  )
}
