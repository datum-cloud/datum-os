import type { NextRequest } from 'next/server'

import { API_BASE } from '@repo/constants'

import type { Actions } from '../server/route'

type ActionName = keyof Actions

type ActionParameters<T extends ActionName> = OmitRequestParam<
  Parameters<Actions[T]>
>

type OmitRequestParam<T> = T extends [...infer RestParams, infer LastParam]
  ? LastParam extends NextRequest
    ? RestParams
    : T
  : never

type ActionResult<T extends ActionName> = Awaited<ReturnType<Actions[T]>>

interface ActionRequest<T extends ActionName> {
  params: ActionParameters<T>
  headers?: Record<string, string>
  signal?: AbortSignal
}

const apiProxyHandler: ProxyHandler<any> = {
  get<K extends ActionName>(target: any, prop: K) {
    if (prop in target) {
      return target[prop]
    }

    // NOTE: It would be nice to work out how to pass the headers/signal via the proxy
    return (...params: ActionParameters<K>) => request(prop, { params })
  },
}

export const serviceClient = new Proxy(
  { request },
  apiProxyHandler,
) as Actions & {
  request: typeof request
}

async function request<T extends ActionName>(
  name: T,
  { params, headers, signal }: ActionRequest<T>,
) {
  const response = await fetch(`${API_BASE}/api/actions/${name}`, {
    method: 'POST',
    body: JSON.stringify({ params }),
    headers,
    signal,
  })

  if (!response.ok) {
    const result = await response.json()
    const message = result?.message || 'Something went wrong'

    throw new Error(message)
  }

  return response.json() as ActionResult<T>
}
