import { parse } from 'csv-parse/sync' // Using sync for simplicity
import { NextResponse } from 'next/server'

import { decamelize } from '@repo/common/keys'
import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'
import type { Datum } from '@repo/types'

import { auth } from '@/lib/auth/auth'

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

function handleName(key: string, row: Record<string, any>) {
  // TODO: Handle name fields other than Full Name
  return ''
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

export async function POST(request: Request) {
  const session = await auth()
  const token = session?.user?.accessToken

  if (!token) {
    return NextResponse.json(
      { message: 'Unauthorized - No Token Provided' },
      {
        status: HttpStatus.Unauthorized,
      },
    )
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  try {
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

    const fData = await fetch(SERVICE_APP_ROUTES.contacts, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contacts: formattedContacts,
      }),
    })

    const result = await fData.json()

    return NextResponse.json(result, { status: fData.status })
  } catch (error) {
    return NextResponse.json({ error: 'Error parsing CSV' }, { status: 500 })
  }
}
