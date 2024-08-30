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

import { Datum } from '@repo/types'

import { ContactsTable } from './contacts-table'
import { Input } from '@repo/ui/input'
import { useSession } from 'next-auth/react'
import { useContactList } from '@repo/service-api/client'

const ContactsPage: React.FC = () => {
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)

  const {
    data: contacts = [],
    error,
    isLoading,
  } = useContactList(organizationId)

  const [filteredContacts, setFilteredContacts] =
    useState<Datum.Contact[]>(contacts)
  console.log('Contacts FILTERED', contacts)
  const { contactsSearchRow, contactsSearchField } = pageStyles()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.toLowerCase()
    setSearchTerm(searchValue)

    if (contacts) {
      // TODO: Filter contacts properly...
      const filtered = contacts.filter((contact) => !!contact)

      setFilteredContacts(filtered)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-stretch justify-between">
        <PageTitle title="Contacts" />
        <div className="flex justify-start items-stretch gap-[18px]">
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
      {!error && !isLoading && <ContactsTable contacts={contacts} />}
    </div>
  )
}

export default ContactsPage
