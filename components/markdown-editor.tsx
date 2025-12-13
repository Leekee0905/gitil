"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function MarkdownEditor({ value, onChange, className }: MarkdownEditorProps) {
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
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-2">
          <div className="min-h-[400px] w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 prose dark:prose-invert max-w-none overflow-y-auto">
            {value ? (
              <div className="whitespace-pre-wrap">{value}</div>
            ) : (
              <div className="text-zinc-500 italic">Nothing to preview yet.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
