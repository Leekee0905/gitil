"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>
}

export function MarkdownEditor({ value, onChange, className, textareaRef }: MarkdownEditorProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Tabs defaultValue="write" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[200px]">
          <TabsTrigger value="write">Write</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-2">
          <Textarea
            placeholder="Write your TIL here... (Markdown supported)"
            className="min-h-[400px] font-mono resize-none focus-visible:ring-green-500/20"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            ref={textareaRef}
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div className="min-h-[400px] w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 overflow-y-auto">
            {value ? (
              <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({inline, className, children, ref, ...props}: { inline?: boolean, className?: string, children?: React.ReactNode } & React.ComponentProps<'code'>) {
                            const match = /language-(\w+)/.exec(className || '')
                            return !inline && match ? (
                                <SyntaxHighlighter
                                    {...props}
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            ) : (
                                <code {...props} className={className}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                >
                    {value}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-zinc-500 italic">Nothing to preview yet.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
