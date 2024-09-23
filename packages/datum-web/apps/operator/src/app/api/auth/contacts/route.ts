import { NextResponse } from 'next/server'

import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { authorize, handleError, handleResponseError } from '@/utils/requests'

export async function GET() {
  try {
    const token = await authorize()
    const response = await fetch(SERVICE_APP_ROUTES.contacts, {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      await handleResponseError(response, 'Failed to get lists')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    return handleError(error, 'Failed to get lists')
  }
}
