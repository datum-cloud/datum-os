import { NextResponse } from 'next/server'

import { HttpStatus } from '@repo/constants'

import { auth } from '@/lib/auth/auth'

export async function authorize() {
  const session = await auth()
  const token = session?.user?.accessToken

  if (!token) {
    return NextResponse.json(
      { message: 'Unauthorized - No Token Provided' },
      { status: HttpStatus.Unauthorized },
    )
  }

  return token
}

export async function handleResponseError(
  response: Response,
  message: string = 'Request failed',
) {
  const error = await response.json()

  return NextResponse.json(
    { message: error?.error || message },
    { status: response.status },
  )
}

export function handleError(
  error: Error,
  log: string = 'Error',
  message: string = 'Internal Server Error',
) {
  console.error(log, error)

  return NextResponse.json(
    { message, error: error.message },
    { status: HttpStatus.InternalServerError },
  )
}
