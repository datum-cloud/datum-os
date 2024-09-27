'use client'

import { Provider as GraphqlProvider } from 'urql'
import { createClient } from '@/lib/urql'
import { useSession } from 'next-auth/react'
import { ThemeProvider } from '@/providers/theme'
import { ClientProvider } from '@/query/client-provider'
import { FeatureFlagsProvider } from '@/providers/feature-flags'
interface ProvidersProps {
  children: any
}

const Providers = ({ children }: ProvidersProps) => {
  const { data: session } = useSession()
  const client = createClient(session)
  const context = {
    targetingKey: session?.user.userId,
    email: session?.user.email
  };

  return (
    <FeatureFlagsProvider context={context}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ClientProvider>
          <GraphqlProvider value={client}>{children}</GraphqlProvider>
        </ClientProvider>
      </ThemeProvider>
    </FeatureFlagsProvider>
  )
}

export default Providers
