import { DialogHeader, DialogTitle } from '@repo/ui/dialog'
import { Label } from '@repo/ui/label'
import { Input } from '@repo/ui/input'
import { Button } from '@repo/ui/button'
import Link from 'next/link'

const ImportContactsDialog = () => {
  function handleCSVDownload() {
    // TODO: Handle CSV download
    console.log('handleCSVDownload')
  }
  return (
    <>
      <DialogHeader>
        <DialogTitle>Import contacts</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-12">
        <div className="w-full flex flex-col gap-6">
          <div className="w-full border border-dashed border-blackberry-500 rounded-[5px] flex items-center justify-center h-[109px]">
            Drag your CSV file in here, or{' '}
            <Button
              variant="blackberryXs"
              size="xs"
              className="underline ml-1 font-normal"
            >
              select it manually.
            </Button>
          </div>
          <Button
            variant="sunglowXs"
            size="xs"
            className="underline"
            onClick={handleCSVDownload}
          >
            Download our pre-formatted CSV
          </Button>
        </div>
        <div className="flex flex-col gap-5 border border-butter-900 bg-butter-800 rounded-lg p-9">
          <p className="text-peat-800 leading-[23.6px]">
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
        </div>
      </div>
    </>
  )
}

export default ImportContactsDialog
