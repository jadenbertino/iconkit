import type { IconQuery } from '@/app/api/icons/client'
import { getIcons } from '@/app/api/icons/client'
import { PAGE_SIZE } from '@/constants'
import { useSearch } from '@/context/SearchContext'
import {
  queryOptions as createQueryOptions,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

const QUERY_KEYS = {
  all: ['icons'] as const,
  icons: () => [...QUERY_KEYS.all, 'icons'],
  iconsQuery: (q: IconQuery) => [...QUERY_KEYS.icons(), q],
}

const QUERY_OPTIONS = {
  iconsQuery: (q: IconQuery) =>
    createQueryOptions({
      queryKey: QUERY_KEYS.iconsQuery(q),
      queryFn: () => getIcons(q),
      staleTime: Infinity,
      placeholderData: (previousData) => previousData,
    }),
}

const useIconQueries = () => {
  const queryClient = useQueryClient()
  const { search } = useSearch()

  const useIconsQuery = (q: IconQuery) => {
    const options = QUERY_OPTIONS.iconsQuery(q)
    return useQuery(options)
  }

  const prefetchNextPage = () => {
    const nextPageQuery: IconQuery = {
      skip: search.page * PAGE_SIZE,
      limit: PAGE_SIZE,
      searchText: search.text,
    }

    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.iconsQuery(nextPageQuery),
      queryFn: () => getIcons(nextPageQuery),
      staleTime: Infinity,
    })
  }

  return { useIconsQuery, prefetchNextPage }
}

export { useIconQueries }
