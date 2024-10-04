import Link from 'next/link'
import { headerStyles } from './header.styles'
import { UserMenu } from '@/components/shared/user-menu/user-menu'
import { WorkspaceSelector } from '../workspace-selector/workspace-selector'
import { Notifications } from '../notifications/notifications'
import { DebouncedInput } from '@repo/ui/input'
import Search from '@/components/shared/search/search'

export default function Header() {
  const { header, nav, mobileSidebar, userNav } = headerStyles()
  function handleSearch(query: string) {
    console.log('Search', query)
  }

  return (
    <div className={header()}>
      <nav className={nav()}>
        <WorkspaceSelector />

        {/* <div className={mobileSidebar()}>
          <>MobileSidebar</>
        </div> */}

        {/* <Search onSearch={handleSearch} /> */}

        <div className={userNav()}>
          {/* <Link href="#" className="link">
            Datum Cloud
          </Link>
          <Link href="#" className="link">
            Docs
          </Link>
          <Notifications /> */}
          <UserMenu />
        </div>
      </nav>
    </div>
  )
}
