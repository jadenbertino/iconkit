import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useSearch } from '../context/SearchContext'

function IconPagination() {
  const { search, nextPage, prevPage } = useSearch()

  return (
    <Pagination className='mt-6'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={(e) => {
              e.preventDefault()
              prevPage()
            }}
            className={search.page <= 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
        <PaginationItem>
          <span className='py-2 px-4 text-gray-600'>Page {search.page}</span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href='#'
            onClick={(e) => {
              e.preventDefault()
              nextPage()
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default IconPagination
