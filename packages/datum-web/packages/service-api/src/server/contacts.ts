import { Datum } from '@repo/types'
import camelCaseKeys from 'camelcase-keys'

const MOCK_CONTACTS_DATA = {
  contact_list: [
    {
      id: '1',
      full_name: 'Angus Bezzina',
      title: 'Engineer',
      email: 'angus.bezzina@littlebearlabs.io',
      created_at: '2024-07-05T18:07:06.289Z',
      status: 'Active',
      source: 'Google',
      company: 'Little Bear Labs',
      phone_number: '+18574451198',
      address: 'Toronto, Canada',
      lists: ['Admins', 'Newsletter'],
    },
    {
      id: '2',
      full_name: 'Aus',
      title: 'Engineer',
      email: 'aus@littlebearlabs.io',
      created_at: '2024-05-30T10:07:06.289Z',
      status: 'Active',
      source: 'LinkedIn',
      company: 'Little Bear Labs',
      phone_number: '+14454444444',
      address: 'Oakland, USA',
      lists: ['Admins', 'Newsletter'],
    },
  ],
}

const formatResponse = camelCaseKeys

export async function listContacts(
  organisationId: Datum.OrganisationId,
): Promise<Datum.Contact[]> {
  const contacts = formatResponse(MOCK_CONTACTS_DATA, {
    deep: true,
  }).contactList as unknown as Datum.Contact[]

  return contacts
}
