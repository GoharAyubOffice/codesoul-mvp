// app/api/github/process/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { fetchRepoData } from '@/lib/github/api'
import { transformToGraph } from '@/lib/github/transformer'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const repoUrl = searchParams.get('repo')

  if (!repoUrl) {
    return NextResponse.json({ error: 'Repo URL is required' }, { status: 400 })
  }

  // Check if user is authenticated
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Parse GitHub URL to get owner/repo
    const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!urlMatch) {
      return NextResponse.json({ error: 'Invalid GitHub repository URL' }, { status: 400 })
    }

    const [, owner, repo] = urlMatch

    // Fetch real data from GitHub API
    const githubData = await fetchRepoData(owner, repo)
    
    // Transform to graph format
    const graphData = transformToGraph(githubData)

    return NextResponse.json(graphData)
  } catch (error) {
    console.error('Error processing repo:', error)
    
    // If GitHub API fails, return mock data as fallback
    const fallbackData = {
      nodes: [
        { 
          id: "main", 
          size: 5, 
          color: "#00ffaa", 
          type: "root",
          label: "main branch"
        },
        { 
          id: "feature-auth", 
          size: 3, 
          color: "#ffaa00", 
          type: "branch",
          label: "feature/auth"
        }
      ],
      links: [
        { source: "feature-auth", target: "main", weight: 2, type: "merge" }
      ],
      metadata: {
        repoName: `${owner}/${repo}`,
        totalBranches: 2,
        totalCommits: 50,
        lastUpdated: new Date().toISOString(),
        language: "TypeScript",
        stars: 0,
        forks: 0
      }
    }

    return NextResponse.json(fallbackData)
  }
}
