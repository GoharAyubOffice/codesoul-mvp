// lib/github/transformer.ts
import { GitHubRepoData, GitHubBranch, GitHubCommit } from './api'

export interface GraphNode {
  id: string
  size: number
  color: string
  type: 'root' | 'branch' | 'commit'
  label: string
  metadata?: {
    commits?: number
    lastCommit?: string
    author?: string
  }
}

export interface GraphLink {
  source: string
  target: string
  weight: number
  type: 'merge' | 'commit'
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
  metadata: {
    repoName: string
    totalBranches: number
    totalCommits: number
    lastUpdated: string
    language: string | null
    stars: number
    forks: number
  }
}

export function transformToGraph(data: GitHubRepoData): GraphData {
  const nodes: GraphNode[] = []
  const links: GraphLink[] = []

  // Create main branch node
  const mainBranch = data.branches.find(b => b.name === data.default_branch) || data.branches[0]
  nodes.push({
    id: 'main',
    size: 8,
    color: '#00ffaa',
    type: 'root',
    label: mainBranch.name,
    metadata: {
      commits: data.commits.length,
      lastCommit: data.commits[0]?.commit.author.date,
    }
  })

  // Create branch nodes
  data.branches.forEach((branch, index) => {
    if (branch.name === data.default_branch) return // Skip main branch

    const branchCommits = data.commits.filter(commit => 
      commit.commit.message.toLowerCase().includes(branch.name.toLowerCase()) ||
      commit.commit.message.toLowerCase().includes('merge')
    )

    nodes.push({
      id: branch.name,
      size: Math.max(2, Math.min(6, branchCommits.length)),
      color: getBranchColor(index),
      type: 'branch',
      label: branch.name,
      metadata: {
        commits: branchCommits.length,
        lastCommit: branchCommits[0]?.commit.author.date,
      }
    })

    // Link branch to main
    links.push({
      source: branch.name,
      target: 'main',
      weight: branchCommits.length,
      type: 'merge'
    })
  })

  // Add recent commits as nodes (limit to 10 most recent)
  const recentCommits = data.commits.slice(0, 10)
  recentCommits.forEach((commit, index) => {
    const commitId = `commit-${commit.sha.substring(0, 7)}`
    
    nodes.push({
      id: commitId,
      size: 1,
      color: '#ffffff',
      type: 'commit',
      label: commit.commit.message.substring(0, 30) + '...',
      metadata: {
        author: commit.author?.login || commit.commit.author.name,
        lastCommit: commit.commit.author.date,
      }
    })

    // Link commit to main branch
    links.push({
      source: commitId,
      target: 'main',
      weight: 1,
      type: 'commit'
    })
  })

  return {
    nodes,
    links,
    metadata: {
      repoName: data.full_name,
      totalBranches: data.branches.length,
      totalCommits: data.commits.length,
      lastUpdated: data.updated_at,
      language: data.language,
      stars: data.stargazers_count,
      forks: data.forks_count,
    }
  }
}

function getBranchColor(index: number): string {
  const colors = [
    '#ff6b6b', // Red
    '#4ecdc4', // Teal
    '#45b7d1', // Blue
    '#96ceb4', // Green
    '#feca57', // Yellow
    '#ff9ff3', // Pink
    '#54a0ff', // Light Blue
    '#5f27cd', // Purple
    '#00d2d3', // Cyan
    '#ff9f43', // Orange
  ]
  return colors[index % colors.length]
}
