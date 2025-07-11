import type { IconQuery } from '@/app/api/icons/client'
import { getIcons } from '@/app/api/icons/client'
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

  const useIconsQuery = (q: IconQuery) => {
    const options = QUERY_OPTIONS.iconsQuery(q)
    return useQuery(options)
  }

  const prefetchNextPage = (currentQuery: IconQuery, pageSize: number) => {
    const nextPageQuery: IconQuery = {
      ...currentQuery,
      skip: currentQuery.skip + pageSize,
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
