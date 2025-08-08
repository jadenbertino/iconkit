'use client'

import { CLIENT_ENV } from '@/env/client'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import posthog from 'posthog-js'
import { PostHogProvider as PostHogProviderBase } from 'posthog-js/react'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
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
        <PostHogProvider>{children}</PostHogProvider>
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

const PostHogProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    /*
    You can disable on local development like this
    
    const host = window.location.host
    const isLocal = host.includes('127.0.0.1') || host.includes('localhost')
    if (isLocal) {
      return null
    }
    */
    posthog.init(CLIENT_ENV.POSTHOG_KEY, {
      api_host: CLIENT_ENV.POSTHOG_HOST,
      debug: false,
    })
  }, [])

  return <PostHogProviderBase client={posthog}>{children}</PostHogProviderBase>
}

export { Providers }
