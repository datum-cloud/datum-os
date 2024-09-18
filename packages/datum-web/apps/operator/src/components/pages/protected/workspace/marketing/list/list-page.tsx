'use client'

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { ArrowLeft, ChevronDown, Copy, Trash, Users2 } from 'lucide-react'
import Link from 'next/link'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Button } from '@repo/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { Tag } from '@repo/ui/tag'
import { Datum } from '@repo/types'

import { Loading } from '@/components/shared/loading/loading'
import { useList } from '@/hooks/useLists'
import { removeLists } from '@/query/lists'

import { pageStyles as listsStyles } from '../lists/page.styles'
import ListFormDialog from '../lists/lists-form-dialog'
import { pageStyles } from './page.styles'
import { toast } from '@repo/ui/use-toast'

type ListPageProps = {
  id: Datum.ListId
}

const ListPage = ({ id }: ListPageProps) => {
  const { data: session } = useSession()
  const organizationId = (session?.user.organization ??
    '') as Datum.OrganisationId
  const [selectedLists, setSelectedLists] = useState<string[]>([])
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const { wrapper, link, listHeader, listCard, listText, listActions } =
    pageStyles()
  const { listDropdownItem, listDropdownIcon } = listsStyles()

  const { error, isLoading, data: list } = useList(id)

  async function handleDeletion() {
    await removeLists(organizationId, [id])
  }

  if (isLoading) {
    return <Loading />
  }

  if (error || !list) {
    return <div className={wrapper()}>Whoops... Something went wrong</div>
  }

  const { name, description, members } = list

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)

    toast({
      title: 'Copied to clipboard',
      variant: 'success',
    })
  }

  return (
    <div className={wrapper()}>
      <Link href={OPERATOR_APP_ROUTES.contactLists} className={link()}>
        <ArrowLeft size={18} />
        Back to Lists
      </Link>
      <div className={listHeader()}>
        <div className={listCard()}>
          <div className={listText()}>
            <Tag status="dark" large>
              {name}
            </Tag>
            <p className="text-body-l text-blackberry-600">{description}</p>
            <div className="flex gap-4 items-center justify-start">
              <Button
                size="xs"
                variant="blackberryXs"
                icon={<Copy />}
                iconPosition="right"
                onClick={() => copyToClipboard(id)}
              >
                {id}
              </Button>
              <div className="flex gap-2 items-center">
                <Users2 />
                <Tag>{members.length}</Tag>
              </div>
            </div>
          </div>
        </div>
        <div className={listActions()}>
          <Button variant="outline" onClick={() => setOpenEditDialog(true)}>
            Edit list info
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button icon={<ChevronDown />} iconPosition="right">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="px-2 py-2.5">
              <DropdownMenuItem
                onClick={handleDeletion}
                className={listDropdownItem()}
              >
                <Trash size={18} className={listDropdownIcon()} />
                Delete list
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* <ContactTable contacts={members} /> */}
      <ListFormDialog
        list={list}
        open={openEditDialog}
        setOpen={setOpenEditDialog}
      />
    </div>
  )
}

export default ListPage
