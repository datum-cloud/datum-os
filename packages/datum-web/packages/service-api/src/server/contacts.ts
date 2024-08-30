import { Datum } from '@repo/types'
import camelCaseKeys from 'camelcase-keys'

const MOCK_CONTACTS_DATA = {
  contact_list: [
    {
      full_name: 'Angus Bezzina',
      title: 'Engineer',
      email: 'angus.bezzina@littlebearlabs.io',
      created_at: new Date(),
      status: 'active',
      source: 'Google',
      company: 'Little Bear Labs',
      phone_number: '+18574451198',
      address: 'Toronto, Canada',
    },
  ],
}

const formatResponse = camelCaseKeys

export async function listContacts(
  organisationId: Datum.OrganisationId,
): Promise<Datum.Contact[]> {
  const contacts = formatResponse(MOCK_CONTACTS_DATA, {
    deep: true,
  }).contactList

  return contacts
}
