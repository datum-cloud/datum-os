import { type QueryKey, useQuery } from '@tanstack/react-query'

import { serviceClient } from './api'
import { Datum } from '@repo/types'

export function useContactList(organisationId: Datum.OrganisationId) {
  return useQuery({
    queryKey: getContactsKey(organisationId),
    queryFn: () => serviceClient.listContacts(organisationId),
  })
}

export function getContactsKey(id: string): QueryKey {
  return ['contacts', id]
}
