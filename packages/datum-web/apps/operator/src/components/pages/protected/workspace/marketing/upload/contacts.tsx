'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { ArrowLeft } from 'lucide-react'

import { OPERATOR_APP_ROUTES, OPERATOR_FILES } from '@repo/constants'
import { downloadFromUrl } from '@repo/common/download'
import { Button } from '@repo/ui/button'
import { PageHeading } from '@repo/ui/page-heading'
import { Panel, PanelHeader } from '@repo/ui/panel'
import type { Datum } from '@repo/types'

import DragAndDrop from '@/components/shared/drag-and-drop/drag-and-drop'
import { uploadContacts } from '@/query/contacts'

import { pageStyles } from './page.styles'

const UploadContactsPage: React.FC = () => {
  const { wrapper, header, link } = pageStyles()
  const { data: session } = useSession()
  const organizationId = (session?.user.organization ??
    '') as Datum.OrganisationId

  async function handleCSVUpload(files: File[]) {
    const formData = new FormData()
    formData.append('file', files[0])

    const contacts = await uploadContacts(organizationId, formData)

    return contacts
  }

  return (
    <div className={wrapper()}>
      <Link href={OPERATOR_APP_ROUTES.contacts} className={link()}>
        <ArrowLeft size={18} />
        Back to Contacts
      </Link>
      <PageHeading heading="Upload Contacts" className={header()} />
      <Panel>
        <PanelHeader heading="Import disclaimer" noBorder />
        <p>Content here...</p>
        <PanelHeader heading="Import CSV File" noBorder />
        <div className="flex flex-col gap-12">
          <div className="w-full flex flex-col gap-6">
            <DragAndDrop
              confirmationText="Import contacts"
              entityName="contact"
              onConfirm={handleCSVUpload}
            />

            <Button
              variant="sunglowXs"
              size="xs"
              className="underline"
              onClick={() =>
                downloadFromUrl(
                  OPERATOR_FILES.contactsTemplate.name,
                  OPERATOR_FILES.contactsTemplate.url,
                )
              }
            >
              Download our pre-formatted CSV
            </Button>
          </div>
          <div className="flex flex-col gap-5 border border-butter-900 bg-butter-800 rounded-lg p-9">
            <p className="text-peat-800 dark:text-sunglow-900 leading-6">
              There are additional ways of importing contacts into Datum OS:
            </p>
            <ul className="list-disc list-inside text-peat-800 leading-[23.6px]">
              <li>
                <Link href="/" className="underline">
                  Create a form
                </Link>
              </li>
              <li>
                <Link href="/" className="underline">
                  Import via Integration
                </Link>
              </li>
              <li>
                <Link href="/" className="underline">
                  Use the API
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Panel>
    </div>
  )
}

export default UploadContactsPage
