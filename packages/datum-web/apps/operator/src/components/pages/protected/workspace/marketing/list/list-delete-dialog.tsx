'use client'

import { useSession } from 'next-auth/react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import { Button } from '@repo/ui/button'
import { Datum } from '@repo/types'
import { removeLists } from '@/query/lists'

import { useRouter } from 'next/navigation'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { useAsyncFn } from '@/hooks/useAsyncFn'
import { Loading } from '@/components/shared/loading/loading'
import { TriangleAlert } from 'lucide-react'

type ListDeleteFormProps = {
  id: Datum.ListId
  open: boolean
  setOpen(input: boolean): void
}

const ListDeleteDialog = ({ id, open, setOpen }: ListDeleteFormProps) => {
  const router = useRouter()
  const [{ loading }, deleteLists] = useAsyncFn(removeLists)
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)

  function handleCancel() {
    setOpen(false)
  }

  function handleDelete() {
    deleteLists(organizationId, [id])
    router.push(OPERATOR_APP_ROUTES.contactLists)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete list</DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        {loading && <Loading />}
        {!loading && (
          <div className="w-full min-h-40 flex flex-col items-center justify-center gap-6 rounded bg-util-red-100">
            <div className="flex gap-6 items-center text-util-red-500">
              <TriangleAlert />
              Deleting a list is irreversible
            </div>
            <Button
              variant="outline"
              className="bg-white border-util-red-500 text-util-red-500"
              onClick={handleDelete}
            >
              Delete this list
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ListDeleteDialog
