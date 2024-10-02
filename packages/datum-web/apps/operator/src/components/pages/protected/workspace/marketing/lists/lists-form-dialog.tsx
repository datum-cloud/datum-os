'use client'

import { useSession } from 'next-auth/react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import { Input } from '@repo/ui/input'
import { Button } from '@repo/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
  zodResolver,
} from '@repo/ui/form'
import { ListInput, ListSchema } from '@/utils/schemas'
import { Datum } from '@repo/types'
import { createLists, editLists } from '@/query/lists'

import { formStyles } from './page.styles'
import { useRouter } from 'next/navigation'
import { getPathWithParams } from '@repo/common/routes'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { useAsyncFn } from '@/hooks/useAsyncFn'
import { Loading } from '@/components/shared/loading/loading'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select'
import { Error } from '@/components/shared/error/error'
import { useEffect } from 'react'

type ListDialogFormProps = {
  open: boolean
  setOpen(input: boolean): void
  list?: Datum.List
}

const ListsFormDialog = ({ list, open, setOpen }: ListDialogFormProps) => {
  const isNew = !list || !list.id
  const router = useRouter()
  const {
    form: formStyle,
    fieldsContainer,
    labelContainer,
    requiredText,
    selectItem,
  } = formStyles()
  const [{ error: errorCreate }, create] = useAsyncFn(createLists)
  const [{ error: errorEdit }, edit] = useAsyncFn(editLists)
  const error = errorEdit || errorCreate
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)

  const form = useForm<ListInput>({
    resolver: zodResolver(ListSchema),
    mode: 'onChange',
    defaultValues: {
      name: list?.name || '',
      description: list?.description || '',
      visibility: list?.visibility || 'PUBLIC',
    },
  })

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = form
  const isValid = Object.keys(errors).length === 0

  useEffect(() => {
    if (open) {
      reset({
        name: list?.name || '',
        description: list?.description || '',
        visibility: list?.visibility || 'PUBLIC',
      })
    }
  }, [open, list, reset])

  async function onSubmit(data: ListInput) {
    let id: string | undefined

    if (isNew) {
      const lists = await create(organizationId, [data])
      id = lists[0]?.id
      await router.push(
        getPathWithParams(OPERATOR_APP_ROUTES.contactList, { id }),
      )
      // NOTE: Needed to prevent the dialog closing prematurely
      handleCancel()
    } else {
      await edit(organizationId, [{ ...list, ...data }])
      id = list.id
      handleCancel()
    }
  }

  function handleCancel() {
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? 'Add a list' : 'Edit list info'}</DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        {isSubmitting || isSubmitted ? (
          <Loading className="min-h-96" />
        ) : error ? (
          <Error />
        ) : (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className={formStyle()}>
              <div className={fieldsContainer()}>
                <FormField
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelContainer()}>
                        Name
                        <span className={requiredText()}>Required</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="visibility"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility</FormLabel>
                      <FormControl>
                        <Select
                          {...field}
                          defaultValue={field.value || ''}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent sideOffset={2}>
                            <SelectItem value="PUBLIC" className={selectItem()}>
                              Public
                            </SelectItem>
                            <SelectItem
                              value="PRIVATE"
                              className={selectItem()}
                            >
                              Private
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="flex gap-5">
                <DialogClose
                  asChild
                  disabled={!isValid}
                  onClick={handleSubmit(onSubmit)}
                >
                  <Button
                    type="button"
                    disabled={!isValid}
                    full
                    className="w-2/3"
                  >
                    {isNew ? 'Add list' : 'Save'}
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={handleCancel}
                  className="w-1/3 ml-0"
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ListsFormDialog
