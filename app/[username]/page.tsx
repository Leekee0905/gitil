import { PostGrid } from "@/components/post-grid"
import { ContributionGraph } from "@/components/contribution-graph"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Flame } from "lucide-react"

interface PageProps {
  params: Promise<{
    username: string
  }>
}

import { fetchUserContributions } from "@/app/lib/github/service"

import { getPostsByUsername } from "@/app/lib/mock-data"

export default async function ProfilePage(props: PageProps) {
  const params = await props.params;
  const username = params.username

  let contributionData: any[] = []
  let totalContributions = 0
  
  try {
      const res = await fetchUserContributions(username)
      // console.log("GraphQL Response:", JSON.stringify(res, null, 2)) 

      const calendar = res.data?.user?.contributionsCollection?.contributionCalendar
      if (calendar) {
          totalContributions = calendar.totalContributions
          contributionData = calendar.weeks.flatMap((week: any) => 
            week.contributionDays.map((day: any) => ({
                date: day.date,
                count: day.contributionCount,
                level: day.contributionCount === 0 ? 0 : 
                       day.contributionCount <= 3 ? 1 :
                       day.contributionCount <= 6 ? 2 :
                       day.contributionCount <= 10 ? 3 : 4
            }))
          )
      } else {
          console.warn("No calendar data found in response")
      }
  } catch (e) {
      console.error("Failed to fetch contributions", e)
  }

  // Fetch mock posts
  const posts = getPostsByUsername(username)

  return (
    <div className="relative min-h-screen">
       <div className="container mx-auto py-12 px-4 space-y-12">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-8 border-b pb-12 dark:border-zinc-800">
          <Avatar className="size-32 border-4 border-white dark:border-zinc-900 shadow-xl">
            <AvatarImage src={`https://github.com/${username}.png`} />
            <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{username}</h1>
              <p className="text-zinc-500 dark:text-zinc-400">Full Stack Developer | Open Source Enthusiast</p>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-6">
               <div className="flex items-center gap-2">
                 <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                   <Calendar className="size-5" />
                 </div>
                 <div>
                   <div className="font-bold text-xl">{totalContributions}</div>
                   <div className="text-xs text-zinc-500">Total TILs</div>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400">
                   <Flame className="size-5" />
                 </div>
                 <div>
                   <div className="font-bold text-xl">12</div>
                   <div className="text-xs text-zinc-500">Day Streak</div>
                 </div>
               </div>
            </div>
          </div>

          <div className="flex gap-2">
             {/* Add Edit Profile button logic if current user */}
             <Button variant="outline">Share Profile</Button> 
          </div>
        </section>

        {/* User Content */}
        <section>
            <h2 className="text-xl font-bold mb-4">Contribution Graph</h2>
             <ContributionGraph data={contributionData} />

          <div className="my-6">
             <h2 className="text-xl font-bold mb-4">Latest Posts</h2>
             <PostGrid posts={posts} />
          </div>
        </section>
       </div>
    </div>
  )
}
