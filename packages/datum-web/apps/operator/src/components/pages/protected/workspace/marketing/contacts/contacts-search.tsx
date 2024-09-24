import { Search } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@repo/ui/button'
import { DebouncedInput } from '@repo/ui/input'
import { cn } from '@repo/ui/lib/utils'

type ContactsSearchProps = {
  search(input: string): void
}

const ContactsSearch = ({ search }: ContactsSearchProps) => {
  const [openSearch, setOpenSearch] = useState(false)
  const [query, setQuery] = useState('')

  function handleSearch() {
    if (!openSearch) {
      setOpenSearch(true)
    }
  }

  function searchQuery(input: string | number) {
    const searchTerm = String(input)
    setQuery(searchTerm)
    search(searchTerm)
  }

  return (
    <div
      className={cn(
        'h-11 relative bg-white flex gap-0 items-start justify-start dark:bg-peat-900 rounded-md border border-blackberry-400',
        openSearch ? 'w-auto' : 'w-11',
      )}
    >
      <DebouncedInput
        value={query}
        type="search"
        onChange={searchQuery}
        placeholder="Search contacts"
        className={cn(
          'flex h-[42px] transition-all transform duration-1000 w-0 rounded-md border-none dark:text-white',
          openSearch
            ? 'w-56 translate-x-0 opacity-100 pr-11'
            : 'w-0 translate-x-100 opacity-0 p-0',
        )}
      />
      <Button
        variant="blackberryXs"
        size="xs"
        className={cn(
          'h-[42px] aspect-square shrink-0 rounded-md',
          openSearch ? '!absolute top-0 right-0' : '',
        )}
        icon={<Search className="dar:text-white" />}
        iconPosition="left"
        onClick={handleSearch}
      />
    </div>
  )
}

export default ContactsSearch
