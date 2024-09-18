'use client'

import { useQuery } from '@tanstack/react-query'

import { Datum } from '@repo/types'

import { getList, getListKey, getLists, getListsKey } from '@/query/lists'

export function useLists(organisationId: Datum.OrganisationId) {
  return useQuery({
    queryKey: getListsKey(organisationId || ('' as Datum.OrganisationId)),
    queryFn: getLists,
  })
}

export function useList(listId: Datum.ListId) {
  return useQuery({
    queryKey: getListKey(listId),
    queryFn: async () => getList(listId),
  })
}
