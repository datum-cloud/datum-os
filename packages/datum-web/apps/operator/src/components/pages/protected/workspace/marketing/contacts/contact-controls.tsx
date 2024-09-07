'use client'

import { useMemo, useState } from 'react'
import {
  ChevronDown,
  Filter,
  Import,
  Plus,
  Search,
  Trash,
  User,
} from 'lucide-react'

import { Button } from '@repo/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/dialog'

import AddContactDialog from './contact-add-dialog'
import ImportContactsDialog from './contact-import-dialog'

type ContactControlsProps = {
  searchOpen: boolean
  toggleSearch(): void
}

type DialogContent = 'add' | 'import'

const ContactControls = ({
  searchOpen,
  toggleSearch,
}: ContactControlsProps) => {
  const [dialogContent, setDialogContent] = useState<DialogContent>('add')

  const dialogInner = useMemo(() => {
    if (dialogContent === 'add') {
      return <AddContactDialog />
    }

    return <ImportContactsDialog />
  }, [dialogContent])

  function handleExport() {
    // TODO:Export files
    console.log('Export Selected Files')
  }

  function handleDeletion() {
    // TODO:Delete files
    console.log('Delete Selected Files')
  }

  function handleListAddition() {
    // TODO: Add to list
    console.log('Add to list')
  }

  return (
    <Dialog>
      <div className="flex justify-start items-stretch gap-[18px]">
        <Button variant="outline" onClick={toggleSearch}>
          <Search />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" icon={<ChevronDown />}>
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-2 py-2.5">
            <DropdownMenuItem asChild>
              <DialogTrigger
                className="w-full flex items-center justify-start gap-3 text-button-m cursor-pointer"
                onClick={() => setDialogContent('add')}
              >
                <User size={18} className="text-blackberry-400" />
                Add single contact
              </DialogTrigger>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <DialogTrigger
                className="w-full flex items-center justify-start gap-3 cursor-pointer"
                onClick={() => setDialogContent('import')}
              >
                <Import size={18} className="text-blackberry-400" />
                Import
              </DialogTrigger>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" icon={<ChevronDown />}>
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-2 py-2.5">
            <DropdownMenuItem
              onClick={handleExport}
              className="w-full flex items-center justify-start gap-3 text-button-m cursor-pointer"
            >
              <Import
                size={18}
                className="text-blackberry-400 transform rotate-180"
              />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeletion}
              className="w-full flex items-center justify-start gap-3 text-button-m cursor-pointer"
            >
              <Trash size={18} className="text-blackberry-400" />
              Delete items
            </DropdownMenuItem>
            <DropdownMenuItem className="w-full flex items-center justify-start gap-3 text-button-m cursor-pointer">
              <Plus size={18} className="text-blackberry-400" />
              Add to list
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="sunglow" icon={<Filter />}>
          Filter
        </Button>
      </div>
      <DialogContent>{dialogInner}</DialogContent>
    </Dialog>
  )
}

export default ContactControls
