import { NextResponse } from 'next/server'

import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { handleError, handleResponseError } from '@/utils/requests'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const bodyData = await request.json()
    const cookies = request.headers.get('cookie')
    const headers: HeadersInit = {
      'content-type': 'application/json',
    }
    if (cookies) {
      headers['cookie'] = cookies
    }

    const response = await fetch(SERVICE_APP_ROUTES.registrationVerification, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyData),
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await handleResponseError(
        response,
        'Failed to verify registration',
      )

      return error
    }

    const data = await response.json()

    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    console.error('Failed to verify registration', error)
    return handleError(error, 'Failed to verify registration')
  }
}
