import { ColumnDef } from '@tanstack/react-table'

import { Input } from '@repo/ui/input'
import { Panel } from '@repo/ui/panel'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select'
import { Datum } from '@repo/types'

import { pageStyles } from './page.styles'

type ContactSearchPanelProps = {
  columns: ColumnDef<Datum.Contact>[]
  query: string
  setQuery(input: string): void
}

const ContactSearchPanel = ({
  columns,
  query,
  setQuery,
}: ContactSearchPanelProps) => {
  const { contactsSearchRow, contactSearchSelect } = pageStyles()
  const fields = ['Email', 'Name', '']
  const operators = [
    'contains',
    'does not contain',
    'starts with',
    'ends with',
    'greater than',
    'less than',
  ]

  function handleSearchTerm(event: React.ChangeEvent<HTMLInputElement>) {
    const term = event.target?.value || ''
    setQuery(term)
  }
  return (
    <Panel>
      <div className={contactsSearchRow()}>
        <Select defaultValue="email">
          <SelectTrigger className={contactSearchSelect()}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectGroup>
              {fields.map((field) => (
                <SelectItem value={field} className="capitalize text-base">
                  {field}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select defaultValue="contains">
          <SelectTrigger className={contactSearchSelect()}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectGroup>
              {operators.map((operator) => (
                <SelectItem value={operator} className="capitalize text-base">
                  {operator}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="w-full">
          <Input
            placeholder="Type to start filtering"
            value={query}
            className="w-full flex-grow"
            onChange={handleSearchTerm}
          />
        </div>
      </div>
    </Panel>
  )
}

export default ContactSearchPanel
