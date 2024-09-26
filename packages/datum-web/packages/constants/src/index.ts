import { Datum } from '@repo/types'

export const IS_DEV = process.env.NODE_ENV !== 'production'
export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
export const IS_SERVER = typeof globalThis?.window === 'undefined'
export const IS_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

export const SERVICE_REST_API = process.env.API_REST_URL || ''
export const SERVICE_APP_ROUTES = {
  contacts: `${SERVICE_REST_API}/v1/contacts`,
  contact: `${SERVICE_REST_API}/v1/contacts/[id]`,
  contactLists: `${SERVICE_REST_API}/v1/contacts/lists`,
  contactList: `${SERVICE_REST_API}/v1/contacts/lists/[id]`,
  contactListMembers: `${SERVICE_REST_API}/v1/contacts/lists/[id]/members`,
}

export const OPERATOR_APP_ROUTES = {
  home: '/',
  contacts: '/marketing/contacts',
  contactsUpload: '/marketing/contacts/upload',
  contact: '/marketing/contacts/[id]',
  contactLists: '/marketing/contacts/lists',
  contactList: '/marketing/contacts/lists/[id]',
  contactListMembers: '/marketing/contacts/lists/[id]/members',
  profile: '/profile',
  dashboard: '/dashboard',
  settings: '/settings',
  workspace: '/workspace',
  login: '/login',
  forgotPassword: '/forgot-password',
}

export const OPERATOR_API_ROUTES = {
  contacts: '/api/auth/contacts',
  contact: '/api/auth/contacts/[id]',
  createContacts: '/api/auth/contacts/create',
  deleteContacts: '/api/auth/contacts/delete',
  editContacts: '/api/auth/contacts/edit',
  uploadContacts: '/api/auth/contacts/upload',
  contactLists: '/api/auth/contacts/lists',
  contactList: '/api/auth/contacts/lists/[id]',
  createContactLists: '/api/auth/contacts/lists/create',
  deleteContactLists: '/api/auth/contacts/lists/delete',
  editContactLists: '/api/auth/contacts/lists/edit',
  contactListMembers: '/api/auth/contacts/lists/[id]/members',
  createContactListMembers: '/api/auth/contacts/lists/[id]/members/create',
  deleteContactListMembers: '/api/auth/contacts/lists/[id]/members/delete',
  upload: '/api/auth/upload',
}

export const OPERATOR_FILES = {
  contactsTemplate: {
    name: 'datum-sample.csv',
    url: '/templates/datum-sample.csv',
  },
}

export const DATE_FORMAT = `MMMM d, yyyy 'at' h:mm`

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

export const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: 'Incorrect email or password',
}

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.'
