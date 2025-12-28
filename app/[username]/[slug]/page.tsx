import { getPostBySlug } from "@/app/lib/mock-data"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CalendarDays, GitCommit, ArrowLeft, PenSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PageProps {
  params: Promise<{
    username: string
    slug: string
  }>
}

export default async function PostDetailPage(props: PageProps) {
  const params = await props.params;
  const username = params.username
  const slug = params.slug

  const post = getPostBySlug(username, slug)

  if (!post) {
      notFound()
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
       <div className="mb-8 flex items-center justify-between">
          <Link href={`/${username}`}>
             <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent hover:text-green-600 cursor-pointer">
                <ArrowLeft className="size-4" /> Back to Profile
             </Button>
          </Link>

          {/* Mock Auth Check: Show edit for everyone for testing */}
          <Link href={`/write?slug=${slug}&mode=edit`}>
              <Button variant="outline" className="gap-2">
                <PenSquare className="size-4" /> Edit Post
              </Button>
          </Link>
       </div>

       <article>
           <header className="mb-8 space-y-4">
               <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
               
               <div className="flex items-center gap-4 text-zinc-500">
                   <div className="flex items-center gap-1">
                       <GitCommit className="size-4" />
                       <span>{post.author}</span>
                   </div>
                   <div className="flex items-center gap-1">
                       <CalendarDays className="size-4" />
                       <span>{post.date}</span>
                   </div>
               </div>

               <div className="flex gap-2 pt-2">
                   {post.tags.map(tag => (
                       <Badge key={tag} variant="secondary">
                           {tag}
                       </Badge>
                   ))}
               </div>
           </header>
           
           <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                      code({className, children, ...props}: React.ComponentPropsWithoutRef<'code'> & { inline?: boolean }) {
                          const match = /language-(\w+)/.exec(className || '')
                          const { inline, ...rest } = props
                          return !inline && match ? (
                              <SyntaxHighlighter
                                  {...rest}
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                              >
                                  {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                          ) : (
                              <code {...rest} className={className}>
                                  {children}
                              </code>
                          )
                      }
                  }}
              >
                  {post.content}
              </ReactMarkdown>
           </div>
       </article>
    </div>
  )
}
