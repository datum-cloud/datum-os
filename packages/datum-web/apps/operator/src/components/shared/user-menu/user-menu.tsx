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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/shared/sidebar/sidebar-accordion/sidebar-accordion'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { useState } from 'react'
import { cn } from '@repo/ui/lib/utils'

export const UserMenu = () => {
  const { data: sessionData } = useSession()
  const {
    accordion,
    accordionItem,
    accordionTrigger,
    accordionTriggerInner,
    accordionTriggerInnerText,
    accordionTriggerInnerLabel,
    accordionLink,
    accordionLinkIcon,
    trigger,
    email,
    dropdownItem,
    subheading,
    logOutButton,
  } = userMenuStyles()
  const [open, setOpen] = useState(false)
  const firstName = sessionData?.user?.name?.split(' ')?.[0]
  const hasName = !!firstName && firstName !== 'undefined'

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
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
        <Accordion type="single" collapsible className={accordion()}>
          <AccordionItem value="links" className={accordionItem()}>
            <AccordionTrigger asChild className={accordionTrigger()}>
              <div className={accordionTriggerInner()}>
                <p className={subheading()}>Account</p>
                <div className={accordionTriggerInnerText()}>
                  <p
                    className={cn(accordionTriggerInnerLabel(), 'text-body-m')}
                  >
                    {hasName
                      ? `${sessionData.user.name.split(' ')[0]}'s Personal
                    Account`
                      : 'Personal Account'}
                  </p>
                  <ChevronDown size={18} />
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              <Link
                href={OPERATOR_APP_ROUTES.workspace}
                onClick={() => setOpen(false)}
                className={accordionLink()}
              >
                <LayersIcon size={18} className={accordionLinkIcon()} />
                <span>My Workspaces</span>
              </Link>
              <Link
                href={OPERATOR_APP_ROUTES.profile}
                onClick={() => setOpen(false)}
                className={accordionLink()}
              >
                <UserPen size={18} className={accordionLinkIcon()} />
                <span>Profile</span>
              </Link>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
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
