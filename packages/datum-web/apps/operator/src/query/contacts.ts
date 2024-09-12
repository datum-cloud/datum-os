import type { QueryKey } from '@tanstack/react-query'

import { OPERATOR_API_ROUTES } from '@repo/constants'
import { camelize, decamelize } from '@repo/common/keys'
import { getPathWithParams } from '@repo/common/routes'
import { Datum } from '@repo/types'
import { queryClient } from '@/query/client'
import type { ContactInput } from '@/utils/schemas'

export async function getContact(
  id: Datum.ContactId,
): Promise<Datum.Contact | undefined> {
  const response = await fetch(
    getPathWithParams(OPERATOR_API_ROUTES.contact, { id }),
  )

  if (!response.ok) {
    const result = await response.json()
    const message = result?.message || 'Something went wrong'

    throw new Error(message)
  }

  const result = await response.json()
  const contact = camelize<Datum.Contact>(result.contact)

  return contact
}

export async function getContacts(): Promise<Datum.Contact[]> {
  const response = await fetch(OPERATOR_API_ROUTES.contacts)

  if (!response.ok) {
    const result = await response.json()
    const message = result?.message || 'Something went wrong'

    throw new Error(message)
  }

  const result = await response.json()
  const contacts = result.contacts.map((contact: Record<string, any>) => {
    const formattedResponse = camelize<Datum.Contact>(contact)

    return {
      ...formattedResponse,
      lists: ['Admins', 'Developers', 'Newsletter'], // TODO: Make this real data...
    }
  })

  return contacts
}

export async function uploadContacts(
  organisationId: Datum.OrganisationId,
  input: FormData,
) {
  const response = await fetch(OPERATOR_API_ROUTES.uploadContacts, {
    method: 'POST',
    body: input,
  })

  const result = await response.json()
  const contacts = result.contacts as Datum.Contact[]

  await queryClient.invalidateQueries({
    queryKey: getContactsKey(organisationId),
  })

  return contacts
}

export async function createContacts(
  organisationId: Datum.OrganisationId,
  input: ContactInput[],
) {
  const formattedContacts = input.map((contact) => decamelize(contact))

  const response = await fetch(OPERATOR_API_ROUTES.createContacts, {
    method: 'POST',
    body: JSON.stringify({
      contacts: formattedContacts,
    }),
  })

  const result = await response.json()
  const contacts = result.contacts as Datum.Contact[]

  await queryClient.invalidateQueries({
    queryKey: getContactsKey(organisationId),
  })

  return contacts
}

export async function editContacts(
  id: Datum.OrganisationId,
  input: ContactInput[],
) {
  console.log(`Contact updates:`, JSON.stringify(input))

  const formattedInput = decamelize({
    contacts: input,
  })

  const response = await fetch(OPERATOR_API_ROUTES.editContacts, {
    method: 'PUT',
    body: JSON.stringify(formattedInput),
  })

  await queryClient.invalidateQueries({ queryKey: getContactsKey(id) })

  return response
}

export async function removeContacts(
  id: Datum.OrganisationId,
  input: Datum.ContactId[],
) {
  const formattedInput = decamelize({
    contactIds: input,
  })

  await fetch(OPERATOR_API_ROUTES.deleteContacts, {
    method: 'DELETE',
    body: JSON.stringify(formattedInput),
  })

  await queryClient.invalidateQueries({ queryKey: getContactsKey(id) })
}

export function getContactKey(id: Datum.ContactId): QueryKey {
  return ['contact', id]
}

export function getContactsKey(id: Datum.OrganisationId): QueryKey {
  return ['contacts', id]
}
