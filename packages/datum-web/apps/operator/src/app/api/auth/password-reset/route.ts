import { NextResponse } from 'next/server'

import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { handleError, handleResponseError } from '@/utils/requests'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const bodyData = await request.json()

    const response = await fetch(SERVICE_APP_ROUTES.resetPassword, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })

    if (!response.ok) {
      const error = await handleResponseError(
        response,
        'Failed to reset password',
      )

      return error
    }

    const data = await response.json()

    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    console.error('Failed to reset password', error)
    return handleError(error, 'Failed to reset password')
  }
}
