import { NextResponse } from 'next/server'

import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'
import { getPathWithParams } from '@repo/common/routes'

import { authorize, handleError, handleResponseError } from '@/utils/requests'

interface RequestParams {
  params: {
    id: string
  }
}

export async function DELETE(request: Request, { params }: RequestParams) {
  try {
    const { id } = params
    const bodyData = await request.json()

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
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      },
    )

    if (!response.ok) {
      await handleResponseError(response, `Failed to delete list ${id} members`)
    }

    const data = await response.json()
    return NextResponse.json(data, { status: HttpStatus.Ok })
  } catch (error: any) {
    return handleError(error, 'Failed to delete list members')
  }
}
