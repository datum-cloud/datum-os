'use client'

import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import Cropper, { Area, Point } from 'react-easy-crop'

import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
import { cn } from '@repo/ui/lib/utils'
import { Panel, PanelHeader } from '@repo/ui/panel'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/dialog'
import { Button } from '@repo/ui/button'

import getCroppedImg from './utils/getCroppedImage'
import {
  avatarUploadStyles,
  AvatarUploadVariants,
} from './avatar-upload.styles'

interface AvatarUploadProps extends AvatarUploadVariants {
  avatar: string
  setAvatar(input: string): Promise<void>
  title?: string
  imageType?: 'avatar' | 'logo' | 'image'
  fallbackText?: string
  noBorder?: boolean
  className?: string
}

const AvatarUpload = ({
  avatar,
  setAvatar,
  title,
  imageType = 'avatar',
  fallbackText = 'unknown',
  noBorder = false,
  className,
}: AvatarUploadProps) => {
  const [isCroppingModalOpen, setIsCroppingModalOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const dropMessage = 'Drop to upload!'
  const defaultMessage = (
    <>
      Drag your image in here, or <u>select it manually</u>.
    </>
  )

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const file = acceptedFiles[0]
    const reader = new FileReader()

    reader.onload = () => {
      setUploadedImage(reader.result as string)
      setIsCroppingModalOpen(true)
    }

    reader.readAsDataURL(file)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  const { wrapper, cropContainer, avatarPreview } = avatarUploadStyles({
    isDragActive,
  })

  const closeModal = () => {
    setIsCroppingModalOpen(false)
    setUploadedImage(null)
  }

  const onCropChange = (crop: Point) => {
    setCrop(crop)
  }

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  async function saveCroppedImage() {
    if (uploadedImage && croppedAreaPixels) {
      const croppedImageUrl = await getCroppedImg(
        uploadedImage,
        croppedAreaPixels,
      )

      await setAvatar(croppedImageUrl)

      closeModal()
    }
  }

  return (
    <Panel>
      <PanelHeader
        heading={title || <span className="capitalize">{imageType}</span>}
        noBorder={noBorder}
      />
      <div {...getRootProps()} className={cn(wrapper(), className)}>
        <input {...getInputProps()} />
        <p>{isDragActive ? dropMessage : defaultMessage}</p>
        <div className={avatarPreview()}>
          <Avatar variant="extra-large">
            {avatar && <AvatarImage src={avatar} />}
            <AvatarFallback>{fallbackText?.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Dialog open={isCroppingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit your {imageType}</DialogTitle>
            <DialogDescription>
              Please crop, resize and click 'Save {imageType}'
            </DialogDescription>
            <DialogClose onClick={closeModal} />
          </DialogHeader>
          <div className={cropContainer()}>
            {uploadedImage && (
              <Cropper
                image={uploadedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                showGrid={false}
                onCropChange={onCropChange}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={saveCroppedImage}>Save {imageType}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Panel>
  )
}

export { AvatarUpload }
