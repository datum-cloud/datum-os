'use client'

import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import {
  ArrowLeft,
  BellMinus,
  Check,
  ChevronDown,
  Ellipsis,
  Info,
  Plus,
  Trash,
  User,
} from 'lucide-react'
import Link from 'next/link'

import { mockLists, OPERATOR_APP_ROUTES } from '@repo/constants'
import { Button } from '@repo/ui/button'
import { Panel, PanelHeader } from '@repo/ui/panel'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { Tag } from '@repo/ui/tag'
import { cn } from '@repo/ui/lib/utils'
import { Datum } from '@repo/types'

import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from '@/components/shared/sidebar/sidebar-accordion/sidebar-accordion'
import { Loading } from '@/components/shared/loading/loading'
// import { useList } from '@/hooks/useLists'
import { removeLists } from '@/query/lists'
import { formatDate } from '@/utils/date'

import { pageStyles as listsStyles } from '../lists/page.styles'
import ListFormDialog from '../lists/lists-form-dialog'
// import ListTable from './list-table'
import { pageStyles } from './page.styles'

type ListPageProps = {
  id: Datum.ListId
}

const ListPage = ({ id }: ListPageProps) => {
  //   const { data: session } = useSession()
  //   const organizationId = (session?.user.organization ??
  //     '') as Datum.OrganisationId
  //   const [selectedLists, setSelectedLists] = useState<string[]>([])
  //   const [openEditDialog, setOpenEditDialog] = useState(false)
  //   const {
  //     wrapper,
  //     link,
  //     listHeader,
  //     listCard,
  //     listText,
  //     listActions,
  //   } = pageStyles()
  //   const {
  //     listDropdownItem,
  //     listDropdownIcon,
  //   } = listsStyles()

  //   const { error, isLoading, data: list } = useList(id)
  //   const { name, email, source, createdAt } = list || {}

  //   async function handleDeletion() {
  //     await removeLists(organizationId, [id])
  //   }

  //   if (isLoading) {
  //     return <Loading />
  //   }

  //   if (error || !list) {
  //     return <div>Whoops... Something went wrong</div>
  //   }

  return (
    <div>
      {/* <div className={wrapper()}> */}
      {/* <Link href={OPERATOR_APP_ROUTES.contactLists} className={link()}>
        <ArrowLeft size={18} />
        Back to Lists
      </Link>
      <div className={listHeader()}>
        <div className={listCard()}>
          <div className={listText()}>
            <Tag variant="dark">{name}</Tag>
            <h6 className="text-body-l text-blackberry-600">{email}</h6>
            <p className="text-body-sm leading-5 text-blackberry-500">
              Added by {source} on {formatDate(createdAt)}
            </p>
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
      <ListFormDialog
        list={list}
        open={openEditDialog}
        setOpen={setOpenEditDialog}
      /> */}
    </div>
  )
}

export default ListPage
