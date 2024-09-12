import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import { Button } from '@repo/ui/button'
import Link from 'next/link'
import DragAndDrop from '@/components/shared/drag-and-drop/drag-and-drop'
import { uploadContacts } from '@/query/contacts'
import { useSession } from 'next-auth/react'
import { Datum } from '@repo/types'

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
    console.log('Created Contacts:', contacts)

    setOpen(false)
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
            <DragAndDrop onConfirm={handleCSVUpload} />
            <Button variant="sunglowXs" size="xs" className="underline">
              Download our pre-formatted CSV
            </Button>
          </div>
          <div className="flex flex-col gap-5 border border-butter-900 bg-butter-800 rounded-lg p-9">
            <p className="text-peat-800 leading-[23.6px]">
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
