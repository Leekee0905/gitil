export type GitHubUser = {
  login: string
  id: number
  avatar_url: string
  html_url: string
}

export type GitHubCommit = {
  sha: string
  node_id: string
  commit: {
    author: {
      name: string
      email: string
      date: string
    }
    message: string
    url: string
  }
  html_url: string
  author: GitHubUser | null
  repository: {
    full_name: string
    name: string
    owner: {
      login: string
    }
  }
}

export type GitHubFile = {
  sha: string
  filename: string
  status: "added" | "removed" | "modified" | "renamed" | "copied" | "changed" | "unchanged"
  additions: number
  deletions: number
  changes: number
  blob_url: string
  raw_url: string
  contents_url: string
  patch?: string
}

export type GitHubCommitDetail = {
  sha: string
  node_id: string
  commit: GitHubCommit["commit"]
  url: string
  html_url: string
  author: GitHubUser | null
  files: GitHubFile[]
  stats: {
    total: number
    additions: number
    deletions: number
  }
}

export type GitHubPR = {
  id: number
  node_id: string
  html_url: string
  number: number
  state: "open" | "closed"
  title: string
  body: string | null
  user: GitHubUser
  created_at: string
  updated_at: string
  closed_at: string | null
  merged_at: string | null
}

export type GitHubSearchResult<T> = {
  total_count: number
  incomplete_results: boolean
  items: T[]
}
