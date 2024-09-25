import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync' // Using sync for simplicity

import { HttpStatus } from '@repo/constants'

import { authorize, handleError } from '@/utils/requests'

export const maxDuration = 300

export async function POST(request: Request) {
  try {
    await authorize()

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

    const data = parse(fileContent, {
      columns: true, // Auto-detect columns based on headers
      trim: true, // Trim whitespace from values
    })

    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    return handleError(error, 'Failed to upload contacts')
  }
}
