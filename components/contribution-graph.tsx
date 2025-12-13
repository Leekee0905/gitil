"use client"

import { useTheme } from "next-themes"
import { ActivityCalendar, type Activity } from "react-activity-calendar"
import * as React from "react"
import { Tooltip } from "react-tooltip"

// Helper to generate mock data for the last year
const generateMockData = () => {
  const data = []
  const now = new Date()
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(now.getFullYear() - 1)

  for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
    // Random activity level (0-4) with weighted probability for 0
    const rand = Math.random()
    let count = 0
    if (rand > 0.8) count = Math.floor(Math.random() * 5) + 1
    if (rand > 0.95) count = Math.floor(Math.random() * 10) + 5
    
    data.push({
      date: d.toISOString().split("T")[0],
      count,
      level: Math.min(4, Math.floor(count / 2)),
    })
  }
  return data
}

const explicitTheme = {
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
}

export function ContributionGraph() {
  const { resolvedTheme } = useTheme()
  const colorScheme = resolvedTheme === "dark" ? "dark" : "light"
  const [data, setData] = React.useState<Activity[]>([])

  React.useEffect(() => {
    setData(generateMockData())
  }, [])

  if (data.length === 0) {
    return (
      <div className="w-full h-[128px] p-4 border rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 animate-pulse flex items-center justify-center">
         <span className="text-zinc-400 text-sm">Loading activity...</span>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto p-4 border rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
       <div className="min-w-[800px]">
          <ActivityCalendar
            data={data}
            theme={explicitTheme}
            colorScheme={colorScheme}
            blockSize={12}
            blockMargin={4}
            fontSize={12}
            loading={false}
            renderBlock={(block: React.ReactElement, activity: Activity) => (
               <Tooltip id="react-tooltip" content={`${activity.count} contributions on ${activity.date}`}>
                  {block}
               </Tooltip>
            )}
          />
           <Tooltip id="react-tooltip" />
       </div>
    </div>
  )
}
