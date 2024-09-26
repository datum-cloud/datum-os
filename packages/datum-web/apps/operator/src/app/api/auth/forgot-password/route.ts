import { NextResponse } from 'next/server'

import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { handleError, handleResponseError } from '@/utils/requests'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const bodyData = await request.json()

    const response = await fetch(SERVICE_APP_ROUTES.forgotPassword, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    })

    if (!response.ok) {
      await handleResponseError(response, 'Failed to send password reset email')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    return handleError(error, 'Failed to send password reset email')
  }
}
