export const IS_DEV = process.env.NODE_ENV !== 'production'
export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
export const IS_SERVER = typeof globalThis?.window === 'undefined'
export const IS_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

export const SERVICE_REST_API = process.env.API_REST_URL || ''
export const SERVICE_APP_ROUTES = {
  contacts: `${SERVICE_REST_API}/v1/contacts`,
  lists: `${SERVICE_REST_API}/v1/lists`,
}

export const OPERATOR_APP_ROUTES = {
  contacts: '/api/auth/contacts',
  contact: '/api/auth/[id]',
  createContacts: '/api/auth/contacts/create',
  lists: '/api/auth/lists',
}

export const TEL_REGEX =
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/

export enum HttpStatus {
  Ok = 200,
  NoContent = 204,
  MovedPermanently = 301,
  TemporaryRedirect = 307,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  Conflict = 409,
  Teapot = 418,
  UnprocessableContent = 422,
  TooManyRequests = 429,
  InternalServerError = 500,
  NotImplemented = 501,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}
