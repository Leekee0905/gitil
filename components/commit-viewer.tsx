"use client"

import { useState, useEffect } from "react"
import { GitHubCommit, GitHubCommitDetail, GitHubFile } from "@/app/lib/github/types"
import { getCommitDetails } from "@/app/actions/github"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Loader2, FileCode, ChevronRight, ChevronDown } from "lucide-react"

interface CommitViewerProps {
  commit: GitHubCommit | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsert: (content: string) => void
}

export function CommitViewer({ commit, open, onOpenChange, onInsert }: CommitViewerProps) {
  const [details, setDetails] = useState<GitHubCommitDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<GitHubFile | null>(null)
  const [selectedFileShas, setSelectedFileShas] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadDetails() {
      if (!commit || !open) return

      // If we already have details for this commit, don't refetch
      if (details?.sha === commit.sha) return

      setLoading(true)
      setDetails(null)
      setSelectedFile(null)
      setSelectedFileShas(new Set())

      try {
        const { owner, name } = commit.repository
        // If repository structure is nested or missing, handle it? 
        // Types say it is there.
        
        const { data, error } = await getCommitDetails(owner.login, name, commit.sha)
        
        if (error) {
            console.error(error)
            // Error handling UI?
        } else {
            setDetails(data)
            if (data?.files.length) {
                setSelectedFile(data.files[0])
            }
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    loadDetails()
  }, [commit, open])

  const toggleFileSelection = (sha: string) => {
    const newSet = new Set(selectedFileShas)
    if (newSet.has(sha)) {
        newSet.delete(sha)
    } else {
        newSet.add(sha)
    }
    setSelectedFileShas(newSet)
  }

  const handleInsert = () => {
    if (!details) return
    
    const filesToInsert = details.files.filter(f => selectedFileShas.has(f.sha))
    if (filesToInsert.length === 0) return

    const formattedContent = filesToInsert.map(file => {
        // Try to guess extension from filename for syntax highlighting
        const ext = file.filename.split('.').pop() || ''
        return `### ${file.filename}\n\n\`\`\`${ext}\n${file.patch || '// No patch available'}\n\`\`\`\n`
    }).join('\n')

    onInsert(formattedContent)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[85vw] h-[80vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex-1 min-w-0 mr-4">
                <DialogTitle className="flex items-center gap-2 truncate">
                    <span className="truncate">{commit?.commit.message.split('\n')[0]}</span>
                </DialogTitle>
                <DialogDescription>
                    {commit?.sha.substring(0, 7)} • {commit?.author?.login}
                </DialogDescription>
            </div>
            {details && (
                 <Button onClick={handleInsert} disabled={selectedFileShas.size === 0} size="sm">
                    Insert Selected ({selectedFileShas.size})
                 </Button>
            )}
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden gap-4 mt-4 min-h-0">
            {/* File List */}
            <div className="w-1/3 border-r pr-4 flex flex-col overflow-hidden min-h-0">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm text-zinc-500">Changed Files ({details?.files.length || 0})</h3>
                </div>
                {loading ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="animate-spin size-4" />
                    </div>
                ) : (
                    <ScrollArea className="flex-1 min-h-0 px-4">
                        <div className="flex flex-col gap-1">
                            {details?.files.map(file => (
                                <div
                                    key={file.sha}
                                    className={`flex items-center gap-2 p-2 rounded-md transition-colors ${selectedFile?.sha === file.sha ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                                >
                                    <Checkbox 
                                        checked={selectedFileShas.has(file.sha)}
                                        onCheckedChange={() => toggleFileSelection(file.sha)}
                                        onClick={(e) => e.stopPropagation()}
                                        id={`file-${file.sha}`}
                                    />
                                    <button
                                        onClick={() => setSelectedFile(file)}
                                        className="flex-1 text-left text-sm truncate flex items-center gap-2 min-w-0"
                                    >
                                        <FileCode className="size-3 shrink-0" />
                                        <span className="truncate">{file.filename}</span>
                                    </button>
                                     <span className={`text-xs shrink-0 ${
                                            file.status === 'added' ? 'text-green-600' :
                                            file.status === 'removed' ? 'text-red-600' :
                                            'text-blue-600'
                                        }`}>
                                            {file.status === 'modified' ? 'M' : file.status === 'added' ? 'A' : 'D'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </div>

            {/* File Diff View */}
            <div className="flex-1 flex flex-col min-w-0">
                 <h3 className="font-semibold mb-2 text-sm text-zinc-500 truncate">
                    {selectedFile?.filename || "Select a file"}
                 </h3>
                 <ScrollArea className="flex-1 border rounded-md bg-zinc-50 dark:bg-zinc-950 p-4 font-mono text-xs overflow-auto">
                    {selectedFile?.patch ? (
                        <pre className="whitespace-pre-wrap">
                            {selectedFile.patch.split('\n').map((line, i) => (
                                <div key={i} className={`${
                                    line.startsWith('+') ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                    line.startsWith('-') ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                                    ''
                                }`}>
                                    {line}
                                </div>
                            ))}
                        </pre>
                    ) : (
                        <div className="text-zinc-400 italic">
                             {loading ? "Loading..." : selectedFile ? "No patch available (binary or too large)" : "Select a file to view changes"}
                        </div>
                    )}
                 </ScrollArea>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
