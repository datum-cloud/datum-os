import type { QueryKey } from '@tanstack/react-query'

import { camelize, decamelize } from '@repo/common/keys'
import { getPathWithParams } from '@repo/common/routes'
import { OPERATOR_API_ROUTES } from '@repo/constants'
import { Datum } from '@repo/types'

import { queryClient } from '@/query/client'
import type { VendorInput } from '@/utils/schemas'

export const MOCK_VENDORS: Datum.Vendor[] = [
  {
    id: '1' as Datum.VendorId,
    name: 'TechSupply Co.',
    description: 'Leading supplier of tech equipment',
    createdAt: new Date('2023-01-15T10:00:00Z'),
    updatedAt: new Date('2023-06-20T14:30:00Z'),
    notes: [
      {
        id: '1' as Datum.NoteId,
        content: 'Reliable',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2' as Datum.NoteId,
        content: 'Fast shipping',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    contacts: [],
    primaryContact: {
      id: '101' as Datum.ContactId,
      fullName: 'John Doe',
      title: 'Sales Manager',
      email: 'john@techsupply.com' as Datum.Email,
      company: 'TechSupply Co.',
      phoneNumber: '+1234567890',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'Website',
      status: 'ACTIVE' as Datum.Status,
      contactLists: [],
    },
    invoices: [],
    tags: [
      {
        id: '1' as Datum.TagId,
        name: 'tech',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2' as Datum.TagId,
        name: 'hardware',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    taxInfo: 'US-123456789',
    owner: {
      id: 'user123' as Datum.UserId,
      email: 'owner@example.com',
      authProvider: 'local',
      setting: { status: 'active' },
    },
    activityLog: [],
    status: 'ACTIVE' as Datum.VendorStatus,
  },
  {
    id: '2' as Datum.VendorId,
    name: 'Green Office Solutions',
    description: 'Eco-friendly office supplies',
    createdAt: new Date('2023-03-01T09:15:00Z'),
    updatedAt: new Date('2023-07-10T11:45:00Z'),
    notes: [
      {
        id: '3' as Datum.NoteId,
        content: 'Sustainable products',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4' as Datum.NoteId,
        content: 'Good customer service',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    contacts: [],
    primaryContact: {
      id: '202' as Datum.ContactId,
      fullName: 'Jane Smith',
      title: 'Account Manager',
      email: 'jane@greenoffice.com' as Datum.Email,
      company: 'Green Office Solutions',
      phoneNumber: '+1987654321',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'Referral',
      status: 'ACTIVE' as Datum.Status,
      contactLists: [],
    },
    invoices: [],
    tags: [
      {
        id: '3' as Datum.TagId,
        name: 'eco-friendly',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4' as Datum.TagId,
        name: 'office-supplies',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    taxInfo: 'UK-987654321',
    owner: {
      id: 'user456' as Datum.UserId,
      email: 'owner2@example.com',
      authProvider: 'local',
      setting: { status: 'active' },
    },
    activityLog: [],
    status: 'ACTIVE' as Datum.VendorStatus,
  },
  {
    id: '3' as Datum.VendorId,
    name: 'Global Logistics Inc.',
    description: 'International shipping and logistics',
    createdAt: new Date('2023-02-10T08:30:00Z'),
    updatedAt: new Date('2023-08-05T16:20:00Z'),
    notes: [
      {
        id: '5' as Datum.NoteId,
        content: 'Worldwide coverage',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6' as Datum.NoteId,
        content: 'Competitive rates',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    contacts: [],
    primaryContact: {
      id: '303' as Datum.ContactId,
      fullName: 'Bob Johnson',
      title: 'Logistics Coordinator',
      email: 'bob@globallogistics.com' as Datum.Email,
      company: 'Global Logistics Inc.',
      phoneNumber: '+1122334455',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'Conference',
      status: 'ACTIVE' as Datum.Status,
      contactLists: [],
    },
    invoices: [],
    tags: [
      {
        id: '5' as Datum.TagId,
        name: 'logistics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '6' as Datum.TagId,
        name: 'international',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    taxInfo: 'DE-456789012',
    owner: {
      id: 'user789' as Datum.UserId,
      email: 'owner3@example.com',
      authProvider: 'local',
      setting: { status: 'active' },
    },
    activityLog: [],
    status: 'ACTIVE' as Datum.VendorStatus,
  },
]

function formatVendor(input: Record<string, any>): Datum.Vendor {
  const {
    id,
    name,
    description,
    notes,
    contacts,
    primaryContact,
    invoices,
    tags,
    taxInfo,
    owner,
    activityLog,
    createdAt,
    updatedAt,
    status,
  } = input

  return {
    id,
    name,
    description,
    createdAt,
    updatedAt,
    notes,
    contacts,
    primaryContact,
    invoices,
    tags,
    taxInfo,
    owner,
    activityLog,
    status,
  }
}

export async function getVendors(): Promise<Datum.Vendor[]> {
  const vendors = MOCK_VENDORS
  //   TODO: Reinstate when vendors are ready
  //   const response = await fetch(OPERATOR_API_ROUTES.vendors)

  //   if (!response.ok) {
  //     const result = await response.json()
  //     const message = result?.message || 'Something went wrong'

  //     throw new Error(message)
  //   }

  //   const result = await response.json()
  //   const formattedResult = camelize(result)

  //   const vendors = formattedResult.vendors.map(formatVendor)

  return vendors
}

export async function getVendor(id: Datum.VendorId): Promise<Datum.Vendor> {
  const formattedVendor = MOCK_VENDORS.find((vendor) => vendor.id === id)

  if (!formattedVendor) {
    throw new Error('Vendor not found')
  }

  //   const response = await fetch(
  //     getPathWithParams(OPERATOR_API_ROUTES.vendor, { id }),
  //   )

  //   if (!response.ok) {
  //     const result = await response.json()
  //     const message = result?.message || 'Something went wrong'

  //     throw new Error(message)
  //   }

  //   const result = await response.json()
  //   const formattedResult = camelize(result)
  //   // TODO: Fetch related entities, i.e. Contacts,
  //   const formattedVendor = formatVendor({ ...formattedResult })

  return formattedVendor
}

export async function createVendors(
  organisationId: Datum.OrganisationId,
  input: VendorInput[],
) {
  const formattedInput = decamelize({
    vendors: input,
  })

  const response = await fetch(OPERATOR_API_ROUTES.createVendors, {
    method: 'POST',
    body: JSON.stringify(formattedInput),
  })

  const result = await response.json()
  const vendors = camelize(result).vendors as Datum.Vendor[]

  await queryClient.invalidateQueries({
    queryKey: getVendorsKey(organisationId),
  })

  return vendors
}

export async function editVendors(
  id: Datum.OrganisationId,
  input: VendorInput[],
) {
  const formattedInput = decamelize({
    vendors: input,
  })

  const response = await fetch(OPERATOR_API_ROUTES.editVendors, {
    method: 'PUT',
    body: JSON.stringify(formattedInput),
  })

  const result = await response.json()
  const vendors = camelize(result).vendors as Datum.Vendor[]

  for (const vendor of input) {
    await queryClient.invalidateQueries({
      queryKey: getVendorKey(vendor.id as Datum.VendorId),
    })
  }

  await queryClient.invalidateQueries({ queryKey: getVendorsKey(id) })

  return vendors
}

export async function removeVendors(
  id: Datum.OrganisationId,
  input: Datum.VendorId[],
) {
  const formattedInput = decamelize({
    vendorIds: input,
  })

  await fetch(OPERATOR_API_ROUTES.deleteVendors, {
    method: 'DELETE',
    body: JSON.stringify(formattedInput),
  })

  await queryClient.invalidateQueries({ queryKey: getVendorsKey(id) })
}

export function getVendorKey(id: Datum.VendorId): QueryKey {
  return ['vendor', id]
}

export function getVendorsKey(id: Datum.OrganisationId): QueryKey {
  return ['vendors', id]
}
