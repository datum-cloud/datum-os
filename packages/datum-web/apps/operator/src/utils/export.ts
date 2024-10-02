import { Row } from '@repo/ui/data-table'
import { Datum } from '@repo/types'

import { formatDate } from '@/utils/date'

export function formatContactsExportData(data: Row<Datum.Contact>[]) {
  const formattedData = data.map((row) => {
    const contact = row.original

    return {
      Name: contact.fullName || '',
      Email: contact.email || '',
      Title: contact.title || '',
      Status: contact.status || '',
      Lists: contact?.contactLists?.map(({ name }) => name).join(', ') || '',
      'Created at': formatDate(contact.createdAt) || '',
      'Last updated': formatDate(contact.updatedAt) || '',
    }
  })

  return formattedData
}

export function formatListsExportData(data: Row<Datum.List>[]) {
  const formattedData = data.map((row) => {
    const list = row.original

    return {
      Name: list.name || '',
      Description: list.description || '',
      Visibility: list.visibility || '',
      Members: list.members?.length || '',
      'Created at': formatDate(list.createdAt) || '',
      'Last updated': formatDate(list.updatedAt) || '',
    }
  })

  return formattedData
}

export function formatUsersExportData(data: Row<Datum.User>[]) {
  const formattedData = data.map((row) => {
    const user = row.original.user

    return {
      'First Name': user.firstName || '',
      'Last Name': user.lastName || '',
      Email: user.email || '',
      Provider: user.authProvider || '',
      'Created At': formatDate(user.createdAt) || '',
      'Last Seen': user.lastSeen || '',
      // TODO: Return status from backend
      Status: 'ACTIVE',
    }
  })

  return formattedData
}
