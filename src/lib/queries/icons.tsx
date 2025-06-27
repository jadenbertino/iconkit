import type { IconQuery } from '@/app/api/icons/client'
import { getIcons } from '@/app/api/icons/client'
import {
  queryOptions as createQueryOptions,
  useQuery,
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
  const useIconsQuery = (q: IconQuery) => {
    const options = QUERY_OPTIONS.iconsQuery(q)
    return useQuery(options)
  }

  return { useIconsQuery }
}

export { useIconQueries }
