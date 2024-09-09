import React from 'react'

import { Datum } from '@repo/types'

import ListsPage from '@/components/pages/protected/workspace/marketing/lists/lists-page'
import { HydrationBoundary } from '@/query/hydration-boundary'
import { getServerQueryClient } from '@/query/client'
import { getLists, getListsKey } from '@/query/lists'

type ListsPageProps = {
  organisationId: Datum.OrganisationId
}

const Page = async ({ organisationId }: ListsPageProps) => {
  const client = getServerQueryClient()

  await client.prefetchQuery({
    queryKey: getListsKey(organisationId),
    queryFn: getLists,
  })

  return (
    <HydrationBoundary queryClient={client}>
      <ListsPage />
    </HydrationBoundary>
  )
}

export default Page
