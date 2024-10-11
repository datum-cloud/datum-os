'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { getPathWithParams } from '@repo/common/routes'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Datum } from '@repo/types'
import { Button } from '@repo/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
  zodResolver,
} from '@repo/ui/form'
import { Input } from '@repo/ui/input'

import { Loading } from '@/components/shared/loading/loading'
import { useAsyncFn } from '@/hooks/useAsyncFn'
import { createVendors } from '@/query/vendors'
import { VendorInput, VendorSchema } from '@/utils/schemas'

import { formStyles } from './page.styles'

type ContactDialogFormProps = {
  open: boolean
  setOpen(input: boolean): void
}

const VendorsFormDialog = ({ open, setOpen }: ContactDialogFormProps) => {
  const router = useRouter()
  const {
    form: formStyle,
    fieldsContainer,
    labelContainer,
    requiredText,
  } = formStyles()
  const [{ loading, error }, create] = useAsyncFn(createVendors)
  const { data: session } = useSession()
  const organizationId =
    session?.user.organization ?? ('' as Datum.OrganisationId)

  const form = useForm<VendorInput>({
    resolver: zodResolver(VendorSchema),
    mode: 'onChange',
  })

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = form
  const isValid = Object.keys(errors).length === 0

  async function onSubmit(data: VendorInput) {
    let id: string | undefined

    const vendors = await create(organizationId, [data])
    id = vendors[0].id
    await router.push(getPathWithParams(OPERATOR_APP_ROUTES.vendor, { id }))

    // NOTE: This is needed to close the dialog on navigation per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  function handleCancel() {
    setOpen(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a vendor</DialogTitle>
          <DialogClose onClick={handleCancel} />
        </DialogHeader>
        {loading && <Loading className="min-h-96" />}
        {error && <p>Whoops... something went wrong</p>}
        {!loading && (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className={formStyle()}>
              <div className={fieldsContainer()}>
                {/* <FormField
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={labelContainer()}>
                        Email
                        <span className={requiredText()}>Required</span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                /> */}
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
                    Add vendor
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

export default VendorsFormDialog
