'use client'

import React, { useState } from 'react'
import {
  ArrowLeft,
  ChevronDown,
  User as UserIcon,
  Trash,
  RotateCw,
} from 'lucide-react'
import Link from 'next/link'

import {
  useGetInvitesQuery,
  useGetUserProfileQuery,
} from '@repo/codegen/src/schema'
import { exportExcel } from '@repo/common/csv'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Button } from '@repo/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/dropdown-menu'
import { Tag } from '@repo/ui/tag'
import type { Datum } from '@repo/types'

import { Loading } from '@/components/shared/loading/loading'
import { Error } from '@/components/shared/error/error'
// import { formatDate } from '@/utils/date'
import { formatContactsExportData } from '@/utils/export'

// import UserFormDialog from '../lists/lists-form-dialog'

// import UserDeleteDialog from './list-delete-dialog'
import UserInvitationTable from './user-invitation-table'
import { pageStyles } from './page.styles'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
import { formatDate } from '@/utils/date'

type UserPageProps = {
  id: Datum.UserId
}

const UserPage = ({ id }: UserPageProps) => {
  const { data: session } = useSession()
  const [selectedInvitations, setSelectedInvitations] = useState<
    Datum.Invitation[]
  >([])
  //   const [openEditDialog, _setOpenEditDialog] = useState(false)
  const [openDeleteDialog, _setOpenDeleteDialog] = useState(false)
  const {
    wrapper,
    link,
    userHeader,
    userCard,
    userImage,
    userText,
    userActions,
    userDropdownItem,
    userDropdownIcon,
  } = pageStyles()

  const [{ data: user, fetching: fetchingUser, error: errorUser }] =
    useGetUserProfileQuery({
      variables: { userId: id },
      pause: !session,
    })

  const [{ data: invites, fetching: fetchingInvites, error: errorInvites }] =
    useGetInvitesQuery({
      pause: !session,
    })

  const fetching = fetchingUser || fetchingInvites
  const error = errorUser || errorInvites

  function setOpenDeleteDialog(input: boolean) {
    _setOpenDeleteDialog(input)
    // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
    setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  }

  //   function setOpenEditDialog(input: boolean) {
  //     _setOpenEditDialog(input)
  //     // NOTE: This is needed to close the dialog without removing pointer events per https://github.com/shadcn-ui/ui/issues/468
  //     setTimeout(() => (document.body.style.pointerEvents = ''), 500)
  //   }

  if (fetching) {
    return <Loading />
  }

  if (error || !user?.user) {
    return <Error />
  }

  const invitations = invites?.invites?.edges?.map(
    (edge) => edge?.node,
  ) as Datum.Invitation[]
  const userInvitations = invitations?.filter(
    (invitation) => invitation.recipient === user.user.email,
  )

  const {
    firstName,
    lastName,
    email,
    avatarRemoteURL,
    avatarLocalFile,
    lastSeen,
  } = user.user
  const fullName = `${firstName} ${lastName}`
  const avatar = avatarLocalFile || avatarRemoteURL

  return (
    <div className={wrapper()}>
      <div className="w-full flex flex-col justify-start items-start gap-3">
        <Link href={OPERATOR_APP_ROUTES.users} className={link()}>
          <ArrowLeft size={18} />
          Back to Users
        </Link>
        <div className={userHeader()}>
          <div className={userCard()}>
            {/* TODO: Fetch user image via Gravatar or similar */}
            <Avatar variant="extra-large" className={userImage()}>
              {avatar && <AvatarImage src={avatar} />}
              <AvatarFallback className={userImage()}>
                <UserIcon size={60} className="text-winter-sky-900" />
              </AvatarFallback>
            </Avatar>
            <div className={userText()}>
              {fullName && (
                <h4 className="text-[27px] leading-[130%]">{fullName}</h4>
              )}
              <h6 className="text-body-l text-blackberry-600">{email}</h6>
              {lastSeen && (
                <p className="text-body-sm leading-5 text-blackberry-500">
                  Last seen on {formatDate(new Date(lastSeen))}
                </p>
              )}
            </div>
          </div>
          <div className={userActions()}>
            {/* <Button variant="outline" onClick={() => setOpenEditDialog(true)}>
              Edit user info
            </Button> */}
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button icon={<ChevronDown />} iconPosition="right">
                  Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="px-2 py-2.5">
                <DropdownMenuItem
                  onClick={() => setOpenDeleteDialog(true)}
                  className={userDropdownItem()}
                >
                  <RotateCw size={18} className={userDropdownIcon()} />
                  Resend invite
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setOpenDeleteDialog(true)}
                  className={userDropdownItem()}
                >
                  <Trash size={18} className={userDropdownIcon()} />
                  Delete user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </div>
      </div>
      <UserInvitationTable
        invitations={userInvitations}
        setSelection={setSelectedInvitations}
      />
      {/* <UserFormDialog
        list={list}
        open={openEditDialog}
        setOpen={setOpenEditDialog}
      />
      <UserDeleteDialog
        lists={[list]}
        open={openDeleteDialog}
        setOpen={setOpenDeleteDialog}
        redirect
      /> */}
    </div>
  )
}

export default UserPage
