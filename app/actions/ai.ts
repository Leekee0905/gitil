"use server"

import { GitHubCommit, GitHubPR } from "@/app/lib/github/types"
import { formatCommitsForAI, formatPRsForAI } from "@/app/lib/ai/utils"
import { generateSummary } from "@/app/lib/ai/service"

export type AISummaryResult = {
    data: string | null
    error: string | null
}

export async function generateDailySummary(
    type: 'commit' | 'pr', 
    data: GitHubCommit[] | GitHubPR[]
): Promise<AISummaryResult> {
    try {
        let formattedContent = ""
        
        if (type === 'commit') {
            formattedContent = formatCommitsForAI(data as GitHubCommit[])
        } else {
            formattedContent = formatPRsForAI(data as GitHubPR[])
        }

        const summary = await generateSummary(formattedContent)
        return { data: summary, error: null }

    } catch (error) {
        console.error("AI Generation Error:", error)
        return { 
            data: null, 
            error: error instanceof Error ? error.message : "Unknown error during AI generation" 
        }
    }
}
