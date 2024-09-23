import { NextResponse } from 'next/server'

import { getPathWithParams } from '@repo/common/routes'
import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { authorize, handleError, handleResponseError } from '@/utils/requests'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { message: 'Bad request - No ID provided' },
        { status: HttpStatus.BadRequest },
      )
    }

    const token = await authorize()
    const response = await fetch(
      getPathWithParams(SERVICE_APP_ROUTES.contactListMembers, { id }),
      {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      await handleResponseError(response, `Failed to get list ${id} members`)
    }

    const data = await response.json()
    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    return handleError(error, 'Failed to get list members')
  }
}
