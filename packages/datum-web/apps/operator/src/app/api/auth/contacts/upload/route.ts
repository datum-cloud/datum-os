import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync' // Using sync for simplicity

import { decamelize } from '@repo/common/keys'
import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'
import type { Datum } from '@repo/types'

import { authorize, handleError, handleResponseError } from '@/utils/requests'

type FormatAction = (key: string, row: Record<string, any>) => string

type FormatField = {
  key?: keyof Datum.Contact
  action?: FormatAction
}

const FORMAT_MAP: Record<string, FormatField> = {
  name: {
    key: 'fullName',
  },
  fullname: {
    key: 'fullName',
  },
}

function getContactInformation(row: Record<string, any>) {
  const data: Record<string, any> = {}
  const filteredKeys = Object.keys(row).filter(Boolean)

  for (const key of filteredKeys) {
    const tidyKey = key.toLowerCase().replaceAll(' ', '').replaceAll('_', '')
    const { key: formattedKey = tidyKey, action } = FORMAT_MAP?.[tidyKey] || {}

    if (action) {
      data[formattedKey] = action(key, row)
    } else {
      data[formattedKey] = row[key]
    }
  }

  return decamelize(data) as Datum.Contact
}

export const maxDuration = 300

export async function POST(request: Request) {
  try {
    const token = await authorize()

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Bad request - No file uploaded' },
        { status: HttpStatus.BadRequest },
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const fileContent = Buffer.from(arrayBuffer).toString('utf-8')

    const rawContacts = parse(fileContent, {
      columns: true, // Auto-detect columns based on headers
      trim: true, // Trim whitespace from values
    })

    const formattedContacts = rawContacts
      .map(getContactInformation)
      .filter(
        ({ email }: Partial<Datum.Contact>) => !!email,
      ) as Datum.ContactCreateInput

    const response = await fetch(SERVICE_APP_ROUTES.contacts, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contacts: formattedContacts,
      }),
    })

    if (!response.ok) {
      await handleResponseError(response, `Failed to upload contacts`)
    }

    const data = await response.json()
    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    return handleError(error, 'Failed to upload contacts')
  }
}
