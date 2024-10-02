'use client'

import { Filter, X } from 'lucide-react'
import React from 'react'

import { Button } from '@repo/ui/button'
import { Form, useForm, zodResolver } from '@repo/ui/form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/dialog'
import { Panel } from '@repo/ui/panel'
import type { ColumnFiltersState } from '@repo/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { Datum } from '@repo/types'
import { FilterFormSchema, FilterInput } from '@/utils/schemas'

import { filterDialogStyles } from './filter-dialog.styles'

type FilterDialogProps = {
  onFilter(input: ColumnFiltersState): void
  entityFilters: Record<string, Datum.Filter>
}

const FilterUserDialog = ({ onFilter, entityFilters }: FilterDialogProps) => {
  const [open, setOpen] = React.useState(false)
  const { column, dialogContent, filterContainer, filterTitle } =
    filterDialogStyles()
  const form = useForm<FilterInput>({
    resolver: zodResolver(FilterFormSchema),
    mode: 'onChange',
    defaultValues: {
      filters: {},
    },
  })

  const { handleSubmit, watch, setValue, reset } = form

  const { filters } = watch()

  function formatFilters(filters: FilterInput['filters']) {
    return Object.entries(filters).map(([field, { value }]) => ({
      id: field,
      value: value.value,
    }))
  }

  function handleFilter(field: string, operator: Datum.OPERATOR, value: any) {
    setValue(`filters.${field}`, { operator, value })
  }

  function deleteFilter(field: string) {
    const newFilters = { ...filters }
    delete newFilters[field]

    reset({ filters: newFilters })
    onFilter(formatFilters(newFilters))
  }

  function onSubmit(data: FilterInput) {
    onFilter(formatFilters(data.filters))
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="sunglow" icon={<Filter />}>
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80vw] xl:max-w-6xl">
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className={dialogContent()}>
            <Panel className="bg-winter-sky-700 p-5" gap={2}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col gap-4">
                  <h4 className="type-smallcaps-s">Selected Filters</h4>
                  <div className="w-full flex flex-wrap gap-2">
                    {Object.keys(filters).length > 0 ? (
                      Object.entries(filters).map(
                        ([field, { value }], index) => {
                          const details = entityFilters[field]

                          if (!details) return null

                          const { title, options } = details
                          const valueKey = options?.find(
                            ({ value: optionValue }) =>
                              value.value === optionValue,
                          )?.key

                          return (
                            <div
                              key={`${valueKey}-${index}`}
                              className="flex flex-row items-center gap-1 border rounded border-blackberry-600 text-body-xs px-2 py-1"
                            >
                              {title}: {valueKey}
                              <Button
                                variant="blackberryXs"
                                size="xs"
                                onClick={() => deleteFilter(field)}
                              >
                                <X className="!h-3 !w-3" />
                              </Button>
                            </div>
                          )
                        },
                      )
                    ) : (
                      <span className="text-body-xs">None</span>
                    )}
                  </div>
                </div>
                {Object.keys(filters).length > 0 && (
                  <Button onClick={handleSubmit(onSubmit)}>Apply</Button>
                )}
              </div>
            </Panel>
            <div className={filterContainer()}>
              <div className={column()}>
                <h4 className={filterTitle()}>Users</h4>
                <div className="flex flex-col gap-1 justify-start items-start">
                  {Object.entries(entityFilters).map(
                    ([key, details], index) => {
                      const filterValue = Object.keys(filters).find(
                        (field) => field === key,
                      )
                      const hasValue = filterValue !== undefined
                      const { icon: Icon, operator, options } = details

                      return (
                        <DropdownMenu key={index}>
                          <DropdownMenuTrigger className="flex flex-row items-center justify-start gap-2">
                            <div className="relative w-6">
                              {hasValue && (
                                <div className="absolute -top-0.5 left-3 h-2 w-2 shrink-0 rounded-full bg-sunglow-900" />
                              )}
                              {
                                <Icon
                                  size={18}
                                  className="text-blackberry-400"
                                />
                              }
                            </div>
                            {details.title}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="start"
                            side="bottom"
                            className="p-1"
                          >
                            {options &&
                              options.length > 1 &&
                              options.map((option, index) => (
                                <DropdownMenuItem
                                  key={option.key}
                                  className="p-3 cursor-pointer hover:bg-winter-sky-800"
                                  onClick={() =>
                                    handleFilter(key, operator, option)
                                  }
                                >
                                  {option.key}
                                </DropdownMenuItem>
                              ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )
                    },
                  )}
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default FilterUserDialog
