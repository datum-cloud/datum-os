import React from 'react'

import { Datum } from '@repo/types'

import ContactsPage from '@/components/pages/protected/workspace/marketing/contacts/contacts-page'
import { HydrationBoundary } from '@/query/hydration-boundary'
import { getServerQueryClient } from '@/query/client'
import { getContacts, getContactsKey } from '@/query/contacts'

type ContactsPageProps = {
  organisationId: Datum.OrganisationId
}

const Page = async ({ organisationId }: ContactsPageProps) => {
  const client = getServerQueryClient()

  await client.prefetchQuery({
    queryKey: getContactsKey(organisationId),
    queryFn: getContacts,
  })

  return (
    <HydrationBoundary queryClient={client}>
      <ContactsPage />
    </HydrationBoundary>
  )
}

export default Page
