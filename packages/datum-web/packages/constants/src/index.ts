import { Datum } from '@repo/types'

export const IS_DEV = process.env.NODE_ENV !== 'production'
export const IS_PROD = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
export const IS_SERVER = typeof globalThis?.window === 'undefined'
export const IS_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview'
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || ''

export const SERVICE_REST_API = process.env.API_REST_URL || ''
export const SERVICE_APP_ROUTES = {
  register: `${SERVICE_REST_API}/v1/register`,
  registrationOptions: `${SERVICE_REST_API}/v1/registration/options`,
  registrationVerification: `${SERVICE_REST_API}/v1/registration/verification`,
  authenticationOptions: `${SERVICE_REST_API}/v1/authentication/options`,
  authenticationVerification: `${SERVICE_REST_API}/v1/authentication/verification`,
  switchWorkspace: `${SERVICE_REST_API}/v1/switch`,
  verify: `${SERVICE_REST_API}/v1/verify`,
  contacts: `${SERVICE_REST_API}/v1/contacts`,
  invite: `${SERVICE_REST_API}/v1/invite`,
  contact: `${SERVICE_REST_API}/v1/contacts/[id]`,
  contactLists: `${SERVICE_REST_API}/v1/contacts/lists`,
  contactList: `${SERVICE_REST_API}/v1/contacts/lists/[id]`,
  contactListMembers: `${SERVICE_REST_API}/v1/contacts/lists/[id]/members`,
  forgotPassword: `${SERVICE_REST_API}/v1/forgot-password`,
  resetPassword: `${SERVICE_REST_API}/v1/password-reset`,
  accountAccess: `${process.env.API_REST_URL}/v1/account/access`,
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
  workspaceSettings: '/workspace/settings',
  personalWorkspaceSettings: '/workspace/personal/settings',
  workspaceMembers: '/workspace/members',
  login: '/login',
  forgotPassword: '/forgot-password',
  resetPassword: '/password-reset',
  users: '/customers/users',
  user: '/customers/users/[id]',
  invite: '/invite',
  verify: '/verify',
}

export const OPERATOR_API_ROUTES = {
  contacts: '/api/auth/contacts',
  contact: '/api/auth/contacts/[id]',
  register: '/api/auth/register',
  invite: '/api/auth/invite',
  verify: '/api/auth/verify',
  createContacts: '/api/auth/contacts/create',
  deleteContacts: '/api/auth/contacts/delete',
  editContacts: '/api/auth/contacts/edit',
  uploadContacts: '/api/auth/contacts/upload',
  contactLists: '/api/auth/contacts/lists',
  contactList: '/api/auth/contacts/lists/[id]',
  createContactLists: '/api/auth/contacts/lists/create',
  deleteContactLists: '/api/auth/contacts/lists/delete',
  registrationOptions: '/api/auth/registration-options',
  registrationVerification: '/api/auth/registration-verification',
  signinOptions: '/api/auth/signin-options',
  signinVerification: '/api/auth/signin-verification',
  switchWorkspace: '/api/auth/switch-workspace',
  editContactLists: '/api/auth/contacts/lists/edit',
  contactListMembers: '/api/auth/contacts/lists/[id]/members',
  createContactListMembers: '/api/auth/contacts/lists/[id]/members/create',
  deleteContactListMembers: '/api/auth/contacts/lists/[id]/members/delete',
  forgotPassword: '/api/auth/forgot-password',
  resetPassword: '/api/auth/password-reset',
  upload: '/api/auth/upload',
  permissions: '/api/auth/permissions',
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
  Created = 201,
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

export const DEFAULT_BATCH_SIZE = 2000

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.'

export const DEFAULT_AVATAR_DIMENSIONS: Datum.ImageDimensions = {
  width: 256,
  height: 256,
}

export const PRIMARY_COLOR = '#F27A67'
export const SECONDARY_COLOR = '#9C94B0'
export const SPINNER_BG = '#FBC8BF'
export const TOAST_DURATION = 5000
