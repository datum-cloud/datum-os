import { useSession } from 'next-auth/react'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { pluralize } from '@repo/common/text'
import { OPERATOR_FILES } from '@repo/constants'
import { Button } from '@repo/ui/button'
import { downloadFromUrl } from '@repo/common/download'
import { Form, useForm, zodResolver } from '@repo/ui/form'
import { MultiSelect } from '@repo/ui/multi-select'
import { Panel, PanelHeader } from '@repo/ui/panel'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select'
import type { Datum } from '@repo/types'

import DragAndDrop from '@/components/shared/drag-and-drop/drag-and-drop'
import { Loading } from '@/components/shared/loading/loading'
import { useLists } from '@/hooks/useLists'
import { createContacts } from '@/query/contacts'
import { createListMembers } from '@/query/lists'
import { uploadCsv } from '@/utils/upload'
import {
  ContactBatchCreateInput,
  ContactBatchCreateSchema,
  ContactInput,
} from '@/utils/schemas'
import { useRouter } from 'next/navigation'
import { cn } from '@repo/ui/lib/utils'

import { pageStyles } from './page.styles'

const ContactsTabCSV = () => {
  const {
    submissionStateContainer,
    formInner,
    formBoxes,
    formColumnInfo,
    formFieldInfo,
    formSelect,
    formActions,
    formGroup,
    formHeader,
    formRow,
    panel,
    uploadContainer,
    uploadInner,
  } = pageStyles()
  const { refresh } = useRouter()
  const { data: session } = useSession()
  const organizationId = (session?.user.organization ??
    '') as Datum.OrganisationId
  const { data: lists = [] } = useLists(organizationId)
  const [data, setData] = useState<Datum.CsvData>([])
  const [subscriptions, setSubscriptions] = useState<Datum.ListId[]>([])
  const [associations, setAssociations] = useState<Record<string, string>>({})
  const form = useForm<ContactBatchCreateInput>({
    resolver: zodResolver(ContactBatchCreateSchema),
    defaultValues: {
      contacts: [],
    },
  })
  const {
    handleSubmit,
    formState: { isSubmitting, isSubmitted, isSubmitSuccessful },
  } = form
  const selectOptions = lists.map((list) => ({
    value: list.id,
    label: list.name,
  }))

  const CONTACT_FIELDS: Record<string, string> = {
    fullName: 'Full Name',
    email: 'Email',
    status: 'Status',
    title: 'Title',
    phoneNumber: 'Phone Number',
    company: 'Company',
    skip: 'Skip this column',
  }

  async function handleCSVUpload(files: File[]) {
    const formData = new FormData()
    formData.append('file', files[0])

    const contacts = await uploadCsv(formData)

    setData(contacts)
  }

  function handleFieldAssociation(rawField: string, field: string) {
    const newAssociations = { ...associations }

    if (field === 'skip') {
      delete newAssociations[rawField]
    } else {
      newAssociations[rawField] = field
    }

    setAssociations(newAssociations)
  }

  async function onSubmit() {
    try {
      const formattedContacts = data.map((contact: any) => {
        const output: Record<string, any> = {}

        for (const [rawField, field] of Object.entries(associations)) {
          const value = contact?.[rawField]
          output[field] = value
        }

        return output as ContactInput
      })

      const contacts = await createContacts(organizationId, formattedContacts)
      const contactsIds = contacts.map(({ id }) => id)

      if (subscriptions.length) {
        await Promise.all(
          subscriptions.map(async (subscription) => {
            await createListMembers(organizationId, subscription, contactsIds)
          }),
        )
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (data.length > 0) {
    const fields = Object.keys(data[0])

    if (isSubmitting) {
      return <Loading className="min-h-[300px]" />
    }

    if (isSubmitted) {
      if (isSubmitSuccessful) {
        return (
          <div className={submissionStateContainer()}>
            <CheckCircle />
            Successfully imported {data.length}{' '}
            {pluralize('contact', data.length)}
          </div>
        )
      } else {
        return (
          <div className={submissionStateContainer()}>
            <p>Whoops, something went wrong.</p>
            <Button onClick={() => refresh()}>Try again</Button>
          </div>
        )
      }
    }

    return (
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className={formInner()}>
          <Panel className={formGroup()}>
            <PanelHeader heading="Add to group" noBorder />
            <p>You can add new contacts to one or multiple groups</p>
            <MultiSelect
              options={selectOptions}
              onValueChange={(input) =>
                setSubscriptions(input as Datum.ListId[])
              }
              placeholder="Select lists to add contacts to"
              variant="inverted"
              animation={2}
            />
          </Panel>

          <Panel className={cn(formGroup(), 'mb-8')}>
            <PanelHeader heading="Match fields" noBorder />
            {fields.map((field, index) => (
              <div key={`${field}-${index}`} className={formRow()}>
                <div className={formColumnInfo()}>
                  <h6 className={formHeader()}>{field}</h6>
                  <div className={formBoxes()}>
                    {data.slice(0, 2).map((contact, index) => (
                      <p
                        key={`${contact}-${index}`}
                        className={cn(
                          'px-4 py-2 border',
                          index === 1
                            ? 'rounded-b-md'
                            : 'border-b-0 rounded-t-md',
                        )}
                      >
                        {contact[field]}
                      </p>
                    ))}
                  </div>
                </div>
                <div className={formFieldInfo()}>
                  <h6 className={formHeader()}>Belongs to</h6>
                  <Select
                    defaultValue="skip"
                    onValueChange={(input) =>
                      handleFieldAssociation(field, input)
                    }
                  >
                    <SelectTrigger className={formSelect()}>
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent sideOffset={2}>
                      {Object.entries(CONTACT_FIELDS).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
            <div className={formActions()}>
              <Button variant="outline" onClick={() => setData([])}>
                Cancel
              </Button>
              <Button className="w-auto" type="submit">
                Submit
              </Button>
            </div>
          </Panel>
        </form>
      </Form>
    )
  }

  return (
    <Panel className={panel()}>
      <PanelHeader heading="Import disclaimer" noBorder />
      <div className="flex flex-col gap-0">
        <p>
          We&#39;ll automatically clean up duplicate instances of email
          addresses from the list.
        </p>
        <p>
          Importing does not send any confirmation emails to your list. We trust
          that you&#39;ve already received permission.
        </p>
      </div>
      <PanelHeader heading="Import CSV File" noBorder />
      <div className={uploadContainer()}>
        <div className={uploadInner()}>
          <DragAndDrop
            confirmationText="Import contacts"
            entityName="contact"
            onConfirm={handleCSVUpload}
          />

          <Button
            variant="sunglowXs"
            size="xs"
            className="underline"
            onClick={() =>
              downloadFromUrl(
                OPERATOR_FILES.contactsTemplate.name,
                OPERATOR_FILES.contactsTemplate.url,
              )
            }
          >
            Download our pre-formatted CSV
          </Button>
        </div>
        {/* NOTE: Temporarily hiding in favour of tabs */}
        {/* <div className="flex flex-col gap-5 border border-butter-900 bg-butter-800 rounded-lg p-9">
          <p className="text-peat-800 dark:text-sunglow-900 leading-6">
            There are additional ways of importing contacts into Datum OS:
          </p>
          <ul className="list-disc list-inside text-peat-800 leading-[23.6px]">
            <li>
              <Link href="/" className="underline">
                Create a form
              </Link>
            </li>
            <li>
              <Link href="/" className="underline">
                Import via Integration
              </Link>
            </li>
            <li>
              <Link href="/" className="underline">
                Use the API
              </Link>
            </li>
          </ul>
        </div> */}
      </div>
    </Panel>
  )
}

export default ContactsTabCSV
