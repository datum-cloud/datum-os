import { Row } from '@repo/ui/data-table'
import { Datum } from '@repo/types'

import { formatDate } from '@/utils/date'

export function formatContactsExportData(data: Row<Datum.Contact>[]) {
  const formattedData = data.map((row) => {
    const contact = row.original

    return {
      Name: contact.fullName || '',
      Email: contact.email || '',
      'Phone number': contact.phoneNumber || '',
      Title: contact.title || '',
      Company: contact.company || '',
      Status: contact.status || '',
      Lists: contact?.lists?.join(', ') || '',
      'Created at': formatDate(contact.createdAt) || '',
      'Last updated': formatDate(contact.updatedAt) || '',
    }
  })

  return formattedData
}
