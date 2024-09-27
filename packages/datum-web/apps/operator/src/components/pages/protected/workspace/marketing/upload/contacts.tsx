'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/ui/tabs'

import ContactsTabCSV from '@/components/pages/protected/workspace/marketing/upload/contacts-tab-csv'
import PageTitle from '@/components/page-title'

import { pageStyles } from './page.styles'

const UploadContactsPage: React.FC = () => {
  const { wrapper, header, link } = pageStyles()

  return (
    <div className={wrapper()}>
      <div className="flex flex-col justify-start items-start gap-1">
        <Link href={OPERATOR_APP_ROUTES.contacts} className={link()}>
          <ArrowLeft size={18} />
          Back to Contacts
        </Link>
        <PageTitle title="Upload Contacts" className={header()} />
      </div>
      {/* TODO: Reimplement when the other import methods are added */}
      {/* <Tabs defaultValue="csv" className="w-full h-full flex flex-col">
        <TabsList>
          <TabsTrigger value="csv">Import from a CSV file</TabsTrigger>
          <TabsTrigger disabled value="form">
            Create a Form
          </TabsTrigger>
          <TabsTrigger disabled value="integration">
            Import from an Integration
          </TabsTrigger>
          <TabsTrigger disabled value="api">
            Use the API
          </TabsTrigger>
        </TabsList>
        <TabsContent value="csv" className="w-full flex flex-col">
          <ContactsTabCSV />
        </TabsContent>
      </Tabs> */}
      <div className="h-full max-h-full relative">
        <ContactsTabCSV />
      </div>
    </div>
  )
}

export default UploadContactsPage
