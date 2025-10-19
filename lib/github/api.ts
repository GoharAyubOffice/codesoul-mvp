// lib/github/api.ts
import { Octokit } from '@octokit/rest'

export interface GitHubRepoData {
  name: string
  full_name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  default_branch: string
  branches: GitHubBranch[]
  commits: GitHubCommit[]
}

export interface GitHubBranch {
  name: string
  commit: {
    sha: string
    url: string
  }
  protected: boolean
}

export interface GitHubCommit {
  sha: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    }
  }
  author: {
    login: string
  } | null
}

export async function fetchRepoData(owner: string, repo: string): Promise<GitHubRepoData> {
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN, // We'll add this to env
  })

  try {
    // Fetch repository basic info
    const { data: repoInfo } = await octokit.rest.repos.get({
      owner,
      repo,
    })

    // Fetch branches
    const { data: branches } = await octokit.rest.repos.listBranches({
      owner,
      repo,
      per_page: 100,
    })

    // Fetch recent commits from main branch
    const { data: commits } = await octokit.rest.repos.listCommits({
      owner,
      repo,
      sha: repoInfo.default_branch,
      per_page: 50,
    })

    return {
      name: repoInfo.name,
      full_name: repoInfo.full_name,
      description: repoInfo.description,
      language: repoInfo.language,
      stargazers_count: repoInfo.stargazers_count,
      forks_count: repoInfo.forks_count,
      created_at: repoInfo.created_at,
      updated_at: repoInfo.updated_at,
      default_branch: repoInfo.default_branch,
      branches: branches,
      commits: commits,
    }
  } catch (error) {
    console.error('Error fetching GitHub data:', error)
    throw new Error('Failed to fetch repository data from GitHub')
  }
}
