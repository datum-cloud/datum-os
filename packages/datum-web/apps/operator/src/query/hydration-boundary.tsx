import React from 'react'
import {
  dehydrate,
  HydrationBoundary as HydrationBoundaryImpl,
  QueryClient,
} from '@tanstack/react-query'

export interface HydrationBoundaryProps {
  children?: React.ReactNode
  queryClient: QueryClient
}

export function HydrationBoundary({
  children,
  queryClient,
}: HydrationBoundaryProps) {
  return (
    <HydrationBoundaryImpl state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundaryImpl>
  )
}
