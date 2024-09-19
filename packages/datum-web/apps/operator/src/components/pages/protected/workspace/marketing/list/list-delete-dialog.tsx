'use client'

import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { TriangleAlert } from 'lucide-react'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { pluralize } from '@repo/common/text'
import { Button } from '@repo/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import { Datum } from '@repo/types'

import { Loading } from '@/components/shared/loading/loading'
import { useAsyncFn } from '@/hooks/useAsyncFn'
import { removeLists } from '@/query/lists'

import { deleteDialogStyles } from './page.styles'

type ListDeleteFormProps = {
  ids: Datum.ListId[]
  open: boolean
  setOpen(input: boolean): void
  redirect?: boolean
}

const ListDeleteDialog = ({
  ids,
  open,
  redirect = false,
  setOpen,
}: ListDeleteFormProps) => {
  const router = useRouter()
  const [{ loading }, deleteLists] = useAsyncFn(removeLists)
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)

  const { content, text, button } = deleteDialogStyles()

  function handleCancel() {
    setOpen(false)
  }

  function handleDelete() {
    deleteLists(organizationId, ids)

    if (redirect) {
      router.push(OPERATOR_APP_ROUTES.contactLists)
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {ids.length > 1 ? 'lists' : 'list'}</DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        {loading && <Loading />}
        {!loading && (
          <div className={content()}>
            <div className={text()}>
              <TriangleAlert />
              Deleting a list is irreversible
            </div>
            <Button
              variant="outline"
              className={button()}
              onClick={handleDelete}
            >
              {ids.length > 1 ? `Delete lists` : 'Delete this list'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ListDeleteDialog
