'use client'

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { ReactNode } from 'react'
import { Toaster } from 'sonner' // https://github.com/emilkowalski/sonner
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
        <Toaster
          theme='light'
          position='bottom-right'
          toastOptions={{
            style: {
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-neutral-high)',
            },
          }}
        />
      </SearchProvider>
    </QueryClientProvider>
  )
}

export { Providers }
