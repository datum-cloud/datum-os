'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/chart-card'
import { ChartConfig, ChartContainer, Recharts } from '@repo/ui/chart'
import { PRIMARY_COLOR, SECONDARY_COLOR } from '@repo/constants'
import { Tag } from '@repo/ui/tag'
import { ArrowDown, ArrowUp } from 'lucide-react'

type UsersStatisticsProps = {
  newUsersWeekly: UserStatistics
  newUsersMonthly: UserStatistics
  activeUsers: UserStatistics
}

type UserStatistics = Record<string, string | number>[]

const UsersStatistics = ({
  newUsersWeekly,
  newUsersMonthly,
  activeUsers,
}: UsersStatisticsProps) => {
  const charts = [
    {
      title: 'New Users (Weekly)',
      data: newUsersWeekly,
    },
    {
      title: 'New Users (Monthly)',
      data: newUsersMonthly,
    },
    {
      title: 'Active Users',
      data: activeUsers,
    },
  ]

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: PRIMARY_COLOR,
    },
  } satisfies ChartConfig

  return (
    <div className="w-full flex justify-start items-stretch gap-6">
      {charts.map(({ title, data }, index) => {
        if (!data.length) return null

        const latestEntry = data[data.length - 1]
        const latestEntryValue = (latestEntry?.['desktop'] || 0) as number
        const penultimateEntry = data[data.length - 2]
        const penultimateEntryValue = (penultimateEntry?.['desktop'] ||
          0) as number
        const total = Object.values(latestEntry)?.[1] || 0
        const latestChange = latestEntryValue - penultimateEntryValue
        console.log(latestChange, latestEntryValue, penultimateEntryValue)
        const positiveChange = latestChange > 0

        return (
          <Card key={title} className="w-full max-w-[367px] md:w-1/3">
            <CardHeader className="flex flex-row justify-between items-center pb-[18px] px-8">
              <CardTitle className="text-body-m font-medium">{title}</CardTitle>
              <Tag
                variant={positiveChange ? 'success' : 'destructive'}
                className="flex items-center gap-0.5 pt-[1px]"
              >
                {positiveChange ? (
                  <ArrowUp size={10} />
                ) : (
                  <ArrowDown size={10} />
                )}
                {latestChange}
              </Tag>
            </CardHeader>
            <CardContent className="relative flex gap-8 justify-between items-stretch px-8">
              <div className="flex items-center justify-start">
                <h3 className="type-h4">{String(total)}</h3>
              </div>
              <div className="w-full">
                <ChartContainer config={chartConfig} className="h-[8vw]">
                  <Recharts.LineChart
                    accessibilityLayer
                    data={data}
                    margin={{
                      left: 12,
                      right: 12,
                    }}
                  >
                    <Recharts.Line
                      dataKey="desktop"
                      className="w-full"
                      type="linear"
                      stroke={index % 2 !== 0 ? SECONDARY_COLOR : PRIMARY_COLOR}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </Recharts.LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default UsersStatistics
