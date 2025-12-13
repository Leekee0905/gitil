"use server"

import { createClient } from "@/app/lib/supabase/server"
import { fetchDailyCommits, fetchDailyPRs } from "@/app/lib/github/service"
import { GitHubCommit, GitHubPR } from "@/app/lib/github/types"

export type FetchResult<T> = {
  data: T[] | null
  error: string | null
}

async function getGitHubUsername(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  // Supabase Auth with GitHub usually puts the username in user_metadata.user_name or preferred_username
  return user.user_metadata?.user_name || user.user_metadata?.preferred_username || null
}

export async function getDailyCommits(date: Date): Promise<FetchResult<GitHubCommit>> {
  try {
    const username = await getGitHubUsername()
    if (!username) {
      return { data: null, error: "User not authenticated or GitHub username missing." }
    }

    const commits = await fetchDailyCommits(date, username)
    return { data: commits, error: null }
  } catch (error) {
    console.error("Failed to fetch daily commits:", error)
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getDailyPRs(date: Date): Promise<FetchResult<GitHubPR>> {
  try {
    const username = await getGitHubUsername()
    if (!username) {
      return { data: null, error: "User not authenticated or GitHub username missing." }
    }

    const prs = await fetchDailyPRs(date, username)
    return { data: prs, error: null }
  } catch (error) {
     console.error("Failed to fetch daily PRs:", error)
     return { data: null, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
