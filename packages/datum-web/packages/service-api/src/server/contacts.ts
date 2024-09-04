import { Datum } from '@repo/types'
import camelCaseKeys from 'camelcase-keys'

const MOCK_CONTACTS_DATA = {
  contact_list: [
    {
      id: '1',
      full_name: 'Brian Kenwood',
      title: 'Marketing Manager',
      email: 'brian.kenwood@kenwoodmarketing.com',
      created_at: '2024-07-07T12:47:00.000Z',
      status: 'Active',
      source: 'Google',
      company: 'Kenwood Marketing Inc.',
      phone_number: '+11234567890',
      address: '123 Market Street, San Francisco, CA, USA',
      lists: ['Admins', 'Newsletter'],
    },
    {
      id: '2',
      full_name: 'Sharon Bellingham',
      title: 'Product Manager',
      email: 'sharon.bellingham@notionlabs.com',
      created_at: '2024-07-06T10:37:00.000Z',
      status: 'Active',
      source: 'Amazon',
      company: 'Notion Labs, Inc.',
      phone_number: '+14155552671',
      address: '456 Innovation Way, Seattle, WA, USA',
      lists: ['Newsletter'],
    },
    {
      id: '3',
      full_name: 'David Hughes',
      title: 'Sales Director',
      email: 'david.hughes@applemarketing.com',
      created_at: '2024-07-07T12:47:00.000Z',
      status: 'Pending',
      source: 'Apple',
      company: 'Apple Marketing Ltd.',
      phone_number: '+11234567901',
      address: '789 Tech Avenue, Cupertino, CA, USA',
      lists: ['Admins', 'Newsletter', 'Other'],
    },
    {
      id: '4',
      full_name: 'Emily Carter',
      title: 'Software Engineer',
      email: 'emily.carter@meta.com',
      created_at: '2024-07-06T10:37:00.000Z',
      status: 'Inactive',
      source: 'Meta',
      company: 'Meta Platforms, Inc.',
      phone_number: '+14155552672',
      address: '1 Hacker Way, Menlo Park, CA, USA',
      lists: ['Newsletter'],
    },
    {
      id: '5',
      full_name: 'Michael Brown',
      title: 'SEO Specialist',
      email: 'michael.brown@kenwoodmarketing.com',
      created_at: '2024-07-07T12:47:00.000Z',
      status: 'Active',
      source: 'Google',
      company: 'Kenwood Marketing Inc.',
      phone_number: '+11234567891',
      address: '321 Marketing Blvd, San Francisco, CA, USA',
      lists: ['Admins'],
    },
    {
      id: '6',
      full_name: 'Sophia Lee',
      title: 'Project Coordinator',
      email: 'sophia.lee@notionlabs.com',
      created_at: '2024-07-06T10:37:00.000Z',
      status: 'Active',
      source: 'Amazon',
      company: 'Notion Labs, Inc.',
      phone_number: '+14155552673',
      address: '654 Innovation Way, Seattle, WA, USA',
      lists: ['Newsletter'],
    },
    {
      id: '7',
      full_name: 'James Smith',
      title: 'Creative Director',
      email: 'james.smith@applemarketing.com',
      created_at: '2024-07-07T12:47:00.000Z',
      status: 'Active',
      source: 'Apple',
      company: 'Apple Marketing Ltd.',
      phone_number: '+11234567902',
      address: '987 Design Road, Cupertino, CA, USA',
      lists: ['Admins', 'Other'],
    },
    {
      id: '8',
      full_name: 'Olivia Johnson',
      title: 'Data Analyst',
      email: 'olivia.johnson@meta.com',
      created_at: '2024-07-06T10:37:00.000Z',
      status: 'Active',
      source: 'Meta',
      company: 'Meta Platforms, Inc.',
      phone_number: '+14155552674',
      address: '2 Data Lane, Menlo Park, CA, USA',
      lists: ['Newsletter'],
    },
  ],
}

const formatResponse = camelCaseKeys

export async function listContacts(
  organisationId: Datum.OrganisationId,
): Promise<Datum.Contact[]> {
  const contactList = MOCK_CONTACTS_DATA.contact_list

  const contacts = contactList.map(
    (contact) =>
      formatResponse(contact, {
        deep: true,
      }) as unknown as Datum.Contact,
  )

  return contacts
}
