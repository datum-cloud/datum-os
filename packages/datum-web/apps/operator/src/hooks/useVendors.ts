'use client'

import { useQuery } from '@tanstack/react-query'

import { Datum } from '@repo/types'

import {
  getVendor,
  getVendorKey,
  getVendors,
  getVendorsKey,
} from '@/query/vendors'

export function useVendors(orgId: Datum.OrganisationId) {
  return useQuery({
    queryKey: getVendorsKey(orgId || ('' as Datum.OrganisationId)),
    queryFn: getVendors,
  })
}

export function useList(id: Datum.VendorId) {
  return useQuery({
    queryKey: getVendorKey(id),
    queryFn: async () => getVendor(id),
  })
}
