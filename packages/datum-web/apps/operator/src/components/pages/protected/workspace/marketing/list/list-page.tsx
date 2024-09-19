'use client'

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  Pencil,
  Trash,
  Users2,
} from 'lucide-react'
import Link from 'next/link'

import { exportExcel } from '@repo/common/csv'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Button } from '@repo/ui/button'
import { Row } from '@repo/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { Tag } from '@repo/ui/tag'
import { toast } from '@repo/ui/use-toast'
import type { Datum } from '@repo/types'

import { Loading } from '@/components/shared/loading/loading'
import ListDeleteDialog from '@/components/pages/protected/workspace/marketing/list/list-delete-dialog'
import ListsAddContactsDialog from '@/components/pages/protected/workspace/marketing/list/list-add-contacts-dialog'
import { useContacts } from '@/hooks/useContacts'
import { useList } from '@/hooks/useLists'
import { editLists } from '@/query/lists'
import { formatContactsExportData } from '@/utils/export'
import { ListInput } from '@/utils/schemas'

import { pageStyles as listsStyles } from '../lists/page.styles'
import ListFormDialog from '../lists/lists-form-dialog'

import ListContactsTable from './list-contacts-table'
import { pageStyles } from './page.styles'

type ListPageProps = {
  id: Datum.ListId
}

const ListPage = ({ id }: ListPageProps) => {
  const { data: session } = useSession()
  const organizationId = (session?.user.organization ??
    '') as Datum.OrganisationId
  const [exportData, setExportData] = useState<Row<Datum.Contact>[]>([])
  const [selectedContacts, setSelectedContacts] = useState<Datum.Contact[]>([])
  const [openAddContactsDialog, _setOpenAddContactsDialog] = useState(false)
  const [openEditDialog, _setOpenEditDialog] = useState(false)
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const { wrapper, link, listHeader, listCard, listText, listActions } =
    pageStyles()
  const { listDropdownItem, listDropdownIcon } = listsStyles()

  const { error: errorList, isLoading: loadingList, data: list } = useList(id)
  const {
    data: allContacts = [],
    isLoading: loadingContacts,
    error: errorContacts,
  } = useContacts(organizationId)
  const loading = loadingList || loadingContacts
  const error = errorList || errorContacts

  function handleExport() {
    const now = new Date().toISOString()
    const formattedData = formatContactsExportData(exportData)
    exportExcel(`${name}-list-${now}`, formattedData)
  }

  async function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  async function setOpenAddContactsDialog(input: boolean) {
    _setOpenAddContactsDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  function setOpenEditDialog(input: boolean) {
    _setOpenEditDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  if (loading) {
    return <Loading />
  }

  if (error || !list) {
    return <div className={wrapper()}>Whoops... Something went wrong</div>
  }

  const { name, description, visibility, members } = list
  const memberIds = members.map(({ id }) => id)
  const nonMembers = allContacts.filter(
    (contact) => !memberIds.includes(contact.id),
  )

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)

    toast({
      title: 'Copied to clipboard',
    })
  }

  async function setPrivacy(privacy: Datum.List['visibility']) {
    await editLists(organizationId, [
      { ...list, visibility: privacy },
    ] as ListInput[])
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
            <Tag
              status="dark"
              className="h-[25px] text-body-sm tracking-[0.5px] border-blackberry-800"
            >
              {name}
            </Tag>
            <p className="text-body-l text-blackberry-600">{description}</p>
            <div className="flex gap-4 items-center justify-start text-blackberry-500">
              <Button
                size="xs"
                variant="blackberryXs"
                className="!text-blackberry-500 font-mono text-body-xs"
                icon={<Copy size={16} className="text-blackberry-500" />}
                iconPosition="left"
                onClick={() => copyToClipboard(id)}
              >
                {id}
              </Button>
              <div className="flex gap-2 items-center text-body-xs">
                <Users2 size={16} />
                {members.length}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <Tag
                      variant="dark"
                      className="flex items-center justify-between gap-1"
                    >
                      {visibility} <ChevronDown size={16} className="pt-0.5" />
                    </Tag>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-2">
                  <DropdownMenuItem
                    className={listDropdownItem()}
                    onClick={() => setPrivacy('PUBLIC')}
                  >
                    <Eye className={listDropdownIcon()} />
                    Public
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className={listDropdownItem()}
                    onClick={() => setPrivacy('PRIVATE')}
                  >
                    <EyeOff className={listDropdownIcon()} />
                    Private
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className={listActions()}>
          <Button variant="outline" onClick={handleExport}>
            Export all
          </Button>
          <Button
            variant="outline"
            onClick={() => setOpenAddContactsDialog(true)}
          >
            Add a contact
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button icon={<ChevronDown />} iconPosition="right">
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="px-2 py-2.5">
              <DropdownMenuItem
                onClick={() => setOpenEditDialog(true)}
                className={listDropdownItem()}
              >
                <Pencil size={18} className={listDropdownIcon()} />
                Edit list info
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setOpenDeleteDialog(true)}
                className={listDropdownItem()}
              >
                <Trash size={18} className={listDropdownIcon()} />
                Delete list
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <ListContactsTable
        id={id}
        setExportData={setExportData}
        contacts={members}
        onSelectionChange={setSelectedContacts}
      />
      <ListFormDialog
        list={list}
        open={openEditDialog}
        setOpen={setOpenEditDialog}
      />
      <ListsAddContactsDialog
        listId={id}
        contacts={nonMembers}
        open={openAddContactsDialog}
        setOpen={setOpenAddContactsDialog}
      />
      <ListDeleteDialog
        ids={[id]}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        redirect
      />
    </div>
  )
}

export default ListPage
