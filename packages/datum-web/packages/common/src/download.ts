export function download(filename: string, content: string) {
  const element = document.createElement('a')
  element.setAttribute('href', content)
  element.setAttribute('download', filename)
  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

export async function downloadFromUrl(filename: string, originalUrl: string) {
  try {
    const result = await fetch(originalUrl, {
      method: 'GET',
      headers: {},
    })
    const blob = await result.blob()
    const url = URL.createObjectURL(blob)
    download(filename, url)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
  }
}
