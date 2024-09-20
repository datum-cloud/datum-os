import type { QueryKey } from '@tanstack/react-query'

import { OPERATOR_API_ROUTES } from '@repo/constants'
import { camelize, decamelize } from '@repo/common/keys'
import { Datum } from '@repo/types'

import { getPathWithParams } from '@repo/common/routes'
import { queryClient } from '@/query/client'
import type { ListInput } from '@/utils/schemas'
import { getContactKey } from '@/query/contacts'

function formatList(input: Record<string, any>): Datum.List {
  const {
    id,
    name,
    description,
    visibility,
    memberCount,
    createdAt,
    updatedAt,
    status,
    members,
  } = input

  return {
    id,
    name,
    description,
    visibility,
    memberCount,
    createdAt,
    updatedAt,
    status,
    members,
  }
}

export async function getLists(): Promise<Datum.List[]> {
  const response = await fetch(OPERATOR_API_ROUTES.contactLists)

  if (!response.ok) {
    const result = await response.json()
    const message = result?.message || 'Something went wrong'

    throw new Error(message)
  }

  const result = await response.json()
  const formattedResult = camelize(result)

  const lists = formattedResult.contactLists.map(formatList)

  return lists
}

export async function getList(id: Datum.ListId): Promise<Datum.List> {
  const response = await fetch(
    getPathWithParams(OPERATOR_API_ROUTES.contactList, { id }),
  )

  if (!response.ok) {
    const result = await response.json()
    const message = result?.message || 'Something went wrong'

    throw new Error(message)
  }

  const result = await response.json()
  const formattedResult = camelize(result)
  const members = (await getListMembers(id)) || []
  const formattedList = formatList({ ...formattedResult, members })

  return formattedList
}

export async function getListMembers(
  id: Datum.ListId,
): Promise<Datum.Contact[]> {
  const response = await fetch(
    getPathWithParams(OPERATOR_API_ROUTES.contactListMembers, { id }),
  )

  if (!response.ok) {
    const result = await response.json()
    const message = result?.message || 'Something went wrong'

    throw new Error(message)
  }

  const result = await response.json()
  const members = camelize(result).contacts as Datum.Contact[]

  return members
}

export async function createLists(
  organisationId: Datum.OrganisationId,
  input: ListInput[],
) {
  const formattedInput = decamelize({
    contactLists: input,
  })

  const response = await fetch(OPERATOR_API_ROUTES.createContactLists, {
    method: 'POST',
    body: JSON.stringify(formattedInput),
  })

  const result = await response.json()
  const lists = camelize(result).contactLists as Datum.List[]

  await queryClient.invalidateQueries({
    queryKey: getListsKey(organisationId),
  })

  return lists
}

export async function createListMembers(
  id: Datum.ListId,
  input: Datum.ContactId[],
) {
  const formattedInput = decamelize({
    contactIds: input,
  })

  const response = await fetch(
    getPathWithParams(OPERATOR_API_ROUTES.createContactListMembers, { id }),
    {
      method: 'POST',
      body: JSON.stringify(formattedInput),
    },
  )

  const result = await response.json()
  const members = camelize(result).count as number

  await queryClient.invalidateQueries({
    queryKey: getListKey(id),
  })

  for (const contactId of input) {
    await queryClient.invalidateQueries({ queryKey: getContactKey(contactId) })
  }

  return members
}

export async function removeListMembers(
  id: Datum.ListId,
  input: Datum.ContactId[],
) {
  const formattedInput = decamelize({
    contactIds: input,
  })

  await fetch(
    getPathWithParams(OPERATOR_API_ROUTES.deleteContactListMembers, { id }),
    {
      method: 'DELETE',
      body: JSON.stringify(formattedInput),
    },
  )

  await queryClient.invalidateQueries({ queryKey: getListKey(id) })

  for (const contactId of input) {
    await queryClient.invalidateQueries({ queryKey: getContactKey(contactId) })
  }
}

export async function editLists(id: Datum.OrganisationId, input: ListInput[]) {
  const formattedInput = decamelize({
    contactLists: input,
  })

  const response = await fetch(OPERATOR_API_ROUTES.editContactLists, {
    method: 'PUT',
    body: JSON.stringify(formattedInput),
  })

  const result = await response.json()
  const contacts = camelize(result).contactLists as Datum.List[]

  for (const list of input) {
    await queryClient.invalidateQueries({
      queryKey: getListKey(list.id as Datum.ListId),
    })
  }

  return contacts
}

export async function removeLists(
  id: Datum.OrganisationId,
  input: Datum.ListId[],
) {
  const formattedInput = decamelize({
    contactListIds: input,
  })

  await fetch(OPERATOR_API_ROUTES.deleteContactLists, {
    method: 'DELETE',
    body: JSON.stringify(formattedInput),
  })

  await queryClient.invalidateQueries({ queryKey: getListsKey(id) })
}

export function getListKey(id: Datum.ListId): QueryKey {
  return ['list', id]
}

export function getListsKey(id: Datum.OrganisationId): QueryKey {
  return ['lists', id]
}
