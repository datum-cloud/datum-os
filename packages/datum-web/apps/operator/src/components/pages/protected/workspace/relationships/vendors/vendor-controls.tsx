// 'use client'

// import { useRouter } from 'next/navigation'
// import { useSession } from 'next-auth/react'
// import { useState } from 'react'
// import {
//   ChevronDown,
//   Import,
//   Trash,
// } from 'lucide-react'

// import { OPERATOR_APP_ROUTES } from '@repo/constants'
// import { Button } from '@repo/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@repo/ui/dropdown-menu'
// import type { ColumnFiltersState } from '@repo/ui/data-table'
// import type { Datum } from '@repo/types'

// import Search from '@/components/shared/table-search/table-search'
// import FilterDialog from '@/components/shared/filter-dialog/filter-dialog'
// import { useVendors } from '@/hooks/useLists'
// import { CONTACT_FILTERS } from '@/utils/filters'

// import VendorFormDialog from './vendors-form-dialog'
// import { pageStyles } from './page.styles'

// type VendorsControlsProps = {
//   search(query: string): void
//   onDelete(): void
//   onExport(): void
//   onFilter(columnFilters: ColumnFiltersState): void
//   selectedVendors: Datum.Vendor[]
// }

// const VendorsControls = ({
//   search,
//   onDelete,
//   onExport,
//   onFilter,
//   selectedVendors,
// }: VendorsControlsProps) => {
//   const router = useRouter()
//   const {
//     contactControls,
//     contactDropdownItem,
//     contactDropdownIcon,
//     loadingSpinner,
//   } = pageStyles()
//   const [openVendorDialog, _setOpenVendorDialog] = useState(false)
//   const [openActionsMenu, setOpenActionsMenu] = useState(false)

//   function setOpenVendorDialog(input: boolean) {
//     _setOpenVendorDialog(input)
//     // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
//     setTimeout(() => (document.body.style.pointerEvents = ''), 500)
//   }

const VendorControls = () => {
  return (
    <>
      {/* <div className={contactControls()}>
        <Search
          compact
          alignment="right"
          placeholder="Search contacts"
          search={search}
        />
        <Button
          variant="outline"
          icon={<ChevronDown />}
          onClick={() => setOpenVendorDialog(true)}
        >
          Add
        </Button>
        <DropdownMenu open={openActionsMenu} onOpenChange={setOpenActionsMenu}>
          <DropdownMenuTrigger asChild onClick={() => setOpenActionsMenu(true)}>
            <Button variant="outline" icon={<ChevronDown />}>
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-2 py-2.5">
            <DropdownMenuItem
              onClick={onExport}
              className={contactDropdownItem()}
            >
              <Import
                size={18}
                className="text-blackberry-400 transform rotate-180"
              />
              Export
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              disabled={selectedVendors.length === 0}
              className={contactDropdownItem()}
            >
              <Trash size={18} className={contactDropdownIcon()} />
              Delete items
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <FilterDialog onFilter={onFilter} entityFilters={CONTACT_FILTERS} />
      </div>
      <VendorFormDialog open={openVendorDialog} setOpen={setOpenVendorDialog} /> */}
    </>
  )
}

export default VendorControls
