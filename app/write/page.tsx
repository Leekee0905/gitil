"use client"

import { useState, useRef, useEffect } from "react"
import { MarkdownEditor } from "@/components/markdown-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePicker } from "@/components/date-picker"
import { AIProcessing } from "@/components/ai-processing"
import { GitCommit, GitPullRequest, PenSquare, ArrowLeft, Save, ChevronRight, Eye, X, Loader2, Wand2 } from "lucide-react"
import { getDailyCommits, getDailyPRs } from "@/app/actions/github"
import { generateDailySummary } from "@/app/actions/ai"
import { CommitViewer } from "@/components/commit-viewer"
import { Badge } from "@/components/ui/badge"
import { GitHubCommit, GitHubPR } from "@/app/lib/github/types"
import { useSearchParams } from "next/navigation"
import { getPostBySlug, updatePost } from "@/app/lib/mock-data"
import { ScrollArea } from "@/components/ui/scroll-area"

type Step = "select" | "date" | "selection" | "processing" | "write"
type Source = "commit" | "pr" | "manual" | null

export default function WritePage() {
  const [step, setStep] = useState<Step>("select")
  const [source, setSource] = useState<Source>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Data State
  const [commits, setCommits] = useState<GitHubCommit[]>([])
  const [prs, setPrs] = useState<GitHubPR[]>([]) 
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set())
  const [isFetching, setIsFetching] = useState(false)

  const [viewingCommit, setViewingCommit] = useState<GitHubCommit | null>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const searchParams = useSearchParams()
  const mode = searchParams.get('mode')
  const slug = searchParams.get('slug')
  const isEditMode = mode === 'edit' && slug

  useEffect(() => {
      if (isEditMode) {
          // Verify user (mock: assume 'soosung')
          const post = getPostBySlug('soosung', slug as string)
          if (post) {
              setTitle(post.title)
              setContent(post.content)
              setTags(post.tags)
              setStep("write")
          } else {
              alert("Post not found")
          }
      }
  }, [isEditMode, slug])

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
    setIsFetching(true)
    
    try {
      setSelectedItemIds(new Set()) // Reset selection

      if (source === "commit") {
        const { data, error } = await getDailyCommits(selectedDate)
        if (error) throw new Error(error)
        
        setCommits(data || [])
        // Default select all
        if (data) {
            setSelectedItemIds(new Set(data.map(c => c.sha)))
        }
      
      } else if (source === "pr") {
        const { data, error } = await getDailyPRs(selectedDate)
        if (error) throw new Error(error)
        
        setPrs(data || [])
        // Default select all
        if (data) {
            setSelectedItemIds(new Set(data.map(p => String(p.id))))
        }
      }

      setStep("selection")

    } catch (e) {
      console.error(e)
      alert(e instanceof Error ? e.message : "Failed to fetch data")
    } finally {
        setIsFetching(false)
    }
  }

  const toggleSelection = (id: string) => {
      const newSet = new Set(selectedItemIds)
      if (newSet.has(id)) {
          newSet.delete(id)
      } else {
          newSet.add(id)
      }
      setSelectedItemIds(newSet)
  }

  const handleGenerateSummary = async () => {
      setStep("processing")

      try {
          const dateStr = selectedDate?.toLocaleDateString() || ""
          let aiSummary = "(AI Processing Failed)"
          
          let contentString = ""
          
          if (source === 'commit') {
              const selectedCommits = commits.filter(c => selectedItemIds.has(c.sha))
              const count = selectedCommits.length
              const commitList = selectedCommits.map(c => `- [${c.commit.message.split('\n')[0]}](${c.html_url})`).join('\n') || "No commits selected."

              // AI Generation
              if (selectedCommits.length > 0) {
                   const aiRes = await generateDailySummary('commit', selectedCommits)
                   if (aiRes.data) aiSummary = aiRes.data
              } else {
                  aiSummary = "No commits selected for summary."
              }

              contentString = `# Daily Learning (Commits)\n\n**Date**: ${dateStr}\n\n## Summary\nToday, I made **${count}** commits.\n\n## Commits\n${commitList}\n\n## Insights\n${aiSummary}`

          } else if (source === 'pr') {
              const selectedPrs = prs.filter(p => selectedItemIds.has(String(p.id)))
              const count = selectedPrs.length
              const prList = selectedPrs.map(pr => `- [${pr.title}](${pr.html_url}) (${pr.state})`).join('\n') || "No PRs selected."

              // AI Generation
              if (selectedPrs.length > 0) {
                  const aiRes = await generateDailySummary('pr', selectedPrs)
                  if (aiRes.data) aiSummary = aiRes.data
              } else {
                  aiSummary = "No PRs selected for summary."
              }

              contentString = `# Daily Learning (PRs)\n\n**Date**: ${dateStr}\n\n## Summary\nToday, I worked on **${count}** Pull Requests.\n\n## Pull Requests\n${prList}\n\n## Insights\n${aiSummary}`
          }

          setContent(contentString)
          setStep("write")

      } catch (e) {
          console.error(e)
          alert("Failed to generate summary")
          setStep("selection")
      }
  }

  const handlePublish = () => {
    if (isEditMode) {
        updatePost('soosung', slug as string, {
            title,
            content,
            tags
        })
        alert("Post updated successfully! (Mock)")
    } else {
        alert("Publish feature coming soon!")
    }
  }

  const reset = () => {
    setStep("select")
    setSource(null)
    setCommits([])
    setPrs([])
    setContent("")
    setTitle("")
    setTags([])
    setTagInput("")
    setSelectedItemIds(new Set())
  }

  const openCommitViewer = (commit: GitHubCommit) => {
    setViewingCommit(commit)
    setIsViewerOpen(true)
  }

  if (step === "processing") {
    return <AIProcessing />
  }

  const handleInsert = (insertedContent: string) => {
    if (textareaRef.current) {
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value
        
        const newText = text.substring(0, start) + "\n" + insertedContent + "\n" + text.substring(end)
        
        setContent(newText)
        
        // Optional: restore focus and cursor
        setTimeout(() => {
            textarea.focus()
            const newCursorPos = start + insertedContent.length + 2 // +2 for newlines
            textarea.setSelectionRange(newCursorPos, newCursorPos)
        }, 0)

    } else {
        // Fallback if ref is missing
        setContent(prev => {
            const prefix = prev ? prev + "\n" : ""
            return prefix + insertedContent
        })
    }
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
                  <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? "Edit Post" : "Write TIL"}</h1>
               </div>
              <Button onClick={handlePublish} className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                <Save className="size-4" />
                {isEditMode ? "Update" : "Publish"}
              </Button>
            </div>
            
            {(commits.length > 0 || prs.length > 0) && (
                <Card className="p-4 bg-zinc-50 dark:bg-zinc-900 border-dashed">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                        {source === 'commit' ? <GitCommit className="size-4" /> : <GitPullRequest className="size-4" />}
                        Source Items (Processed)
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {source === 'commit' && commits.filter(c => selectedItemIds.has(c.sha)).map(commit => (
                            <div key={commit.sha} className="flex items-center justify-between text-sm p-2 bg-white dark:bg-black rounded border">
                                <span className="truncate flex-1 mr-4">{commit.commit.message.split('\n')[0]}</span>
                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => openCommitViewer(commit)}>
                                    <Eye className="size-3" /> View Code
                                </Button>
                            </div>
                        ))}
                        {source === 'pr' && prs.filter(p => selectedItemIds.has(String(p.id))).map(pr => (
                             <div key={pr.id} className="flex items-center justify-between text-sm p-2 bg-white dark:bg-black rounded border">
                                <span className="truncate flex-1 mr-4">{pr.title}</span>
                                <span className="text-xs text-zinc-500">PR #{pr.number}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <div className="space-y-4">
               <Input 
                 placeholder="Post Title" 
                 className="text-lg font-semibold h-12"
                 value={title}
                 onChange={(e) => setTitle(e.target.value)}
               />
               <div className="space-y-2">
                   <div className="flex flex-wrap gap-2">
                       {tags.map((tag, index) => (
                           <Badge key={index} variant="success" className="gap-1 pr-1">
                               {tag}
                               <button 
                                   onClick={() => setTags(tags.filter((_, i) => i !== index))}
                                   className="hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full p-0.5"
                               >
                                   <X className="size-3" />
                               </button>
                           </Badge>
                       ))}
                   </div>
                   <Input 
                     placeholder="Add a tag and press Enter..." 
                     value={tagInput}
                     onChange={(e) => setTagInput(e.target.value)}
                     onKeyDown={(e) => {
                         if (e.key === 'Enter') {
                             e.preventDefault()
                             const newTag = tagInput.trim()
                             if (newTag && !tags.includes(newTag)) {
                                 setTags([...tags, newTag])
                                 setTagInput("")
                             }
                         } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
                             setTags(tags.slice(0, -1))
                         }
                     }}
                   />
               </div>
               <MarkdownEditor value={content} onChange={setContent} textareaRef={textareaRef} />
            </div>
          </div>

          <CommitViewer 
            commit={viewingCommit} 
            open={isViewerOpen} 
            onOpenChange={setIsViewerOpen} 
            onInsert={handleInsert}
          />
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
                  <Button variant="outline" className="flex-1" onClick={() => setStep("select")} disabled={isFetching}>Back</Button>
                  <Button className="flex-1 gap-2" onClick={handleDateConfirm} disabled={isFetching}>
                     {isFetching ? <Loader2 className="size-4 animate-spin" /> : <ChevronRight className="size-4" />}
                     {isFetching ? "Fetching..." : "Next"}
                  </Button>
               </div>
            </div>
         </div>
      )}

      {step === "selection" && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Select Items to Summarize</h2>
                  <p className="text-zinc-500">Uncheck items you don&apos;t want to include in the AI summary.</p>
              </div>

              <Card className="flex flex-col h-[500px]">
                  <ScrollArea className="flex-1 p-4">
                      <div className="space-y-3">
                          {source === 'commit' && commits.length === 0 && (
                              <div className="text-center py-8 text-zinc-500">No commits found for this date.</div>
                          )}
                           {source === 'pr' && prs.length === 0 && (
                              <div className="text-center py-8 text-zinc-500">No PRs found for this date.</div>
                          )}

                          {source === 'commit' && commits.map((commit) => (
                              <div key={commit.sha} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                  <Checkbox 
                                    id={commit.sha}
                                    checked={selectedItemIds.has(commit.sha)}
                                    onCheckedChange={() => toggleSelection(commit.sha)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 space-y-1">
                                      <label htmlFor={commit.sha} className="text-sm font-medium leading-none cursor-pointer block">
                                          {commit.commit.message.split('\n')[0]}
                                      </label>
                                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                                          <span className="font-mono">{commit.sha.substring(0, 7)}</span>
                                          <span>•</span>
                                          <span>{new Date(commit.commit.author.date).toLocaleTimeString()}</span>
                                      </div>
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-blue-500" onClick={() => openCommitViewer(commit)}>
                                      <Eye className="size-4" />
                                  </Button>
                              </div>
                          ))}

                          {source === 'pr' && prs.map((pr) => (
                              <div key={pr.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                  <Checkbox 
                                    id={String(pr.id)}
                                    checked={selectedItemIds.has(String(pr.id))}
                                    onCheckedChange={() => toggleSelection(String(pr.id))}
                                    className="mt-1"
                                  />
                                  <div className="flex-1 space-y-1">
                                      <label htmlFor={String(pr.id)} className="text-sm font-medium leading-none cursor-pointer block">
                                          {pr.title}
                                      </label>
                                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                                          <span>#{pr.number}</span>
                                          <Badge variant={pr.state === 'open' ? 'success' : 'secondary'} className="text-[10px] h-5 px-1.5">
                                              {pr.state}
                                          </Badge>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </ScrollArea>
                  <div className="p-4 border-t bg-muted/20 flex justify-between items-center">
                      <div className="text-sm text-zinc-500">
                          {selectedItemIds.size} items selected
                      </div>
                  </div>
              </Card>
              
              <div className="flex w-full gap-2">
                 <Button variant="outline" className="flex-1" onClick={() => setStep("date")}>Back</Button>
                 <Button 
                    className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700" 
                    onClick={handleGenerateSummary}
                    disabled={selectedItemIds.size === 0}
                 >
                    <Wand2 className="size-4" /> Generate with AI
                 </Button>
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
