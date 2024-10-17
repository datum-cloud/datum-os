import { NextResponse } from 'next/server'

import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { auth } from '@/lib/auth/auth'
import { setSessionCookie } from '@/lib/auth/utils/set-session-cookie'
import { handleError, handleResponseError } from '@/utils/requests'

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const session = await auth()
    const accessToken = session?.user?.accessToken
    const cookies = request.headers.get('cookie')
    const searchParams = new URL(request.url).searchParams
    const token = searchParams.get('token')
    const headers: HeadersInit = {
      'content-type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    }
    if (cookies) {
      headers['cookie'] = cookies
    }

    const response = await fetch(
      `${SERVICE_APP_ROUTES.invite}?token=${token}`,
      {
        method: 'GET',
        headers,
      },
    )

    if (!response.ok) {
      const error = await handleResponseError(
        response,
        'Failed to process invite',
      )
      return error
    }

    const data = await response.json()
    setSessionCookie(data.session)

    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    console.error('Failed to process invite', error)
    return handleError(error, 'Failed to process invite')
  }
}
