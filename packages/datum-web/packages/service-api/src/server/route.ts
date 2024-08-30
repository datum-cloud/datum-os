import { NextRequest, NextResponse } from 'next/server'

import { HttpStatus } from '@repo/constants'

import { listContacts } from './actions'

const publicActions = {
  listContacts,
}

export const privateActions = {}

const actions = {
  ...publicActions,
  ...privateActions,
}

export type Actions = typeof actions

export async function apiHandler(
  request: NextRequest,
  context: { params: { name: string } },
): Promise<NextResponse> {
  try {
    const { name } = context.params
    const { params } = await request.json()
    params.push(request)
    // TODO: Handle Auth...

    if (name in actions) {
      // @ts-ignore
      const body = await actions[name](...params)
      return NextResponse.json(body ?? null)
    }
  } catch (err: any) {
    // TODO: Report error...
    const message = err?.message || 'Something went wrong'
    const status = err?.code || 400

    return NextResponse.json({ message }, { status })
  }

  return new NextResponse(null, { status: HttpStatus.NotImplemented })
}
