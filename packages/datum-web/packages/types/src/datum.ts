export namespace Datum {
  declare const __brand: unique symbol

  type Brand<T, B> = T & { [__brand]: B }

  export type NonEmptyArray<T> = [T, ...T[]]

  export type Id = string

  export type OrganisationId = Brand<Id, 'OrganisationId'>

  export type ContactId = Brand<Id, 'ContactId'>

  export type ListId = Brand<Id, 'ListId'>

  export type Json = Brand<string, 'Json'>

  export type Integer = number

  export type Float = number

  export type Count = Integer

  export type JsonValue =
    | null
    | string
    | number
    | boolean
    | { [key: string]: JsonValue }
    | JsonValue[]

  export type Email = Brand<`${string}@${string}`, 'Email'>

  export type IsoDateTime = Brand<
    `${number}-${number}-${number}T${number}:${number}:${number}.${number}Z}`,
    'IsoDateTime'
  >

  export type HttpMethod = 'POST' | 'PATCH' | 'DELETE' | 'GET'

  export type Slug = Brand<string, 'Slug'>

  export type Path = Brand<string, 'Path'>

  export type PartialWithField<
    T,
    U = { [K in keyof T]: Pick<T, K> },
  > = Partial<T> & U[keyof U]

  export type PartialWithSpecific<T, K extends keyof T> = Partial<T> &
    Pick<T, K>

  export type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never
  }[keyof T]

  export enum Status {
    active = 'ACTIVE',
    onboarding = 'ONBOARDING',
    inactive = 'INACTIVE',
    suspended = 'SUSPENDED',
    deactivated = 'DEACTIVATED',
  }

  export type OPERATOR =
    | 'equals'
    | 'doesNotEqual'
    | 'contains'
    | 'doesNotContain'
    | 'greaterThan'
    | 'greaterThanOrEqualTo'
    | 'lessThan'
    | 'lessThanOrEqualTo'
    | 'empty'

  export type List = {
    id: ListId
    name: string
    description: string
    visibility: 'PUBLIC' | 'PRIVATE'
    createdAt: Date
    status: Status
    members: ContactId[]
  }

  export type ContactHistoryEvent = {
    type: 'sent' | 'opened' | 'delivered'
    content: string
    location: string
    date: Date // ISO date string
  }

  export type ContactHistory = {
    events: ContactHistoryEvent[]
  }

  export interface Contact {
    id: ContactId
    fullName: string
    title: string
    company: string
    email: Email
    address: string
    phoneNumber: string
    createdAt: Date
    updatedAt: Date
    deletedAt?: Date
    source: string
    status: Status
    lists: ListId[]
    enrichedData?: any // TODO: Type this properly
    contactHistory?: ContactHistory // TODO: Type this properly
  }

  export interface ContactCreateInput extends Partial<Contact> {
    email: Email
  }
  export interface ContactEditInput extends ContactCreateInput {
    id: ContactId
  }
}
