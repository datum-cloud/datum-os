import { mkConfig, generateCsv, download } from 'export-to-csv'

function generateCsvConfig(filename: string) {
  return mkConfig({
    fieldSeparator: ',',
    filename,
    decimalSeparator: '.',
    useKeysAsHeaders: true,
  })
}

export function exportExcel(filename: string, data: any[]) {
  const csvConfig = generateCsvConfig(filename)
  const csv = generateCsv(csvConfig)(data)
  download(csvConfig)(csv)
}
