export namespace Datum {
  declare const __brand: unique symbol

  type Brand<T, B> = T & { [__brand]: B }

  export type NonEmptyArray<T> = [T, ...T[]]

  export type Id = string

  export type OrganisationId = Brand<Id, 'OrganisationId'>

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

  export type PartialWithField<
    T,
    U = { [K in keyof T]: Pick<T, K> },
  > = Partial<T> & U[keyof U]

  export type PartialWithSpecific<T, K extends keyof T> = Partial<T> &
    Pick<T, K>

  export type KeysMatching<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never
  }[keyof T]

  export type Contact = {
    fullName: string
    title: string
    company: string
    email: string
    status: string // TODO: enum
    address: string
    phoneNumber: string
    createdAt: Date // TODO: Check this...
  }
}
