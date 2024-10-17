import { ArrowLeft, MenuIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

import { useGetAllOrganizationsQuery } from '@repo/codegen/src/schema'
import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { cn } from '@repo/ui/lib/utils'

import { useSidebar } from '@/hooks/useSidebar'
import { NavItems, PersonalNavItems } from '@/routes/dashboard'

import { SideNav } from './sidebar-nav/sidebar-nav'
import { sidebarStyles } from './sidebar.styles'

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebar()
  const [status, setStatus] = useState(false)
  const isProfile = pathname === OPERATOR_APP_ROUTES.profile
  const isSettings = pathname === OPERATOR_APP_ROUTES.settings
  const isWorkspace = pathname === OPERATOR_APP_ROUTES.workspace
  const isPersonalWorkspaceSettings =
    pathname === OPERATOR_APP_ROUTES.personalWorkspaceSettings
  const showWorkspaceNav =
    !isProfile && !isSettings && !isWorkspace && !isPersonalWorkspaceSettings

  const { nav, sideNav, expandNav, expandNavIcon } = sidebarStyles({
    status,
    isOpen,
  })

  const handleToggle = () => {
    setStatus(true)
    toggle()
    setTimeout(() => setStatus(false), 500)
  }

  return (
    <div className={cn(nav(), className)}>
      <div className={expandNav({ isOpen: !isOpen })} onClick={handleToggle}>
        <MenuIcon strokeWidth={3} width={18} />
        <ArrowLeft className={expandNavIcon()} strokeWidth={3} width={18} />
      </div>
      <SideNav
        className={sideNav()}
        items={showWorkspaceNav ? NavItems : PersonalNavItems}
      />
    </div>
  )
}
