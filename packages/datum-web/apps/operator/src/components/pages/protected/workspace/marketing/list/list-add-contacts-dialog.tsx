'use client'

import { useSession } from 'next-auth/react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import { Datum } from '@repo/types'
import { createListMembers } from '@/query/lists'

import { useAsyncFn } from '@/hooks/useAsyncFn'
import { Loading } from '@/components/shared/loading/loading'
import ListContactsTable from '@/components/pages/protected/workspace/marketing/list/list-contacts-table'
import { useContacts } from '@/hooks/useContacts'
import { Button } from '@repo/ui/button'
import { useState } from 'react'

type ListDialogFormProps = {
  listId: Datum.ListId
  open: boolean
  setOpen(input: boolean): void
}

const ListsAddContactsDialog = ({
  listId,
  open,
  setOpen,
}: ListDialogFormProps) => {
  const [selectedContacts, setSelectedContacts] = useState<Datum.Contact[]>([])
  const [contactsAdded, setContactsAdded] = useState<number>()
  const [{ loading: loadingCreate, error: errorCreate }, create] =
    useAsyncFn(createListMembers)
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)
  const {
    data: contacts = [],
    isLoading: loadingContacts,
    error: errorContacts,
  } = useContacts(organizationId)
  const loading = loadingContacts || loadingCreate
  const error = errorContacts || errorCreate

  async function onSubmit() {
    const memberIds = selectedContacts.map(({ id }) => id)
    const memberCount = await create(listId, memberIds)

    setContactsAdded(memberCount)
  }

  function handleCancel() {
    setOpen(false)
    setContactsAdded(undefined)
    setSelectedContacts([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a contact</DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        {loading && <Loading className="min-h-96" />}
        {error && <p>Whoops... something went wrong</p>}
        {!loading && !contactsAdded && (
          <>
            {/* SEARCH BAR */}
            <ListContactsTable
              id={listId}
              contacts={contacts}
              onSelectionChange={setSelectedContacts}
              isDialog
            />
            <DialogFooter>
              <DialogClose asChild onClick={onSubmit}>
                <Button type="button" full className="w-2/3">
                  Add contacts
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleCancel}
                className="w-1/3 ml-0"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogFooter>
          </>
        )}
        {!!contactsAdded && (
          <>
            <p>{contactsAdded} Contacts added</p>
            <DialogFooter>
              <Button
                type="button"
                onClick={handleCancel}
                className="w-1/3 ml-0"
                variant="outline"
              >
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ListsAddContactsDialog
