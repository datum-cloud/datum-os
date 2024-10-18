import { NextResponse } from 'next/server'

import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { handleError, handleResponseError } from '@/utils/requests'

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: HttpStatus.BadRequest },
      )
    }

    const response = await fetch(
      `${SERVICE_APP_ROUTES.verify}?token=${token}`,
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
        },
      },
    )

    if (!response.ok) {
      return handleResponseError(response, 'Failed to verify token')
    }

    const data = await response.json()
    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    console.error('Failed to verify token', error)
    return handleError(error, 'Failed to verify token')
  }
}
