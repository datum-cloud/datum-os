'use client'

import { useQuery } from '@tanstack/react-query'

import { Datum } from '@repo/types'

import {
  getContact,
  getContactKey,
  getContacts,
  getContactsKey,
} from '@/query/contacts'

export function useContacts(organisationId: Datum.OrganisationId) {
  return useQuery({
    queryKey: getContactsKey(organisationId),
    queryFn: getContacts,
  })
}

export function useContact(contactId: Datum.ContactId) {
  return useQuery({
    queryKey: getContactKey(contactId),
    queryFn: async () => getContact(contactId),
  })
}
