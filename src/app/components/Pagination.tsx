import { Button } from '@/components/ui/button'
import { useSearch } from '../context/SearchContext'

export function Pagination() {
  const { search, nextPage, prevPage } = useSearch()

  return (
    <div className='relative flex items-center justify-between w-full mt-6'>
      {search.page > 1 && <Button onClick={prevPage}>Previous</Button>}
      <span className='absolute left-1/2 transform -translate-x-1/2 py-2 px-4 text-gray-600'>
        Page {search.page}
      </span>
      <Button
        onClick={nextPage}
        className='ml-auto'
      >
        Next
      </Button>
    </div>
  )
}
