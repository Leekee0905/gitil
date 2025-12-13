import { PostGrid } from "@/components/post-grid";

export default function Home() {
  const posts = [
    {
      title: "Learning Next.js Server Components",
      author: "leekee0905",
      date: "2023-10-27",
      summary: "Today I dove deep into Next.js Server Components and how they differ from Client Components. It's fascinating how much logic we can move to the server.",
      tags: ["Next.js", "React", "Server Components"],
    },
    {
      title: "Setting up Supabase Auth",
      author: "dev_guru",
      date: "2023-10-26",
      summary: "Implemented GitHub OAuth login using Supabase helpers for Next.js. The process was smoother than expected.",
      tags: ["Supabase", "Auth", "Security"],
    },
    {
      title: "Tailwind CSS Configuration Tips",
      author: "css_wizard",
      date: "2023-10-25",
      summary: "Shared some tips on how to configure Tailwind v4 for optimal performance and theming.",
      tags: ["Tailwind", "CSS", "Frontend"],
    },
    {
      title: "Optimizing React Re-renders with useMemo",
      author: "perf_master",
      date: "2023-10-24",
      summary: "A deep dive into when and just as importantly, when NOT to use useMemo. Benchmarks included!",
      tags: ["React", "Performance", "Hooks"],
    },
    {
      title: "Building Accessible Forms",
      author: "a11y_advocate",
      date: "2023-10-23",
      summary: "Accessibility should not be an afterthought. Here are 5 quick wins for better form a11y.",
      tags: ["A11y", "HTML", "Forms"],
    },
    {
      title: "TypeScript Utility Types Explained",
      author: "ts_fan",
      date: "2023-10-22",
      summary: "Partial, Pick, Omit, Record... clarifying the confusing world of mapped types.",
      tags: ["TypeScript", "Guide"],
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#333_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      
      <div className="container mx-auto py-12 px-4 space-y-12">
        <section className="text-center space-y-4 max-w-2xl mx-auto pt-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Grow your developers <span className="text-green-600 dark:text-green-500">Garden</span>
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Every commit is a seed. Every PR is a branch. <br/>
            Watch your knowledge grow day by day.
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <span className="w-2 h-8 rounded-full bg-green-500 block"></span>
              Recent Activity
            </h2>
          </div>
          <PostGrid posts={posts} />
        </section>
      </div>
    </div>
  );
}
