'use client'

import { useQuery } from '@tanstack/react-query'

import { Datum } from '@repo/types'

import { getLists, getListsKey } from '@/query/lists'

export function useLists(organisationId: Datum.OrganisationId) {
  console.log('organisationId', organisationId)
  return useQuery({
    queryKey: getListsKey(organisationId || ('' as Datum.OrganisationId)),
    queryFn: getLists,
  })
}
