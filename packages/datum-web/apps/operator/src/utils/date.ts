import { format as _format } from 'date-fns'

import { DATE_FORMAT } from '@repo/constants'

export function formatDate(input: Date, format: string = DATE_FORMAT) {
  const parsedDate = new Date(input)

  if (!input || isNaN(parsedDate.getTime())) {
    return ''
  }

  const date = _format(parsedDate, format)
  const amPm = _format(parsedDate, 'a').toLowerCase()

  return `${date}${amPm}`
}
