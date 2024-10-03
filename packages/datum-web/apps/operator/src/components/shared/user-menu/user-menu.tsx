'use client'

import Link from 'next/link'

import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
import { userMenuStyles } from './user-menu.styles'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@repo/ui/dropdown-menu'
import { ChevronDown, LayersIcon, ShieldCheck, UserPen } from 'lucide-react'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { useState } from 'react'
import { useGetUserProfileQuery } from '@repo/codegen/src/schema'

export const UserMenu = () => {
  const { data: sessionData } = useSession()
  const {
    dropdownLink,
    dropdownLinkIcon,
    trigger,
    email,
    dropdownItem,
    subheading,
    logOutButton,
  } = userMenuStyles()
  const [open, setOpen] = useState(false)
  const firstName = sessionData?.user?.name?.split(' ')?.[0]
  const [{ data: userData }] = useGetUserProfileQuery({
    variables: { userId: sessionData?.user.userId },
    pause: !sessionData,
  })
  const avatar =
    userData?.user?.avatarLocalFile || userData?.user?.avatarRemoteURL

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className={trigger()}>
          <Avatar>
            {avatar && <AvatarImage src={avatar} />}
            <AvatarFallback>{firstName?.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className={dropdownItem()}>
          <>
            <p className={subheading()}>Signed in as</p>
            <Link href="/profile" className={email()}>
              {sessionData?.user.email}
            </Link>
          </>
        </DropdownMenuItem>
        <DropdownMenuSeparator spacing="md" />
        <DropdownMenuItem asChild>
          <Link
            href={OPERATOR_APP_ROUTES.profile}
            onClick={() => setOpen(false)}
            className={dropdownLink()}
          >
            <UserPen size={24} className={dropdownLinkIcon()} />
            <span>My Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href={OPERATOR_APP_ROUTES.workspace}
            onClick={() => setOpen(false)}
            className={dropdownLink()}
          >
            <LayersIcon size={24} className={dropdownLinkIcon()} />
            <span>My Workspaces</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator spacing="md" />
        <DropdownMenuItem
          asChild
          onClick={() => {
            signOut()
          }}
        >
          <div className={logOutButton()}>
            <ShieldCheck className="text-blackberry-400" />
            Log out
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
