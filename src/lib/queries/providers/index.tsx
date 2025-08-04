import { getProviders } from '@/lib/queries/providers/client'
import {
  queryOptions as createQueryOptions,
  useQuery,
} from '@tanstack/react-query'

const QUERY_KEYS = {
  all: ['providers'] as const,
  providers: () => [...QUERY_KEYS.all, 'providers'],
}

const QUERY_OPTIONS = {
  providers: () =>
    createQueryOptions({
      queryKey: QUERY_KEYS.providers(),
      queryFn: () => getProviders(),
      staleTime: Infinity,
    }),
}

const useProviders = () => {
  const options = QUERY_OPTIONS.providers()
  return useQuery(options)
}

export { useProviders }
