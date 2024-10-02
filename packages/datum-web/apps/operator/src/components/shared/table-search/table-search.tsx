import { Search as SearchIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@repo/ui/button'
import { DebouncedInput } from '@repo/ui/input'
import { cn } from '@repo/ui/lib/utils'

import { searchStyles } from './table-search.styles'

type SearchProps = {
  search(input: string): void
  placeholder?: string
  compact?: boolean
  alignment?: 'left' | 'right'
}

const Search = ({
  compact = false,
  alignment = 'left',
  search,
  placeholder = 'Search',
}: SearchProps) => {
  const { container, input, button } = searchStyles()
  const [openSearch, setOpenSearch] = useState(!compact)
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
        container(),
        openSearch ? 'w-auto' : 'w-11',
        alignment === 'right' && 'flex-row-reverse',
      )}
    >
      <DebouncedInput
        value={query}
        type="search"
        onChange={searchQuery}
        placeholder={placeholder}
        className={cn(
          input(),
          openSearch
            ? 'w-64 translate-x-0 opacity-100'
            : 'w-0 translate-x-100 opacity-0 p-0',
          alignment === 'right' && openSearch && 'pr-11',
          alignment === 'left' && openSearch && 'pl-11',
        )}
      />
      <Button
        variant="blackberryXs"
        size="xs"
        className={cn(
          button(),
          openSearch ? '!absolute top-0' : '',
          alignment === 'right' ? 'right-0' : 'left-0',
        )}
        icon={<SearchIcon className="dar:text-white" />}
        iconPosition="left"
        onClick={handleSearch}
      />
    </div>
  )
}

export default Search
