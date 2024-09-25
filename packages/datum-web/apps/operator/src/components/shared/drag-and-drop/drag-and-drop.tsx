import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react'
import { CheckCircle, Upload, X } from 'lucide-react'

import { pluralize } from '@repo/common/text'
import { Button } from '@repo/ui/button'
import { cn } from '@repo/ui/lib/utils'

import { Loading } from '@/components/shared/loading/loading'
import { useAsyncFn } from '@/hooks/useAsyncFn'

import { dragAndDropStyles } from './drag-and-drop.styles'

type DragAndDropProps = {
  onConfirm(files: File[]): Promise<any>
  onSelect?(files: File[]): void
  className?: string
  confirmationText?: string
  entityName?: string
}

const DragAndDrop = ({
  onSelect,
  onConfirm,
  confirmationText = 'Upload Files',
  entityName = 'file',
  className,
}: DragAndDropProps) => {
  const {
    section,
    container,
    placeholder,
    placeholderText,
    link,
    fileContainer,
    fileContainerInner,
    fileRow,
    fileCancel,
    fileError,
    fileSuccess,
  } = dragAndDropStyles()
  const [files, setFiles] = useState<File[]>([])
  const [{ data, error, loading }, confirm] = useAsyncFn(onConfirm)

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const newFiles = Array.from(selectedFiles)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  function handleDrop(event: DragEvent) {
    event.preventDefault()

    const droppedFiles = event.dataTransfer.files
    if (droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles)
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
    }
  }

  function handleRemoveFile(index: number) {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  }

  useEffect(() => {
    onSelect?.(files)
  }, [files, onSelect])

  function handleConfirmation() {
    confirm(files)
    setFiles([])
  }

  return (
    <section className={cn(section(), className)}>
      <div
        className={container()}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        {loading && <Loading />}
        {!loading && error && (
          <div className={fileError()}>
            <p>Whoops, something went wrong.</p>
            <Button onClick={() => setFiles([])}>Try again</Button>
          </div>
        )}
        {!loading && !error && !!data && (
          <div className={fileSuccess()}>
            <CheckCircle />
            Successfully imported {data.length}{' '}
            {pluralize(entityName, data.length)}
          </div>
        )}
        {!loading && !error && !data && (
          <>
            {files.length < 1 ? (
              <div className={placeholder()}>
                <Upload size={48} />
                <div className={placeholderText()}>
                  <p>Drag your CSV file in here, or </p>
                  <input
                    type="file"
                    hidden
                    id="browse"
                    disabled={files.length > 0}
                    onChange={handleFileChange}
                    accept=".csv"
                  />
                  <label htmlFor="browse" className={link()}>
                    select it manually.
                  </label>
                </div>
              </div>
            ) : (
              <div className={fileContainer()}>
                <div className={fileContainerInner()}>
                  {files.map((file, index) => (
                    <div className={fileRow()} key={index}>
                      <p className="w-auto">Selected file: {file.name}</p>
                      <Button
                        variant="blackberryXs"
                        size="xs"
                        className={fileCancel()}
                        onClick={() => handleRemoveFile(index)}
                      >
                        <X />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button onClick={handleConfirmation}>{confirmationText}</Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default DragAndDrop
