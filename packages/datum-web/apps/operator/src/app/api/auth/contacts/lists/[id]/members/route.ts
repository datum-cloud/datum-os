import { auth } from '@/lib/auth/auth'
import { getPathWithParams } from '@repo/common/routes'
import { HttpStatus, SERVICE_APP_ROUTES } from '@repo/constants'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params
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
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!fData.ok) {
    return NextResponse.json(await fData.json(), { status: fData.status })
  }

  return NextResponse.json(await fData.json(), { status: 200 })
}
