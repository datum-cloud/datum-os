import React from 'react'

import ContactsPage from '@/components/pages/protected/workspace/marketing/contacts/contacts-page'
import {
  getContactsKey,
  getServerQueryClient,
  HydrationBoundary,
} from '@repo/service-api/client'
import { listContacts } from '@repo/service-api/server'
import { Datum } from '@repo/types'

type ContactPageProps = {
  organisationId: Datum.OrganisationId
}

const Page = async ({ organisationId }: ContactPageProps) => {
  const client = getServerQueryClient()

  await client.prefetchQuery({
    queryKey: getContactsKey(organisationId),
    queryFn: () => listContacts(organisationId),
  })

  return (
    <HydrationBoundary queryClient={client}>
      <ContactsPage />
    </HydrationBoundary>
  )
}

export default Page
