import React from 'react'

import { Datum } from '@repo/types'

import ContactPage from '@/components/pages/protected/workspace/marketing/contact/contact-page'
import { HydrationBoundary } from '@/query/hydration-boundary'
import { getServerQueryClient } from '@/query/client'
import { getContact, getContactKey } from '@/query/contacts'

type ContactPageProps = { params: { id: Datum.ContactId } }

const Page = async ({ params: { id } }: ContactPageProps) => {
  const client = getServerQueryClient()

  await client.prefetchQuery({
    queryKey: getContactKey(id),
    queryFn: async () => getContact(id),
  })

  return (
    <HydrationBoundary queryClient={client}>
      <ContactPage id={id} />
    </HydrationBoundary>
  )
}

export default Page
