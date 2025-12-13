"use client"

import { motion } from "motion/react"
import { BrainCircuit } from "lucide-react"

export function AIProcessing() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t-4 border-green-500/30 w-24 h-24"
        />
        <motion.div
           animate={{ rotate: -360 }}
           transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
           className="absolute inset-2 rounded-full border-b-4 border-blue-500/30 w-20 h-20"
        />
        <div className="flex items-center justify-center w-24 h-24 bg-white dark:bg-zinc-900 rounded-full shadow-lg border border-zinc-100 dark:border-zinc-800">
           <BrainCircuit className="size-10 text-green-600 dark:text-green-500" />
        </div>
      </div>
      
      <div className="text-center space-y-2">
         <h3 className="text-xl font-bold">Analyzing GitHub Activity...</h3>
         <p className="text-zinc-500 dark:text-zinc-400">Summarizing your commits and PRs into a TIL.</p>
      </div>
    </div>
  )
}
