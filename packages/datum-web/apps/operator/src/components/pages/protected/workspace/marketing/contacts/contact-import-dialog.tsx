import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import { Label } from '@repo/ui/label'
import { Input } from '@repo/ui/input'
import { Button } from '@repo/ui/button'

const ImportContactsDialog = () => {
  return (
    <>
      <DialogHeader>
        <DialogTitle>Import contacts</DialogTitle>
      </DialogHeader>
      <div className="w-full flex flex-col gap-6">
        <div className="w-full flex flex-col justify-start gap-2.5">
          <div className="w-full flex items-center justify-between">
            <Label htmlFor="email">Email</Label>
            <span className="type-smallcaps-s text-blackberry-500">
              Required
            </span>
          </div>
          <Input id="email" />
        </div>
        <div className="w-full flex flex-col justify-start gap-2.5">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" />
        </div>
        <div className="w-full flex flex-col justify-start gap-2.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" />
        </div>
      </div>
      <DialogFooter className="flex gap-5">
        <Button full className="w-2/3" type="submit">
          Add contact
        </Button>
        <Button type="button" className="w-1/3 ml-0" variant="outline">
          Cancel
        </Button>
      </DialogFooter>
    </>
  )
}

export default ImportContactsDialog
