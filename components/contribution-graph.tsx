"use client"

import { useTheme } from "next-themes"
import { ActivityCalendar, type Activity } from "react-activity-calendar"
import * as React from "react"
import { Tooltip } from "react-tooltip"



const explicitTheme = {
  light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
}

interface ContributionGraphProps {
  data?: Activity[]
}

export function ContributionGraph({ data = [] }: ContributionGraphProps) {
  const { resolvedTheme } = useTheme()
  const colorScheme = resolvedTheme === "dark" ? "dark" : "light"


  if (data.length === 0) {
    return (
      <div className="w-full h-[128px] p-4 border rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 animate-pulse flex items-center justify-center">
         <span className="text-zinc-400 text-sm">Loading activity...</span>
      </div>
    )
  }


  return (
    <div className="w-full p-4 border rounded-xl bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 [&_article]:w-full! [&_svg]:w-full [&_svg]:h-auto">
       <ActivityCalendar
          data={data}
          theme={explicitTheme}
          colorScheme={colorScheme}
          blockSize={12}
          blockMargin={4}
          fontSize={12}
          loading={false}
          renderBlock={(block: React.ReactElement, activity: Activity) => 
             React.cloneElement(block, {
                'data-tooltip-id': 'react-tooltip',
                'data-tooltip-content': `${activity.count} contributions on ${activity.date}`,
             } as any)
          }
       />
       <Tooltip id="react-tooltip" />
    </div>
  )
}
