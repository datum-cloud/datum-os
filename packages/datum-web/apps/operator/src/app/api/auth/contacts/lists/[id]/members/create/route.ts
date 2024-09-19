import { NextResponse } from 'next/server'

import { getPathWithParams } from '@repo/common/routes'
import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'

import { auth } from '@/lib/auth/auth'

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params
  const bodyData = await request.json()
  console.log('BODY DATA', bodyData)
  const session = await auth()
  const token = session?.user?.accessToken

  if (!token) {
    return NextResponse.json(
      { message: 'Unauthorized - No Token Provided' },
      {
        status: HttpStatus.Unauthorized,
      },
    )
  }

  const fData = await fetch(
    getPathWithParams(SERVICE_APP_ROUTES.contactListMembers, { id }),
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bodyData),
    },
  )

  if (!fData.ok) {
    return NextResponse.json(await fData.json(), { status: fData.status })
  }

  return NextResponse.json(await fData.json(), { status: 200 })
}
