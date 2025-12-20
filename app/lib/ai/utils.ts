import { GitHubCommit, GitHubPR } from "../github/types"

const MAX_TOTAL_CHARS = 12000
const MAX_ITEM_COUNT = 20
const MAX_MESSAGE_LENGTH = 300

export function formatCommitsForAI(commits: GitHubCommit[]): string {
  // 1. Sort by date (usually already sorted, but good to ensure latest first or last depending on need, we'll take top N)
  const targetCommits = commits.slice(0, MAX_ITEM_COUNT)

  let formatted = "Here are the recent git commits:\n\n"

  for (const commit of targetCommits) {
    const message = commit.commit.message || ""
    
    // Filter out trivial merge commits or version bumps if needed, 
    // but for now we just truncate lengthy messages.
    const truncatedMessage = message.length > MAX_MESSAGE_LENGTH 
      ? message.substring(0, MAX_MESSAGE_LENGTH) + "..." 
      : message

    const entry = `- Commit: ${truncatedMessage}\n  Link: ${commit.html_url}\n`
    
    // Check if adding this entry exceeds global limit
    if (formatted.length + entry.length > MAX_TOTAL_CHARS) {
      formatted += "\n[Truncated due to length limit]"
      break
    }

    formatted += entry
  }

  return formatted
}

export function formatPRsForAI(prs: GitHubPR[]): string {
  const targetPRs = prs.slice(0, MAX_ITEM_COUNT)

  let formatted = "Here are the recent Pull Requests:\n\n"

  for (const pr of targetPRs) {
    const body = pr.body || ""
    const truncatedBody = body.length > MAX_MESSAGE_LENGTH 
        ? body.substring(0, MAX_MESSAGE_LENGTH) + "..." 
        : body

    const entry = `- PR: ${pr.title}\n  State: ${pr.state}\n  Description: ${truncatedBody}\n  Link: ${pr.html_url}\n`

    if (formatted.length + entry.length > MAX_TOTAL_CHARS) {
        formatted += "\n[Truncated due to length limit]"
        break
    }
    
    formatted += entry
  }

  return formatted
}
