import type { Metadata } from 'next'
import React from 'react'

import { Datum } from '@repo/types'

import EmailActivityPage from '@/components/pages/protected/workspace/marketing/email-activity/email-activity'

type EmailActivityProps = {
  organisationId: Datum.OrganisationId
}

export const metadata: Metadata = {
  title: 'Email Activity',
}

const Page = async ({ organisationId }: EmailActivityProps) => {
  return <EmailActivityPage />
}

export default Page
