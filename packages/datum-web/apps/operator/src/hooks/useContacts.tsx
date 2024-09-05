'use client'

import { useQuery } from '@tanstack/react-query'
import { Datum } from '@repo/types'
import { getContacts, getContactsKey } from '@/query/contacts'

export function useContacts(organisationId: Datum.OrganisationId) {
  return useQuery({
    queryKey: getContactsKey(organisationId),
    queryFn: getContacts,
  })
}
