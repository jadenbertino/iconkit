'use client'

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'
import { SearchProvider } from '../context/SearchContext'

// query client with default error handling
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    // onError: (error) => {
    // captureException(error)
    // },
  }),
  mutationCache: new MutationCache({
    // onError: (error) => {
    // captureException(error)
    // },
  }),
})

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </SearchProvider>
    </QueryClientProvider>
  )
}

export { Providers }
