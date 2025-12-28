"use client"

import { PostCard } from "@/components/post-card"
import { motion } from "motion/react"

interface Post {
  slug: string
  title: string
  author: string
  date: string
  summary: string
  tags: string[]
}

interface PostGridProps {
  posts: Post[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export function PostGrid({ posts }: PostGridProps) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {posts.map((post, index) => (
        <PostCard key={index} {...post} index={index} />
      ))}
    </motion.div>
  )
}
