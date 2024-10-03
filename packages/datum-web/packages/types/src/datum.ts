import { LucideProps } from 'lucide-react'

import { GetOrganizationMembersQuery } from '@repo/codegen/src/schema'
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

  export type FilterOption = {
    key: string
    value: any
  }

  export type Filter = {
    icon: React.ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
    >
    title: string
    operator: Datum.OPERATOR
    options?: FilterOption[]
  }

  export type List = {
    id: ListId
    name: string
    description: string
    visibility: 'PUBLIC' | 'PRIVATE'
    createdAt: Date
    updatedAt: Date
    status: Status
    memberCount: number
    members?: Contact[]
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
    email: Email
    company: string
    phoneNumber: string
    createdAt: Date
    updatedAt: Date
    source: string
    status: Status
    contactLists: List[]
    enrichedData?: any // TODO: Type this properly
    contactHistory?: ContactHistory // TODO: Type this properly
  }

  export interface ContactCreateInput extends Partial<Contact> {
    email: Email
  }
  export interface ContactEditInput extends ContactCreateInput {
    id: ContactId
  }

  export type CsvData = Record<string, string>[]

  export type ImageDimensions = {
    height: number
    width: number
  }

  export type InvitationId = Brand<Id, 'InvitationId'>

  export type Invitation = {
    id: InvitationId
    recipient: string
    status: string
    createdAt?: any
    role: string
  }

  export type UserId = Brand<Id, 'UserId'>

  export type User = {
    id: Datum.UserId
    firstName?: string
    lastName?: string
    authProvider: string
    avatarRemoteURL?: string
    avatarLocalFile?: string
    email: string
    role?: string
    createdAt?: any
    lastSeen?: any
    setting: { status: string }
  }

  export interface OrgUser extends User {
    orgRole: string
    joinedAt: string
  }
}
