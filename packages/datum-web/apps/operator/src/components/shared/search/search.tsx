import { Button } from '@repo/ui/button'
import { Input } from '@repo/ui/input'
import { Search as SearchIcon } from 'lucide-react'

import { searchStyles } from './search.styles'
import { Form, useForm, zodResolver } from '@repo/ui/form'
import { SearchFormInput, SearchFormSchema } from '@/utils/schemas'

type SearchProps = {
  onSearch(query: string): void
}

export default function Search({ onSearch }: SearchProps) {
  const { container, input, button } = searchStyles()
  const form = useForm<SearchFormInput>({
    mode: 'onSubmit',
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      query: '',
    },
  })

  const { watch, handleSubmit, register } = form

  function handleSearch(data: SearchFormInput) {
    onSearch(data?.query || '')
  }

  return (
    <div className={container()}>
      <Form {...form}>
        <form onSubmit={handleSubmit(handleSearch)}>
          <Input
            {...register('query')}
            placeholder="Search"
            className={input()}
          />
          <Button
            type="submit"
            size="xs"
            variant="blackberryXs"
            className={button()}
          >
            <SearchIcon />
          </Button>
        </form>
      </Form>
    </div>
  )
}
