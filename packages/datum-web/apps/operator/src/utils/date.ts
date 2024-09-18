import { format as _format } from 'date-fns'

import { DATE_FORMAT } from '@repo/constants'

export function formatDate(input: Date, format: string = DATE_FORMAT) {
  if (!input) return ''

  const date = _format(new Date(input), format)
  const amPm = _format(input, 'a').toLowerCase()

  return `${date}${amPm}`
}
