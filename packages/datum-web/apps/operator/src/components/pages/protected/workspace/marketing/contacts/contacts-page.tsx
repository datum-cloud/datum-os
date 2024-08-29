'use client'

import React, { useState } from 'react'
import { ChevronDown, Download, Filter, Search, User } from 'lucide-react'

import { Button } from '@repo/ui/button'
import PageTitle from '@/components/page-title'

import { pageStyles } from './page.styles'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'

import { Datum } from "@repo/types";

import { ContactsTable } from './contacts-table'
import { Input } from '@repo/ui/input'
import { useSession } from 'next-auth/react'

const ContactsPage: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { data: session } = useSession()
  const [filteredContacts, setFilteredContacts] = useState<Datum.Contact[]>([])
  const { contactsSearchRow, contactsSearchField } = pageStyles()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase()
    setSearchTerm(searchValue)

    // if (data?.organization?.members) {
    //   const filtered = data.organization.members.filter(
    //     ({ user: { firstName, lastName } }) => {
    //       const fullName = `${firstName?.toLowerCase() ?? ''} ${lastName?.toLowerCase() ?? ''}`
    //       return fullName.includes(searchValue)
    //     },
    //   )
    //   setFilteredContacts(filtered)
    // }
  }

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
          <Button
            variant="outlineLight"
            onClick={() => setShowSearch(!showSearch)}
          >
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
      {showSearch && (
        <div className={contactsSearchRow()}>
          <div className={contactsSearchField()}>
            <Input
              placeholder="Search for user"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          {/* <div className={membersButtons()}>
            <Button
              icon={<PlusIcon />}
              iconPosition="left"
              onClick={() => setActiveTab('invites')}
            >
              Send an invite
            </Button>
          </div> */}
        </div>
      )}
      {/* {!error && !fetching && <ContactsTable contacts={filteredContacts} />} */}
      {<ContactsTable contacts={filteredContacts} />}
    </div>
  )
}

export default ContactsPage
