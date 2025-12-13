import { GitHubCommit, GitHubPR, GitHubSearchResult } from "./types"

const GITHUB_API_BASE = "https://api.github.com"

/**
 * Helper function to fetch data from GitHub API
 */
async function githubFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
  
  if (!token) {
    throw new Error("GITHUB_TOKEN is not defined in environment variables.")
  }

  const res = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github.v3+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}))
    throw new Error(
      `GitHub API Error: ${res.status} ${res.statusText} - ${errorBody.message || "Unknown error"}`
    )
  }

  return res.json()
}

/**
 * Fetch commits for the authenticated user on a specific date
 * We can use the Search API to find commits by author and date
 */
export async function fetchDailyCommits(date: Date, username: string): Promise<GitHubCommit[]> {
  // Format date as YYYY-MM-DD
  const dateStr = date.toISOString().split("T")[0]
  
  // Search query: author:USERNAME type:commit committer-date:YYYY-MM-DD
  const query = `author:${username} committer-date:${dateStr}`
  
  // Note: GitHub Search API has limitations.
  // Alternatively, we can list events for a user, but search is often more direct for "global" commits.
  // However, simple "list commits" is per repo. Global "what did I do today" is best found via:
  // 1. Events API (user public events) -> /users/{username}/events
  // 2. Search API (commits) -> /search/commits?q=... (Preview feature, accept header needed)
  
  // Let's try Search API for commits first as it mimics "Global contribution".
  // Note: "cloak-preview" is needed for commit search.
  
  const encodedQuery = encodeURIComponent(query)
  
  const data = await githubFetch<GitHubSearchResult<GitHubCommit>>(`/search/commits?q=${encodedQuery}&sort=committer-date&order=desc`, {
    headers: {
      Accept: "application/vnd.github.cloak-preview+json"
    }
  })

  return data.items
}

/**
 * Fetch PRs created or updated by user on a specific date
 */
export async function fetchDailyPRs(date: Date, username: string): Promise<GitHubPR[]> {
  const dateStr = date.toISOString().split("T")[0]
  
  // Query: author:USERNAME type:pr updated:YYYY-MM-DD
  // We check updated because a PR might be worked on (but not created) today.
  const query = `author:${username} type:pr updated:${dateStr}`
  const encodedQuery = encodeURIComponent(query)

  const data = await githubFetch<GitHubSearchResult<GitHubPR>>(`/search/issues?q=${encodedQuery}`)
  
  return data.items
}

export async function fetchUserEvents(username: string): Promise<any[]> {
    return githubFetch(`/users/${username}/events`)
}
