import { redirect } from 'next/navigation'

import { OPERATOR_APP_ROUTES } from '@repo/constants'
import { Logo } from '@repo/ui/logo'
import { auth } from '@/lib/auth/auth'

const Landing = async () => {
  const session = await auth()
  const currentOrgId = session?.user.organization

  // If the user has a current organisation direct them to the dashboard
  // Otherwise they should be directed to the workspace page
  if (currentOrgId) {
    redirect(OPERATOR_APP_ROUTES.dashboard)
  } else {
    redirect(OPERATOR_APP_ROUTES.workspace)
  }

  return (
    <main className="flex items-center justify-center h-screen relative bg-winter-sky-900 dark:bg-peat-900">
      <div className="w-full relative z-3 px-4">
        <div className="mx-auto animate-pulse w-96">
          <Logo theme="dark" />
        </div>

        <h1 className="text-2xl text-center mt-4">loading your platform...</h1>
      </div>
    </main>
  )
}

export default Landing
