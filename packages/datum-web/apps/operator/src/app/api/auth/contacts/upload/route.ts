import { parse } from 'csv-parse/sync' // Using sync for simplicity
import { NextResponse } from 'next/server'

import {
  HttpStatus,
  OPERATOR_API_ROUTES,
  SERVICE_APP_ROUTES,
} from '@repo/constants'
import type { Datum } from '@repo/types'

import { auth } from '@/lib/auth/auth'

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
      .filter((row: any) => row['Name'] && row['Email'] && row['Phone Number'])
      .map((row: any) => ({
        full_name: row['Name'],
        email: row['Email'],
        phone_number: row['Phone Number'],
      }))

    console.log('Formatted Contacts', formattedContacts)

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
