import { NextResponse } from 'next/server'

import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { auth } from '@/lib/auth/auth'
import { setSessionCookie } from '@/lib/auth/utils/set-session-cookie'
import { handleError, handleResponseError } from '@/utils/requests'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth()
    const token = session?.user?.accessToken
    const bodyData = await request.json()
    const cookies = request.headers.get('cookie')

    const headers: HeadersInit = {
      'content-type': 'application/json',
      Authorization: `Bearer ${token}`,
    }
    if (cookies) {
      headers['cookie'] = cookies
    }

    const response = await fetch(SERVICE_APP_ROUTES.switchWorkspace, {
      method: 'POST',
      headers,
      body: JSON.stringify(bodyData),
      credentials: 'include',
    })

    if (!response.ok) {
      return handleResponseError(response, 'Failed to switch workspace')
    }

    const data = await response.json()
    setSessionCookie(data.session)

    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    console.error('Failed to switch workspace', error)
    return handleError(error, 'Failed to switch workspace')
  }
}
