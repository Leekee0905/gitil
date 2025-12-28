"use client"


import Link from "next/link"
import { CalendarDays, GitCommit, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { motion } from "motion/react"

interface PostCardProps {
  slug: string
  title: string
  author: string
  date: string
  summary: string
  tags?: string[]
  index?: number
}

export function PostCard({ slug, title, author, date, summary, tags = [], index = 0 }: PostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/${author}/${slug}`}>
      <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm hover:border-green-500/50 dark:hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group cursor-pointer">
        <CardHeader className="p-4 pb-2 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <span className="font-semibold text-lg leading-tight group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
              {title}
            </span>
            <ArrowUpRight className="size-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
            <div className="flex items-center gap-1">
              <CalendarDays className="size-3" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitCommit className="size-3" />
              <span>{author}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-1">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
            {summary}
          </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span 
              key={tag} 
              className="text-[10px] uppercase tracking-wider font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-700"
            >
              {tag}
            </span>
          ))}
        </CardFooter>
      </Card>
      </Link>
    </motion.div>
  )
}
