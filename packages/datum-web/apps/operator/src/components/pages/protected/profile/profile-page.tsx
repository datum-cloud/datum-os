'use client'

import { useSession } from 'next-auth/react'

import {
  UpdateUserInput,
  useGetUserProfileQuery,
  useUpdateUserInfoMutation,
} from '@repo/codegen/src/schema'

import PageTitle from '@/components/page-title'
import { AvatarUpload } from '@/components/shared/avatar-upload/avatar-upload'

import { ProfileNameForm } from './profile-name-form'
import { pageStyles } from './page.styles'
import { toast } from '@repo/ui/use-toast'

const ProfilePage = () => {
  const { wrapper } = pageStyles()
  const { data: sessionData, update } = useSession()
  const userId = sessionData?.user.userId || ''

  const [{ data: userData }] = useGetUserProfileQuery({
    variables: {
      userId,
    },
    pause: !sessionData,
  })
  const [{ fetching }, updateUserInfo] = useUpdateUserInfoMutation()

  async function updateWorkspace(input: UpdateUserInput) {
    const { error } = await updateUserInfo({
      updateUserId: userId,
      input,
    })

    if (error) {
      console.error(error)
      toast({
        title: 'Error updating profile',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Profile updated',
        variant: 'success',
      })
    }
  }

  async function updateProfileAvatar(url: string) {
    await updateWorkspace({
      avatarLocalFile: url,
    })
  }

  const { firstName, lastName, avatarLocalFile, avatarRemoteURL } =
    userData?.user || {}

  return (
    <>
      <PageTitle title="My profile" className="mb-10" />
      <div className={wrapper()}>
        <ProfileNameForm
          firstName={firstName || ''}
          lastName={lastName || ''}
          updateData={updateWorkspace}
        />
        <AvatarUpload
          avatar={avatarLocalFile || avatarRemoteURL || ''}
          setAvatar={updateProfileAvatar}
          fallbackText={firstName || ''}
          noBorder
        />
      </div>
    </>
  )
}

export default ProfilePage
