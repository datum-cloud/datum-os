import React from 'react'

import { Datum } from '@repo/types'

import ListsPage from '@/components/pages/protected/workspace/marketing/lists/lists-page'
// import { HydrationBoundary } from '@/query/hydration-boundary'
// import { getServerQueryClient } from '@/query/client'

type ListsPageProps = {
  organisationId: Datum.OrganisationId
}

const Page = async ({ organisationId }: ListsPageProps) => {
  return <ListsPage />
}

export default Page
