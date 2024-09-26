import { OPERATOR_API_ROUTES } from '@repo/constants'
import { Datum } from '@repo/types'

export async function uploadCsv(input: FormData) {
  const response = await fetch(OPERATOR_API_ROUTES.upload, {
    method: 'POST',
    body: input,
  })

  const result = await response.json()

  return result as Datum.CsvData
}
