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

export default async function ProfilePage(props: PageProps) {
  const params = await props.params;
  const username = params.username

  // Mock data - in real app, fetch based on username
  const posts = [
    {
      title: "Learning Next.js Server Components",
      author: username,
      date: "2023-10-27",
      summary: "Today I dove deep into Next.js Server Components and how they differ from Client Components. It's fascinating how much logic we can move to the server.",
      tags: ["Next.js", "React", "Server Components"],
    },
    {
      title: "Building Accessible Forms",
      author: username,
      date: "2023-10-23",
      summary: "Accessibility should not be an afterthought. Here are 5 quick wins for better form a11y.",
      tags: ["A11y", "HTML", "Forms"],
    },
  ];

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
                   <div className="font-bold text-xl">127</div>
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
          <div className="mb-12">
             <h2 className="text-xl font-bold mb-6">Contribution Activity</h2>
             <ContributionGraph />
          </div>

          <div className="mb-6">
             <h2 className="text-xl font-bold mb-4">Latest Posts</h2>
             <PostGrid posts={posts} />
          </div>
        </section>
       </div>
    </div>
  )
}
