import type { QueryKey } from '@tanstack/react-query'

import { OPERATOR_API_ROUTES } from '@repo/constants'
import { camelize } from '@repo/common/keys'
import { Datum } from '@repo/types'

export async function getLists(): Promise<Datum.List[]> {
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

export function getListsKey(id: Datum.OrganisationId): QueryKey {
  return ['lists', id]
}
