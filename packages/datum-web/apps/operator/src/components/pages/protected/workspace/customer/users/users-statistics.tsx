'use client'

import { ArrowDown, ArrowUp, Minus } from 'lucide-react'

import { PRIMARY_COLOR, SECONDARY_COLOR } from '@repo/constants'
import { ChartConfig, ChartContainer, Recharts } from '@repo/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@repo/ui/chart-card'
import { Tag } from '@repo/ui/tag'

import { statisticsStyles } from './page.styles'

type UsersStatisticsProps = {
  newUsersWeekly: UserStatistics
  newUsersMonthly: UserStatistics
  // activeUsers: UserStatistics
  onDashboard?: boolean
}

type UserStatistics = Record<string, string | number>[]

const UsersStatistics = ({
  newUsersWeekly,
  newUsersMonthly,
  onDashboard = false,
}: // activeUsers,
UsersStatisticsProps) => {
  const {
    container,
    card,
    cardHeader,
    cardContent,
    cardTitle,
    cardDescription,
    cardTag,
    cardChart,
  } = statisticsStyles()
  const charts = [
    {
      title: 'New Users',
      description: '(This week)',
      data: newUsersWeekly,
    },
    {
      title: 'New Users',
      description: '(This month)',
      data: newUsersMonthly,
    },
    // {
    //   title: 'Active Users',
    //   description: '(Monthly)',
    //   data: activeUsers,
    // },
  ]

  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: PRIMARY_COLOR,
    },
  } satisfies ChartConfig

  return (
    <div className={container()}>
      {charts.map(({ title, description, data }, index) => {
        if (!data.length) return null

        const latestEntry = data[data.length - 1]
        const latestEntryValue = (latestEntry?.['desktop'] || 0) as number
        const penultimateEntry = data[data.length - 2]
        const penultimateEntryValue = (penultimateEntry?.['desktop'] ||
          0) as number
        const total = Object.values(latestEntry)?.[1] || 0
        const latestChange = latestEntryValue - penultimateEntryValue
        const noChange = latestChange === 0
        const positiveChange = latestChange > 0

        return (
          <Card key={`${title}-${index}`} className={card()}>
            <CardHeader className={cardHeader()}>
              <div>
                <CardTitle className={cardTitle({ onDashboard })}>
                  {title}
                </CardTitle>
                <CardDescription className={cardDescription({ onDashboard })}>
                  {description}
                </CardDescription>
              </div>
              <Tag
                variant={
                  noChange
                    ? 'default'
                    : positiveChange
                      ? 'success'
                      : 'destructive'
                }
                className={cardTag()}
              >
                {noChange ? (
                  <Minus size={10} />
                ) : positiveChange ? (
                  <ArrowUp size={10} />
                ) : (
                  <ArrowDown size={10} />
                )}
                {Math.abs(latestChange)}
              </Tag>
            </CardHeader>
            <CardContent className={cardContent()}>
              <div className="flex items-center justify-start">
                <h3 className="type-h4">{String(total)}</h3>
              </div>
              <div className="w-full">
                <ChartContainer config={chartConfig} className={cardChart()}>
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
