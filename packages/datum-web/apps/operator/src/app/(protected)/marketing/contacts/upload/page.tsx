import type { Metadata } from 'next'
import React from 'react'

import UploadContactsPage from '@/components/pages/protected/workspace/marketing/upload/contacts'

export const metadata: Metadata = {
  title: 'Upload Contacts',
}

const Page = () => {
  return <UploadContactsPage />
}

export default Page
