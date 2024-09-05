import React from 'react'

import ContactsPage from '@/components/pages/protected/workspace/marketing/contacts/contacts-page'
import { Datum } from '@repo/types'
import { HydrationBoundary } from '@/query/hydration-boundary'
import { getServerQueryClient } from '@/query/query'
import { getContacts, getContactsKey } from '@/query/contacts'

type ContactPageProps = {
  organisationId: Datum.OrganisationId
}

const Page = async ({ organisationId }: ContactPageProps) => {
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
