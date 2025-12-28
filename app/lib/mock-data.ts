export interface Post {
  slug: string
  title: string
  author: string
  date: string
  summary: string
  content: string
  tags: string[]
}

const posts: Post[] = [
  {
    slug: "learning-nextjs-server-components",
    title: "Learning Next.js Server Components",
    author: "soosung",
    date: "2023-10-27",
    summary: "Today I dove deep into Next.js Server Components and how they differ from Client Components. It's fascinating how much logic we can move to the server.",
    content: `
# Learning Next.js Server Components

Today I dove deep into **Next.js Server Components** and how they differ from Client Components. It's fascinating how much logic we can move to the server.

## Key Takeaways

1. **Zero Bundle Size**: Server Components are not included in the client-side bundle. This drastically reduces the amount of JavaScript downloaded by the browser.
2. **Direct Database Access**: You can fetch data directly from your database inside a Server Component without needing an API layer!

\`\`\`tsx
async function getData() {
  const res = await db.query('SELECT * FROM posts')
  return res
}

export default async function Page() {
  const data = await getData()
  return <main>{/* ... */}</main>
}
\`\`\`

3. **Automatic Code Splitting**: Client components imported into Server Components are automatically code-split.

## Challenges

I struggled a bit with understanding **when** to use 'use client'. The rule of thumb seems to be: default to Server Components, and add 'use client' only when you need interactivity (useState, useEffect, onClick).
    `,
    tags: ["Next.js", "React", "Server Components"],
  },
  {
    slug: "building-accessible-forms",
    title: "Building Accessible Forms",
    author: "soosung",
    date: "2023-10-23",
    summary: "Accessibility should not be an afterthought. Here are 5 quick wins for better form a11y.",
    content: `
# Building Accessible Forms

Accessibility (a11y) should not be an afterthought. Here are 5 quick wins for better form a11y.

## 1. Always use labels

Don't just rely on placeholders. Placeholders disappear when the user starts typing.

\`\`\`html
<!-- Bad -->
<input type="text" placeholder="Username">

<!-- Good -->
<label htmlFor="username">Username</label>
<input id="username" type="text" />
\`\`\`

## 2. Indicate required fields clearly

Don't only use color to indicate errors or required fields. Use text or icons as well.

## 3. Keyboard Navigation

Ensure you can tab through the form logically. Don't use positive \`tabindex\` values if you can avoid it.
    `,
    tags: ["A11y", "HTML", "Forms"],
  },
]

export function getPostsByUsername(username: string): Post[] {
  // In a real app, we would filter by username
  // For mock purposes, we return all posts if the username mostly matches or just return all
  return posts.map(p => ({ ...p, author: username }))
}

export function getPostBySlug(username: string, slug: string): Post | undefined {
  const post = posts.find(p => p.slug === slug)
  if (post) {
      return { ...post, author: username }
  }
  return undefined
}

export function updatePost(username: string, slug: string, data: Partial<Post>) {
  console.log(`[Mock] Updating post ${slug} for ${username}`, data)
  // In a real app, this would update the DB
}
