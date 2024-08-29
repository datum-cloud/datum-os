'use client'

import React from 'react'
import { ChevronDown, Download, Filter, Search, User } from 'lucide-react'

import { Button } from '@repo/ui/button'
import PageTitle from '@/components/page-title'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'

import { ContactsTable } from './contacts-table'

const ContactsPage: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-stretch justify-between">
        <PageTitle title="Contacts" />
        <div className="flex justify-start items-stretch gap-[18px]">
          {/* <div className={membersSearchRow()}>
            <div className={membersSearchField()}>
            <Input
                placeholder="Search for user"
                value={searchTerm}
                onChange={handleSearch}
            />
            </div>
        </div> */}
          <Button variant="outlineLight">
            <Search />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outlineLight" icon={<ChevronDown />}>
                Add
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Button onClick={() => console.log('Open modal')}>
                  <User />
                  Add Single Contact
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button onClick={() => console.log('Open modal')}>
                  <Download />
                  Import
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outlineLight" icon={<ChevronDown />}>
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Item A</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="sunglow" icon={<Filter />}>
            Filter
          </Button>
        </div>
      </div>
      <ContactsTable />
    </div>
  )
}

export default ContactsPage
