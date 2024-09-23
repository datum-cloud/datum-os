import type { QueryKey } from '@tanstack/react-query'

import { OPERATOR_API_ROUTES } from '@repo/constants'
import { camelize, decamelize } from '@repo/common/keys'
import { getPathWithParams } from '@repo/common/routes'
import { Datum } from '@repo/types'
import { queryClient } from '@/query/client'
import type { ContactInput } from '@/utils/schemas'

const MOCK_ENRICHED_DATA = {
  company: {
    key: 'Company',
    value: 'IBM Europe',
  },
  linkedin: {
    key: 'LinkedIn',
    value: 'linkedin.com/braink',
  },
  title: {
    key: 'Title',
    value: 'Marketing Director, EMEA',
  },
  github: {
    key: 'GitHub',
    value: 'github.com/braink',
  },
}

const MOCK_CONTACT_HISTORY: Datum.ContactHistory = {
  events: [
    {
      type: 'opened',
      content: 'Welcome to Wise',
      location: 'London, UK',
      date: new Date('2024-09-08T19:33:09.583385-05:00'),
    },
    {
      type: 'delivered',
      content: 'Welcome to Wise',
      location: 'Strasbourg, France',
      date: new Date('2024-08-08T19:33:09.583385-05:00'),
    },
    {
      type: 'sent',
      content: 'Welcome to Wise',
      location: 'London, UK',
      date: new Date('2024-07-08T19:33:09.583385-05:00'),
    },
  ],
}

function formatContact(input: Record<string, any>): Datum.Contact {
  const {
    id,
    fullName,
    email,
    status,
    source,
    updatedAt,
    contactLists = [],
    title,
    createdAt,
  } = camelize(input)

  return {
    id,
    title,
    fullName,
    email,
    status,
    source,
    contactLists,
    createdAt,
    updatedAt,
  }
}

export async function getContact(id: Datum.ContactId): Promise<Datum.Contact> {
  const response = await fetch(
    getPathWithParams(OPERATOR_API_ROUTES.contact, { id }),
  )

  if (!response.ok) {
    const result = await response.json()
    const message = result?.message || 'Something went wrong'

    throw new Error(message)
  }

  const result = await response.json()

  const formattedContact = formatContact(result)
  const enrichedData = await getEnrichedData(id)
  const contactHistory = await getContactHistory(id)

  return {
    ...formattedContact,
    contactHistory,
    enrichedData,
  }
}

async function getContactHistory(id: Datum.ContactId) {
  // TODO: Pull the Contact History from an API

  const contactHistory = MOCK_CONTACT_HISTORY

  return contactHistory
}

async function getEnrichedData(id: Datum.ContactId) {
  // TODO: We will be hooking this up to a third party service...

  const enrichedData = MOCK_ENRICHED_DATA

  return enrichedData
}

export async function getContacts(): Promise<Datum.Contact[]> {
  const response = await fetch(OPERATOR_API_ROUTES.contacts)

  if (!response.ok) {
    const result = await response.json()
    const message = result?.message || 'Something went wrong'

    throw new Error(message)
  }

  const result = await response.json()
  const contacts = result.contacts.map(formatContact)

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
  const formattedInput = decamelize({
    contacts: input,
  })

  const response = await fetch(OPERATOR_API_ROUTES.editContacts, {
    method: 'PUT',
    body: JSON.stringify(formattedInput),
  })

  const result = await response.json()
  const contacts = result.contacts as Datum.Contact[]

  for (const contact of contacts) {
    await queryClient.invalidateQueries({ queryKey: getContactKey(contact.id) })
  }

  return contacts
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

  for (const contact of input) {
    await queryClient.invalidateQueries({ queryKey: getContactKey(contact) })
  }

  await queryClient.invalidateQueries({ queryKey: getContactsKey(id) })
}

export function getContactKey(id: Datum.ContactId): QueryKey {
  return ['contact', id]
}

export function getContactsKey(id: Datum.OrganisationId): QueryKey {
  return ['contacts', id]
}
