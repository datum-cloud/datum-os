import { NextResponse } from 'next/server'

import { getPathWithParams } from '@repo/common/routes'
import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { authorize } from '@/utils/requests'
import { handleError, handleResponseError } from '@/utils/requests'

interface RequestParams {
  params: {
    id: string
  }
}

export async function GET(
  request: Request,
  { params }: RequestParams,
): Promise<NextResponse> {
  try {
    const { id } = params
    const token = await authorize()

    if (!id) {
      return NextResponse.json(
        { message: 'Bad request - No ID provided' },
        { status: HttpStatus.BadRequest },
      )
    }

    const response = await fetch(
      getPathWithParams(SERVICE_APP_ROUTES.contact, { id }),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      await handleResponseError(response, `Failed to fetch contact ${id}`)
    }

    const data = await response.json()
    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    return handleError(error, 'Failed to fetch contact')
  }
}
