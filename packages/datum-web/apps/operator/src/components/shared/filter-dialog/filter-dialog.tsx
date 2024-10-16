'use client'

import { Filter, X } from 'lucide-react'
import React from 'react'

import { Datum } from '@repo/types'
import { Button } from '@repo/ui/button'
import type { ColumnFiltersState } from '@repo/ui/data-table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@repo/ui/dialog'
import { Form, useForm, zodResolver } from '@repo/ui/form'
import { Input } from '@repo/ui/input'
import { Panel } from '@repo/ui/panel'
import { Popover, PopoverContent, PopoverTrigger } from '@repo/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui/select'

import { FilterFormSchema, FilterInput } from '@/utils/schemas'

import { filterDialogStyles } from './filter-dialog.styles'

type FilterDialogProps = {
  groupTitle: string
  onFilter(input: ColumnFiltersState): void
  filterList: Record<string, Datum.FilterMenuItem>
}

const FilterUserDialog = ({
  groupTitle,
  onFilter,
  filterList,
}: FilterDialogProps) => {
  const [open, setOpen] = React.useState(false)
  const { column, dialogContent, filterContainer, filterTitle } =
    filterDialogStyles()
  const form = useForm<FilterInput>({
    resolver: zodResolver(FilterFormSchema),
    mode: 'onChange',
    defaultValues: {
      filters: {}, // Record<string, { operator: Datum.OperatorType, value: any }>
    },
  })

  const { handleSubmit, watch, setValue, reset } = form

  const { filters } = watch()

  function formatFilters(input: FilterInput['filters']) {
    return Object.entries(input).map(([field, { operator, value }]) => ({
      id: field,
      operator,
      value,
    }))
  }

  function handleFilter(
    field: string,
    operator: Datum.OperatorType,
    value: any,
  ) {
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
          <DialogDescription />
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
                        ([field, { operator, value }], index) => {
                          const details = filterList[field]

                          if (!details) return null

                          const currentOperator = details.operators.find(
                            (op) => op.key === operator,
                          )
                          const valueKey =
                            currentOperator?.options?.find(
                              ({ value: optionValue }) => value === optionValue,
                            )?.key || value

                          return (
                            <div
                              key={`${value}-${index}`}
                              className="flex flex-row items-center gap-1 border rounded border-blackberry-600 dark:border-peat-800 text-body-xs px-2 py-1"
                            >
                              {currentOperator?.title || field}: {valueKey}
                              <Button
                                variant="blackberryXs"
                                size="xs"
                                onClick={() => deleteFilter(field)}
                              >
                                <X className="!h-3 !w-3 pt-[2px]" />
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
                <h4 className={filterTitle()}>{groupTitle}</h4>
                <div className="flex flex-col gap-1 justify-start items-start">
                  {Object.entries(filterList).map(([key, details], index) => {
                    const isFilterApplied = filters[key] !== undefined
                    const filterValue = filters[key]?.value
                    const { icon: Icon, operators } = details
                    const operator =
                      operators.find(
                        (op) => op.key === filters[key]?.operator,
                      ) || operators[0]
                    const operatorOptions = operator?.options
                    const title = filterList[key].title || key

                    return (
                      <Popover key={index}>
                        <PopoverTrigger className="flex flex-row items-center justify-start gap-2">
                          <div className="relative w-6">
                            {isFilterApplied && (
                              <div className="absolute -top-0.5 left-3 h-2 w-2 shrink-0 rounded-full bg-sunglow-900" />
                            )}
                            {<Icon size={18} className="text-blackberry-400" />}
                          </div>
                          {title}
                        </PopoverTrigger>
                        <PopoverContent
                          align="start"
                          side="bottom"
                          className="p-1 w-full"
                        >
                          <div className="flex gap-4 items-center justify-start p-3 cursor-pointer">
                            <Select
                              onValueChange={(value) => {
                                handleFilter(
                                  key,
                                  value as Datum.OperatorType,
                                  undefined,
                                )
                              }}
                              defaultValue={
                                filters[key]?.operator || operators[0].key
                              }
                            >
                              <SelectTrigger
                                className="min-w-48"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <SelectValue placeholder="Select..." />
                              </SelectTrigger>
                              <SelectContent>
                                {operators.map((op) => (
                                  <SelectItem
                                    key={op.key}
                                    value={op.key}
                                    className="cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {op.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {operatorOptions && operatorOptions.length > 0 ? (
                              <Select
                                onValueChange={(value) => {
                                  handleFilter(key, operator.key, value)
                                }}
                                defaultValue={filterValue}
                              >
                                <SelectTrigger
                                  className="min-w-48"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {operatorOptions.map((option) => (
                                    <SelectItem
                                      key={option.value}
                                      value={option.value}
                                      className="cursor-pointer"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {option.key}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                onChange={(e) => {
                                  handleFilter(
                                    key,
                                    operator.key,
                                    e.target.value,
                                  )
                                  return e.target.value
                                }}
                                className="h-10 text-body-sm min-w-48"
                                onClick={(e) => e.stopPropagation()}
                              />
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )
                  })}
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
