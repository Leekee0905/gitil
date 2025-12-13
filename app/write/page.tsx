"use client"

import { useState } from "react"
import { MarkdownEditor } from "@/components/markdown-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { DatePicker } from "@/components/date-picker"
import { AIProcessing } from "@/components/ai-processing"
import { GitCommit, GitPullRequest, PenSquare, ArrowLeft, Save, ChevronRight } from "lucide-react"
import { getDailyCommits, getDailyPRs } from "@/app/actions/github"

type Step = "select" | "date" | "processing" | "write"
type Source = "commit" | "pr" | "manual" | null

export default function WritePage() {
  const [step, setStep] = useState<Step>("select")
  const [source, setSource] = useState<Source>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState("")

  const handleSelect = (src: Source) => {
    setSource(src)
    if (src === "manual") {
      setStep("write")
    } else {
      setStep("date")
    }
  }

  const handleDateConfirm = async () => {
    if (!selectedDate) return
    setStep("processing")
    
    try {
      let contentString = ""
      const dateStr = selectedDate.toLocaleDateString()
      
      if (source === "commit") {
        const { data, error } = await getDailyCommits(selectedDate)
        if (error) throw new Error(error)
        
        const count = data?.length || 0
        const commitList = data?.map(c => `- [${c.commit.message.split('\n')[0]}](${c.html_url})`).join('\n') || "No commits found."
        
        contentString = `# Daily Learning (Commits)\n\n**Date**: ${dateStr}\n\n## Summary\nToday, I made **${count}** commits.\n\n## Commits\n${commitList}\n\n## Insights\n(AI Summarization will be applied here)`
      
      } else if (source === "pr") {
        const { data, error } = await getDailyPRs(selectedDate)
        if (error) throw new Error(error)
        
        const count = data?.length || 0
        const prList = data?.map(pr => `- [${pr.title}](${pr.html_url}) (${pr.state})`).join('\n') || "No PRs found."
        
        contentString = `# Daily Learning (PRs)\n\n**Date**: ${dateStr}\n\n## Summary\nToday, I worked on **${count}** Pull Requests.\n\n## Pull Requests\n${prList}\n\n## Insights\n(AI Summarization will be applied here)`
      }

      setContent(contentString)
      // Small delay to show the "Processing" state (UX)
      setTimeout(() => setStep("write"), 1500)

    } catch (e) {
      console.error(e)
      alert(e instanceof Error ? e.message : "Failed to fetch data")
      setStep("select") // Go back on error
    }
  }

  const handlePublish = () => {
    alert("Publish feature coming soon!")
  }

  const reset = () => {
    setStep("select")
    setSource(null)
    setContent("")
    setTitle("")
    setTags("")
  }

  if (step === "processing") {
    return <AIProcessing />
  }

  if (step === "write") {
     return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" onClick={reset}>
                     <ArrowLeft className="size-4" />
                  </Button>
                  <h1 className="text-3xl font-bold tracking-tight">Write TIL</h1>
               </div>
              <Button onClick={handlePublish} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Save className="size-4" />
                Publish
              </Button>
            </div>
            
            <div className="space-y-4">
               <Input 
                 placeholder="Post Title" 
                 className="text-lg font-semibold h-12"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
               />
               <Input 
                 placeholder="Tags (comma separated, e.g. React, Next.js)" 
                 value={tags}
                 onChange={(e) => setTags(e.target.value)}
               />
               <MarkdownEditor value={content} onChange={setContent} />
            </div>
          </div>
        </div>
     )
  }

  return (
    <div className="container mx-auto py-20 px-4 max-w-3xl">
      <div className="space-y-8 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">How would you like to start?</h1>
        <p className="text-zinc-500 text-lg">Choose a source to generate your TIL or start from scratch.</p>
      </div>

      {step === "select" && (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SelectionCard 
               icon={<GitCommit className="size-8 text-blue-500" />}
               title="From Commits"
               description="Fetch today's commits and summarize them."
               onClick={() => handleSelect("commit")}
            />
             <SelectionCard 
               icon={<GitPullRequest className="size-8 text-purple-500" />}
               title="From PRs"
               description="Analyze your recent Pull Requests."
               onClick={() => handleSelect("pr")}
            />
             <SelectionCard 
               icon={<PenSquare className="size-8 text-green-500" />}
               title="Write Manually"
               description="Start with a blank editor."
               onClick={() => handleSelect("manual")}
            />
         </div>
      )}

      {step === "date" && (
         <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex flex-col items-center gap-6">
               <div className="text-center">
                  <h2 className="text-2xl font-semibold">Select Date</h2>
                  <p className="text-zinc-500">Which day&apos;s activity should we fetch?</p>
               </div>
               
               <DatePicker date={selectedDate} setDate={setSelectedDate} />
               
               <div className="flex w-full gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setStep("select")}>Back</Button>
                  <Button className="flex-1 gap-2" onClick={handleDateConfirm}>
                     Fetch & Analyze <ChevronRight className="size-4" />
                  </Button>
               </div>
            </div>
         </div>
      )}
    </div>
  )
}

function SelectionCard({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) {
  return (
    <Card 
      onClick={onClick}
      className="p-6 cursor-pointer hover:border-green-500 hover:shadow-lg transition-all flex flex-col items-center text-center gap-4 group"
    >
      <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900 group-hover:scale-110 transition-transform duration-300">
         {icon}
      </div>
      <div className="space-y-2">
         <h3 className="font-semibold text-lg">{title}</h3>
         <p className="text-sm text-zinc-500">{description}</p>
      </div>
    </Card>
  )
}
