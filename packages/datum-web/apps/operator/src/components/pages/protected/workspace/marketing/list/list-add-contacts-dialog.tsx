'use client'

import { pluralize } from '@repo/common/text'
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
import { Button } from '@repo/ui/button'
import { useState } from 'react'
import { CheckCircle, Search } from 'lucide-react'
import { DebouncedInput } from '@repo/ui/input'

type ListDialogFormProps = {
  listId: Datum.ListId
  contacts: Datum.Contact[]
  open: boolean
  setOpen(input: boolean): void
}

const ListsAddContactsDialog = ({
  listId,
  contacts,
  open,
  setOpen,
}: ListDialogFormProps) => {
  const [selectedContacts, setSelectedContacts] = useState<Datum.Contact[]>([])
  const [contactsAdded, setContactsAdded] = useState<number>()
  const [{ loading, error }, create] = useAsyncFn(createListMembers)
  const [query, setQuery] = useState('')

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
            <div className="h-11 relative bg-white grid grid-cols-1 gap-0 items-start justify-start rounded-md border border-blackberry-400 w-full">
              <DebouncedInput
                value={query}
                type="search"
                onChange={(e) => setQuery(e)}
                placeholder="Search contacts"
                className="flex h-[42px] transition-all transform duration-1000 rounded-md border-none w-full translate-x-0 opacity-100 pr-11"
              />
              <Button
                variant="blackberryXs"
                size="xs"
                className="h-[42px] aspect-square shrink-0 rounded-md !absolute top-0 right-0"
                icon={<Search />}
                iconPosition="left"
              />
            </div>
            <div className="max-h-[55dvh] overflow-y-auto">
              <ListContactsTable
                id={listId}
                contacts={contacts}
                setSelection={setSelectedContacts}
                globalFilter={query}
                setGlobalFilter={setQuery}
                isDialog
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                disabled={selectedContacts.length === 0}
                onClick={onSubmit}
                full
                className="w-2/3"
              >
                Add contacts{' '}
                {selectedContacts.length > 0
                  ? `(${selectedContacts.length})`
                  : ''}
              </Button>
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
            <div className="flex items-center justify-center gap-2 py-6">
              <CheckCircle />
              Successfully added {contactsAdded}{' '}
              {pluralize('contact', contactsAdded)}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" onClick={handleCancel} full>
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ListsAddContactsDialog
