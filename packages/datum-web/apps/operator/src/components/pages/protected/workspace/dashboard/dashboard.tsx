'use client'

import { useRouter } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'
import React from 'react'
import { Grid, GridRow, GridCell } from '@repo/ui/grid'
import { Panel } from '@repo/ui/panel'
import { Button } from '@repo/ui/button'
import PageTitle from '@/components/page-title'
import { OPERATOR_APP_ROUTES } from '@repo/constants'

const DashboardPage = () => {
  const { push } = useRouter()

  return (
    <section>
      <PageTitle title="Dashboard" className="mb-10" />
      <Grid rows={2}>
        <GridRow columns={2}>
          <GridCell>
            <Panel
              align="center"
              justify="center"
              textAlign="center"
              className="min-h-[400px]"
            >
              <h5 className="text-xl font-mono">Set up your integrations</h5>
              <p className="max-w-[340px]">
                Maximize the efficiency of your workspace by setting up your
                Slack and GitHub integrations.
              </p>
              <Button
                onClick={() => {
                  alert('Coming soon')
                }}
                icon={<ArrowUpRight />}
                size="md"
                iconAnimated
              >
                Integrations
              </Button>
            </Panel>
          </GridCell>
          <GridCell>
            <Panel
              align="center"
              justify="center"
              textAlign="center"
              className="min-h-[400px]"
            >
              <h5 className="text-xl font-mono">Configure your workspace</h5>
              <p className="max-w-[340px]">
                Define everything from your workspace slug to advanced
                authentication settings.
              </p>
              <Button
                onClick={() => {
                  push(OPERATOR_APP_ROUTES.workspaceSettings)
                }}
                icon={<ArrowUpRight />}
                size="md"
                iconAnimated
              >
                Workspace Settings
              </Button>
            </Panel>
          </GridCell>
        </GridRow>
        <GridRow columns={1}>
          <GridCell>
            <Panel
              align="center"
              justify="center"
              textAlign="center"
              className="min-h-[400px]"
            >
              <h5 className="text-xl font-mono">Add team members</h5>
              <p className="max-w-[340px]">
                Get your team rocking and rolling by inviting your colleagues to
                join the party.
              </p>
              <Button
                onClick={() => {
                  push(OPERATOR_APP_ROUTES.workspaceMembers)
                }}
                icon={<ArrowUpRight />}
                size="md"
                iconAnimated
              >
                Team Management
              </Button>
            </Panel>
          </GridCell>
        </GridRow>
      </Grid>
    </section>
  )
}

export default DashboardPage
