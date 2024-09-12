import React, { ChangeEvent, DragEvent, useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { Button } from '@repo/ui/button'
import { cn } from '@repo/ui/lib/utils'

import { dragAndDropStyles } from './drag-and-drop.styles'

type DragAndDropProps = {
  onConfirm(files: File[]): void
  onSelect?(files: File[]): void
  className?: string
}

const DragAndDrop = ({ onSelect, onConfirm, className }: DragAndDropProps) => {
  const { container } = dragAndDropStyles()
  const [files, setFiles] = useState<File[]>([])

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
    onConfirm(files)
    setFiles([])
  }

  return (
    <section
      className={cn(
        'flex flex-col items-center justify-start gap-4',
        className,
      )}
    >
      <div
        className={cn(
          container(),
          'w-full flex flex-col gap-4 items-center justify-center p-4',
          files.length > 0 ? 'active' : 'inactive',
        )}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        {files.length < 1 ? (
          <>
            <div className="w-full flex justify-center items-center gap-1">
              <p>Drag your CSV file in here, or </p>
              <input
                type="file"
                hidden
                id="browse"
                disabled={files.length > 0}
                onChange={handleFileChange}
                accept=".csv"
              />
              <label
                htmlFor="browse"
                className="underline p-1 font-normal cursor-pointer"
              >
                select it manually.
              </label>
            </div>
          </>
        ) : (
          <>
            <div className="w-full flex flex-col gap-2">
              {files.map((file, index) => (
                <div
                  className="w-full flex items-center justify-start"
                  key={index}
                >
                  <p>{file.name}</p>
                  <Button
                    variant="blackberryXs"
                    size="xs"
                    className="h-full aspect-square flex items-center justify-center"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      {files.length > 0 && (
        <Button onClick={handleConfirmation}>Upload contacts from CSV</Button>
      )}
    </section>
  )
}

export default DragAndDrop
