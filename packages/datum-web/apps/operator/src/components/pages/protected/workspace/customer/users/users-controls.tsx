'use client'

import { ChevronDown, Import, Trash } from 'lucide-react'
import { useState } from 'react'

import type { Datum } from '@repo/types'
import { Button } from '@repo/ui/button'
import type { ColumnFiltersState } from '@repo/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'

import FilterDialog from '@/components/shared/filter-dialog/filter-dialog'
import Search from '@/components/shared/table-search/table-search'
import { USER_FILTERS } from '@/utils/filters/schemas'

import { pageStyles } from './page.styles'
import UsersFormDialog from './users-form-dialog'

type UsersControlsProps = {
  search(query: string): void
  onDelete(): void
  onExport(): void
  onFilter(columnFilters: ColumnFiltersState): void
  selectedUsers?: Datum.User[]
  admin?: boolean
}

const UsersControls = ({
  search,
  onDelete,
  onExport,
  onFilter,
  selectedUsers,
  admin = false,
}: UsersControlsProps) => {
  const {
    controlsContainer,
    controlsButtons,
    contactDropdownItem,
    contactDropdownIcon,
  } = pageStyles()
  const [openUserDialog, _setOpenUserDialog] = useState(false)
  const [openActionsMenu, setOpenActionsMenu] = useState(false)

  function setOpenUserDialog(input: boolean) {
    _setOpenUserDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  return (
    <>
      <div className={controlsContainer()}>
        <Search
          placeholder="Search user and email"
          alignment="right"
          search={search}
        />
        <div className={controlsButtons()}>
          {/* TODO: Reinstate this later */}
          {/* <Button variant="outline" onClick={() => setOpenUserDialog(true)}>
            Create New
          </Button> */}
          <DropdownMenu
            open={openActionsMenu}
            onOpenChange={setOpenActionsMenu}
          >
            <DropdownMenuTrigger
              asChild
              onClick={() => setOpenActionsMenu(true)}
            >
              <Button variant="outline" icon={<ChevronDown />}>
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="px-2 py-2.5">
              <DropdownMenuItem
                onClick={onExport}
                className={contactDropdownItem()}
              >
                <Import
                  size={18}
                  className="text-blackberry-400 transform rotate-180"
                />
                Export
              </DropdownMenuItem>
              {/* TODO: Reinstate this */}
              {/* <DropdownMenuItem
                onClick={onDelete}
                disabled={selectedUsers && selectedUsers.length === 0}
                className={contactDropdownItem()}
              >
                <Trash size={18} className={contactDropdownIcon()} />
                Delete items
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
          <FilterDialog
            groupTitle="Users"
            onFilter={onFilter}
            filterList={USER_FILTERS}
          />
        </div>
      </div>
      <UsersFormDialog
        open={openUserDialog}
        setOpen={setOpenUserDialog}
        admin={admin}
      />
    </>
  )
}

export default UsersControls
