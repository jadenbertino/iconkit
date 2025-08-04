import { getLicenses } from '@/lib/queries/licenses/client'
import {
  queryOptions as createQueryOptions,
  useQuery,
} from '@tanstack/react-query'

const QUERY_KEYS = {
  all: ['licenses'] as const,
}

const QUERY_OPTIONS = {
  licenses: () =>
    createQueryOptions({
      queryKey: QUERY_KEYS.all,
      queryFn: () => getLicenses(),
      staleTime: Infinity,
    }),
}

const useLicenses = () => {
  const options = QUERY_OPTIONS.licenses()
  return useQuery(options)
}

export { useLicenses }
