import { useSearch } from '../context/SearchContext'

export function Pagination() {
  const { search, nextPage, prevPage } = useSearch()

  return (
    <div className='relative flex items-center justify-between w-full mt-6'>
      {search.page > 1 && (
        <button
          onClick={prevPage}
          className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200'
        >
          Previous
        </button>
      )}
      <span className='absolute left-1/2 transform -translate-x-1/2 px-4 py-2 text-gray-600'>
        Page {search.page}
      </span>
      <button
        onClick={nextPage}
        className='ml-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200'
      >
        Next
      </button>
    </div>
  )
}
