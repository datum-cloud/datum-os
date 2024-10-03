import type { Metadata } from 'next'
import React from 'react'

import { Datum } from '@repo/types'
import UserPage from '@/components/pages/protected/workspace/customer/user/user-page'

type UserPageProps = { params: { id: Datum.UserId } }

export const metadata: Metadata = {
  title: {
    template: '%s',
    default: 'User Information',
  },
}

const Page = async ({ params: { id } }: UserPageProps) => {
  return <UserPage id={id} />
}

export default Page
