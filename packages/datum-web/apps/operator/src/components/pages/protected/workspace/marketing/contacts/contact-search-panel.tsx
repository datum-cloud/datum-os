import { Input } from '@repo/ui/input'
import { Panel } from '@repo/ui/panel'
import { Select } from '@repo/ui/select'

import { pageStyles } from './page.styles'

type ContactSearchPanelProps = {
  searchTerm: string
  setSearchTerm(input: string): void
}

const ContactSearchPanel = ({
  searchTerm,
  setSearchTerm,
}: ContactSearchPanelProps) => {
  const { contactsSearchRow, contactsSearchField } = pageStyles()

  function handleSearchTerm(event: React.ChangeEvent<HTMLInputElement>) {
    const term = event.target?.value || ''
    setSearchTerm(term)
  }
  return (
    <Panel>
      <div className={contactsSearchRow()}>
        <div className={contactsSearchField()}>
          <Select></Select>
          <Input
            placeholder="Type to start filtering"
            value={searchTerm}
            onChange={handleSearchTerm}
          />
        </div>
      </div>
    </Panel>
  )
}

export default ContactSearchPanel
