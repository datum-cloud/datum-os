import { type QueryKey } from '@tanstack/react-query'
import camelcaseKeys from 'camelcase-keys'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Datum } from '@repo/types'

export async function getContacts() {
  const response = await fetch(OPERATOR_APP_ROUTES.contacts)

  if (!response.ok) {
    const result = await response.json()
    const message = result?.message || 'Something went wrong'

    throw new Error(message)
  }

  const result = await response.json()
  const contacts = result.contacts.map((contact: any) => {
    const formattedResponse = camelcaseKeys(contact, { deep: true })

    return {
      ...formattedResponse,
      status: 'Active',
      source: 'Google',
      lists: ['Admins', 'Developers', 'Newsletter'],
    }
  }) as Datum.Contact[]

  return contacts
}

export function getContactsKey(id: string): QueryKey {
  return ['contacts', id]
}
