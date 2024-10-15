import { Datum } from '@repo/types'

function getPastFiveMonths() {
  const now = new Date()
  const months = []

  for (let i = 0; i < 5; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(date.getTime())
  }

  return months
}

function getPastFiveWeeks() {
  const now = new Date()
  const weeks = []

  for (let i = 0; i < 5; i++) {
    const date = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000)
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - date.getDay()) // Sunday considered the start of the week
    weeks.push(date.getTime())
  }

  return weeks
}

export function getMonthlyUsers(users: Datum.OrgUser[]) {
  const pastFiveMonths = getPastFiveMonths()

  const monthlyUsers = pastFiveMonths.map((monthTimestamp, index) => {
    const usersInMonth = users.filter((user) => {
      const userCreatedAt = new Date(user.joinedAt).getTime()
      //   TODO: Implement this later...
      //   const isUser = user.type === 'USER'
      //   return (
      //     userCreatedAt >= monthTimestamp &&
      //     (index === 0 || userCreatedAt < pastFiveMonths[index - 1])
      //   )

      return false
    })
    return {
      month: 5 - index,
      desktop: usersInMonth.length,
    }
  })

  return monthlyUsers.reverse()
}

export function getWeeklyUsers(users: Datum.OrgUser[]) {
  const pastFiveWeeks = getPastFiveWeeks()

  const weeklyUsers = pastFiveWeeks.map((weekTimestamp, index) => {
    const usersInWeek = users.filter((user) => {
      const userCreatedAt = new Date(user.joinedAt).getTime()
      //   TODO: Implement this later...
      //   const isUser = user.type === 'USER'
      //   return (
      //     userCreatedAt >= weekTimestamp &&
      //     (index === 0 || userCreatedAt < pastFiveWeeks[index - 1])
      //   )

      return false
    })
    return {
      week: 5 - index,
      desktop: usersInWeek.length,
    }
  })

  return weeklyUsers.reverse()
}
