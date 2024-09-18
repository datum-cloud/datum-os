import { useSession } from 'next-auth/react'
import Link from 'next/link'

import { downloadFromUrl } from '@repo/common/download'
import { OPERATOR_FILES } from '@repo/constants'
import { Button } from '@repo/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import { Datum } from '@repo/types'

import DragAndDrop from '@/components/shared/drag-and-drop/drag-and-drop'
import { uploadContacts } from '@/query/contacts'

type ImportContactsDialogProps = {
  open: boolean
  setOpen(input: boolean): void
}

const ImportContactsDialog = ({ open, setOpen }: ImportContactsDialogProps) => {
  const { data: session } = useSession()
  const organizationId = (session?.user.organization ??
    '') as Datum.OrganisationId

  async function handleCSVUpload(files: File[]) {
    const formData = new FormData()
    formData.append('file', files[0])

    const contacts = await uploadContacts(organizationId, formData)

    return contacts
  }

  function handleCancel() {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import contacts</DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
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
            <p className="text-peat-800 leading-6">
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
      </DialogContent>
    </Dialog>
  )
}

export default ImportContactsDialog
