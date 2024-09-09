import { format as _format } from 'date-fns'

export function formatDate(input: Date, format?: string) {
  const date = _format(new Date(input), `MMMM d, yyyy 'at' h:mm`)
  const amPm = _format(input, 'a').toLowerCase()

  return `${date}${amPm}`
}
