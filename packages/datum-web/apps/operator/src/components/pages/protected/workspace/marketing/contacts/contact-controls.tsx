'use client'

import { Button } from '@repo/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { Check, ChevronDown, Filter, Import, Search } from 'lucide-react'
import AddContactDialog from './contact-add-dialog'
import { Dialog } from '@repo/ui/dialog'

type ContactControlsProps = {
  searchOpen: boolean
  toggleSearch(): void
}

const ContactControls = ({
  searchOpen,
  toggleSearch,
}: ContactControlsProps) => {
  // const [openContactDialog, setOpenContactDialog] = useState(false)
  // console.log('ISOPEN', openContactDialog)

  return (
    <Dialog>
      <div className="flex justify-start items-stretch gap-[18px]">
        <Button variant="outline" onClick={toggleSearch}>
          <Search />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" icon={<ChevronDown />}>
              Add
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-2 py-2.5">
            <DropdownMenuItem className="w-full" asChild>
              <AddContactDialog />
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="w-full flex items-center justify-start gap-3 text-base cursor-pointer">
                <Import size={18} className="text-blackberry-400" />
                Import
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" icon={<ChevronDown />}>
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-2 py-2.5">
            <DropdownMenuItem>
              <div className="w-full flex items-center justify-start gap-3 text-base cursor-pointer">
                <Import
                  size={18}
                  className="text-blackberry-400 transform rotate-180"
                />
                Export all
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <div className="w-full flex items-center justify-start gap-3 text-base cursor-pointer">
                <Check size={18} className="text-blackberry-400" />
                Select all
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="sunglow" icon={<Filter />}>
          Filter
        </Button>
      </div>
    </Dialog>
  )
}

export default ContactControls
