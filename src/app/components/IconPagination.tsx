import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { useIconQueries } from '@/lib/queries/icons'
import { useSearch } from '../context/SearchContext'

function IconPagination({ hasMore }: { hasMore: boolean }) {
  const { search, nextPage, prevPage } = useSearch()
  const { prefetchNextPage } = useIconQueries()

  const isPrevDisabled = search.page <= 1
  const isNextDisabled = !hasMore

  return (
    <Pagination className='mt-6'>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={(e) => {
              e.preventDefault()
              if (!isPrevDisabled) {
                prevPage()
              }
            }}
            disabled={isPrevDisabled}
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
              if (!isNextDisabled) {
                nextPage()
              }
            }}
            onMouseEnter={!isNextDisabled ? prefetchNextPage : undefined}
            disabled={isNextDisabled}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default IconPagination
