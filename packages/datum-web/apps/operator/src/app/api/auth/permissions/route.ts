import { NextResponse } from 'next/server'

import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { authorize, handleError, handleResponseError } from '@/utils/requests'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const token = await authorize()
    const bodyData = await request.json()

    const response = await fetch(SERVICE_APP_ROUTES.accountAccess, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await handleResponseError(
        response,
        'Failed to get authentication options',
      )

      return error
    }

    const data = await response.json()

    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    console.error('Failed to get authentication options', error)
    return handleError(error, 'Failed to get authentication options')
  }
}
