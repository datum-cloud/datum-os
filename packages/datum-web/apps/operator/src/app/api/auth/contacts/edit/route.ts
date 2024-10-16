import { NextResponse } from 'next/server'

import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { authorize, handleError, handleResponseError } from '@/utils/requests'

export async function PUT(request: Request) {
  try {
    const token = await authorize()
    const bodyData = await request.json()

    const response = await fetch(SERVICE_APP_ROUTES.contacts, {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    })

    if (!response.ok) {
      await handleResponseError(response, 'Failed to edit contacts')
    }

    const data = await response.json()

    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    return handleError(error, 'Failed to edit contacts')
  }
}
