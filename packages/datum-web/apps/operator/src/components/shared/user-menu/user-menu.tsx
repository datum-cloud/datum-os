'use client'

import { signOut, useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/avatar'
import { userMenuStyles } from './user-menu.styles'
import { Button } from '@repo/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@repo/ui/dropdown-menu'
import { ChevronDown } from '@repo/ui/icons/chevron-down'
import { ShieldCheck } from 'lucide-react'

export const UserMenu = () => {
  const { data: sessionData } = useSession()
  const { trigger, email, dropdownItem, subheading, logOutButton } =
    userMenuStyles()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={trigger()}>
          <Avatar>
            {sessionData?.user?.image && (
              <AvatarImage src={sessionData?.user?.image} />
            )}
            <AvatarFallback>
              {sessionData?.user?.name?.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild className={dropdownItem()}>
          <>
            <p className={subheading()}>Signed in as</p>
            <a href={`mailto:${sessionData?.user.email}`} className={email()}>
              {sessionData?.user.email}
            </a>
          </>
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
