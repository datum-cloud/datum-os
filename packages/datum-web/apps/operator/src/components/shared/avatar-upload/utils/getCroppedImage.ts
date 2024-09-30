import { DEFAULT_AVATAR_DIMENSIONS } from '@repo/constants'
import { Datum } from '@repo/types'
import { Area } from 'react-easy-crop'

const createImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

const getCroppedImg = async (
  imageSrc: string,
  crop: Area,
  resize: Datum.ImageDimensions = DEFAULT_AVATAR_DIMENSIONS,
): Promise<string> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Canvas context not available')
  }

  const { x, y, width, height } = crop
  canvas.width = width
  canvas.height = height

  ctx.drawImage(image, x, y, width, height, 0, 0, width, height)
  const imageData = ctx.getImageData(0, 0, width, height)
  const imageBitmapOptions = {
    resizeWidth: resize.width,
    resizeHeight: resize.height,
  }
  const imageBitmap = await createImageBitmap(imageData, imageBitmapOptions)
  canvas.width = resize.width
  canvas.height = resize.height
  ctx.drawImage(imageBitmap, 0, 0, resize.width, resize.height)

  return canvas.toDataURL('image/jpeg')
}

export default getCroppedImg
