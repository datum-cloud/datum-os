'use client'

import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from './client'

export interface ClientProviderProps {
  children?: React.ReactNode
}

export function ClientProvider({ children }: ClientProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
