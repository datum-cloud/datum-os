import { cache } from 'react'

import { QueryClient } from '@tanstack/react-query'

import { IS_DEV } from '@repo/constants'

export type { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // This will fix queries refetching during HMR
      staleTime: IS_DEV ? 60 * 1000 : undefined,
    },
  },
})

export const getServerQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          // With SSR, we usually want to set some default staleTime
          // above 0 to avoid refetching immediately on the client
          staleTime: 60 * 1000,
        },
      },
    }),
)
