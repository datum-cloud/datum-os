'use client'

import {
  GetUserProfileQueryVariables,
  useGetUserProfileQuery,
  useUpdateUserInfoMutation,
} from '@repo/codegen/src/schema'
import {
  avatarUploadStyles,
  AvatarUploadVariants,
} from './avatar-upload.styles'
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
import { useCallback, useState } from 'react'
import { FileWithPath, useDropzone } from 'react-dropzone'
import { useSession } from 'next-auth/react'
import { Button } from '@repo/ui/button'
import Cropper, { Area, Point } from 'react-easy-crop'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
import getCroppedImg from './utils/getCroppedImage'
import { useToast } from '@repo/ui/use-toast'

interface AvatarUploadProps extends AvatarUploadVariants {
  className?: string
}

const AvatarUpload = ({ className }: AvatarUploadProps) => {
  const { toast } = useToast()
  const { data: sessionData } = useSession()
  const userId = sessionData?.user.userId
  const variables: GetUserProfileQueryVariables = {
    userId: userId ?? '',
  }
  const [{ data }] = useGetUserProfileQuery({
    variables,
    pause: !sessionData,
  })
  const avatar =
    data?.user?.avatarLocalFile || data?.user?.avatarRemoteURL || null

  const [isCroppingModalOpen, setIsCroppingModalOpen] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [{}, updateUserInfo] = useUpdateUserInfoMutation()
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

  const saveCroppedImage = async () => {
    if (uploadedImage && croppedAreaPixels) {
      const croppedImageUrl = await getCroppedImg(
        uploadedImage,
        croppedAreaPixels,
      )

      const { error } = await updateUserInfo({
        updateUserId: userId,
        input: {
          avatarLocalFile: croppedImageUrl,
        },
      })

      if (error) {
        toast({
          title: error.message,
          variant: 'destructive',
        })
      } else {
        closeModal()
        toast({
          title: 'Avatar updated successfully',
          variant: 'success',
        })
      }
    }
  }

  return (
    <Panel>
      <PanelHeader heading="Avatar" noBorder />
      <div {...getRootProps()} className={cn(wrapper(), className)}>
        <input {...getInputProps()} />
        <p>{isDragActive ? dropMessage : defaultMessage}</p>
        <div className={avatarPreview()}>
          <Avatar variant="extra-large">
            {avatar && <AvatarImage src={avatar} />}
            <AvatarFallback>
              {data?.user?.firstName?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      <Dialog open={isCroppingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit your avatar</DialogTitle>
            <DialogDescription>
              Please crop, resize and click 'Save avatar'
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
            <Button onClick={saveCroppedImage}>Save avatar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Panel>
  )
}

export { AvatarUpload }
