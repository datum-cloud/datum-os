import { Session } from 'next-auth'
import { Client, type CombinedError, cacheExchange, fetchExchange } from 'urql'
import { retryExchange } from '@urql/exchange-retry'

import { datumGQLUrl } from '@repo/dally/auth'

export const createClient = (session: Session | null) =>
  new Client({
    url: datumGQLUrl,
    exchanges: [
      cacheExchange,
      retryExchange({
        maxNumberAttempts: 5,
        retryIf: (error: CombinedError) => !!error && !error.networkError,
      }),
      fetchExchange,
    ],
    fetchOptions: () => {
      const token = session?.user?.accessToken
      return {
        headers: { authorization: token ? `Bearer ${token}` : '' },
        credentials: 'include',
        timeout: 30000,
      }
    },
  })
