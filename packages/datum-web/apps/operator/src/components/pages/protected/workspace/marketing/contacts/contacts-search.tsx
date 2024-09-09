import { Search } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@repo/ui/button'
import { Input } from '@repo/ui/input'
import { cn } from '@repo/ui/lib/utils'
import { Form, useForm, zodResolver } from '@repo/ui/form'

import { SearchFormInput, SearchFormSchema } from '@/utils/schemas'

type ContactsSearchProps = {
  search(input: string): void
}

const ContactsSearch = ({ search }: ContactsSearchProps) => {
  const [openSearch, setOpenSearch] = useState(false)
  const form = useForm<SearchFormInput>({
    mode: 'onSubmit',
    resolver: zodResolver(SearchFormSchema),
  })
  const { handleSubmit, register } = form

  function handleSearch() {
    if (!openSearch) {
      setOpenSearch(true)
    }
  }

  function onSubmit(data: SearchFormInput) {
    search(data?.query || '')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative bg-white flex gap-0 items-start justify-start rounded-md"
      >
        <Input
          {...register('query')}
          type="search"
          placeholder="Search contacts"
          className={cn(
            'flex h-11 border transition-all transform duration-1000 w-0 rounded-md',
            openSearch
              ? 'w-56 translate-x-0 opacity-100 pr-11 border-blackberry-300'
              : 'w-0 translate-x-100 opacity-0 p-0 border-transparent',
          )}
        />
        <Button
          type={openSearch ? 'submit' : 'button'}
          variant="blackberryXs"
          size="xs"
          className={cn(
            'h-11 w-11 shrink-0 border rounded-md',
            openSearch
              ? '!absolute z-10 top-0 right-0 border-transparent'
              : 'border-blackberry-300',
          )}
          onClick={handleSearch}
        >
          <Search />
        </Button>
      </form>
    </Form>
  )
}

export default ContactsSearch
