import type { Metadata } from 'next'
import React from 'react'

import { Datum } from '@repo/types'

import ListPage from '@/components/pages/protected/workspace/marketing/list/list-page'
import { HydrationBoundary } from '@/query/hydration-boundary'
import { getServerQueryClient } from '@/query/client'
import { getList, getListKey } from '@/query/lists'

type ListPageProps = { params: { id: Datum.ListId } }

export const metadata: Metadata = {
  title: 'List Information',
}

const Page = async ({ params: { id } }: ListPageProps) => {
  const client = getServerQueryClient()

  await client.prefetchQuery({
    queryKey: getListKey(id),
    queryFn: async () => getList(id),
  })

  return (
    <HydrationBoundary queryClient={client}>
      <ListPage id={id} />
    </HydrationBoundary>
  )
}

export default Page
