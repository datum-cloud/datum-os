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
    <div className="relative bg-white flex gap-0 items-start justify-start rounded-md">
      <DebouncedInput
        value={query}
        type="search"
        onChange={searchQuery}
        placeholder="Search contacts"
        className={cn(
          'flex h-11 border transition-all transform duration-1000 w-0 rounded-md',
          openSearch
            ? 'w-56 translate-x-0 opacity-100 pr-11 border-blackberry-300'
            : 'w-0 translate-x-100 opacity-0 p-0 border-transparent',
        )}
      />
      <Button
        variant="blackberryXs"
        size="xs"
        className={cn(
          'h-11 w-11 shrink-0 border rounded-md',
          openSearch
            ? '!absolute z-10 top-0 right-0 border-transparent'
            : 'border-blackberry-300',
        )}
        icon={<Search />}
        iconPosition="left"
        onClick={handleSearch}
      />
    </div>
  )
}

export default ContactsSearch
