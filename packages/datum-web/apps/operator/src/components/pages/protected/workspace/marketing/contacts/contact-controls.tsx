'use client'

import { useState } from 'react'
import {
  Check,
  ChevronDown,
  Filter,
  Import,
  Plus,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shared/sidebar/sidebar-accordion/sidebar-accordion'

import AddContactDialog from './contact-add-dialog'
import ImportContactsDialog from './contact-import-dialog'
import ContactSearch from './contact-search'

type ContactControlsProps = {
  search(query: string): void
}

const ContactControls = ({ search }: ContactControlsProps) => {
  const [_openContactDialog, _setOpenContactDialog] = useState(false)
  const [_openImportDialog, _setOpenImportDialog] = useState(false)

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

  function openContactDialog() {
    _setOpenContactDialog(true)
  }

  function openImportDialog() {
    _setOpenImportDialog(true)
  }

  function setOpenContactDialog(input: boolean) {
    _setOpenContactDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  function setOpenImportDialog(input: boolean) {
    _setOpenImportDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  return (
    <>
      <div className="flex justify-start items-stretch gap-[18px]">
        <ContactSearch search={search} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" icon={<ChevronDown />}>
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-2 py-2.5">
            <DropdownMenuItem
              className="w-full flex items-center justify-start gap-3 text-button-m cursor-pointer"
              onClick={openContactDialog}
            >
              <User size={18} className="text-blackberry-400" />
              Add single contact
            </DropdownMenuItem>
            <DropdownMenuItem
              className="w-full flex items-center justify-start gap-3 text-button-m cursor-pointer"
              onClick={openImportDialog}
            >
              <Import size={18} className="text-blackberry-400" />
              Import
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
            <Accordion type="single" collapsible className="w-full px-2">
              <AccordionItem value="lists" className="w-full border-b-0">
                <AccordionTrigger className="w-full !h-[30px] py-1.5 px-0 flex items-center font-normal hover:no-underline justify-between gap-3 text-base cursor-pointer">
                  <div className="flex items-center justify-start gap-3">
                    <Plus size={18} className="text-blackberry-400" />
                    Add to list
                  </div>
                  <ChevronDown size={18} className="text-blackberry-400" />
                </AccordionTrigger>
                <AccordionContent className="w-full flex flex-col items-start justify-start gap-2 max-w-full truncate pt-2 pb-0">
                  <Button
                    variant="success"
                    icon={<Check size={10} className="leading-none" />}
                    iconPosition="left"
                    size="tag"
                  >
                    Newsletter
                  </Button>
                  <Button variant="tag" size="tag">
                    Admin
                  </Button>
                  <Button variant="tag" size="tag">
                    Cardholders
                  </Button>
                  <Button variant="tag" size="tag">
                    Developers
                  </Button>
                  <Button variant="tag" size="tag">
                    Free Plan
                  </Button>
                  <Button variant="tag" size="tag">
                    To Renew
                  </Button>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="sunglow" icon={<Filter />}>
          Filter
        </Button>
      </div>
      <AddContactDialog
        open={_openContactDialog}
        setOpen={setOpenContactDialog}
      />
      <ImportContactsDialog
        open={_openImportDialog}
        setOpen={setOpenImportDialog}
      />
    </>
  )
}

export default ContactControls
