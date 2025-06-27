'use client'

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import type { ReactNode } from 'react'

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
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export { Providers }
