// lib/scoring/calculateScore.ts
// Calculate repository scores based on multiple factors

import { GitHubRepoData } from '@/lib/github/api'

export interface ScoringComponents {
  complexity_score: number
  activity_score: number
  social_score: number
  health_score: number
  final_score: number
}

export interface ScoringMetadata {
  branches_count: number
  commits_count: number
  contributors_count: number
  recent_commits_7d: number
}

/**
 * Calculate comprehensive repository score
 * Combines code complexity, commit activity, social metrics, and repository health
 */
export function calculateRepositoryScore(repoData: GitHubRepoData): {
  score: ScoringComponents
  metadata: ScoringMetadata
} {
  // Extract metadata for scoring
  const metadata: ScoringMetadata = {
    branches_count: repoData.branches.length,
    commits_count: repoData.commits.length,
    contributors_count: extractContributorCount(repoData),
    recent_commits_7d: countRecentCommits(repoData, 7),
  }

  // Calculate individual scores (0-100)
  const complexity_score = calculateComplexityScore(repoData, metadata)
  const activity_score = calculateActivityScore(repoData, metadata)
  const social_score = calculateSocialScore(repoData)
  const health_score = calculateHealthScore(repoData, metadata)

  // Weighted average (all factors equally weighted for now)
  const final_score = (
    complexity_score * 0.25 +
    activity_score * 0.25 +
    social_score * 0.25 +
    health_score * 0.25
  )

  return {
    score: {
      complexity_score,
      activity_score,
      social_score,
      health_score,
      final_score: Math.round(final_score),
    },
    metadata,
  }
}

/**
 * Code Complexity Score (0-100)
 * Based on: branches, files, repository structure depth
 */
function calculateComplexityScore(repoData: GitHubRepoData, metadata: ScoringMetadata): number {
  const { branches_count, commits_count } = metadata

  // Branch complexity (0-40 points)
  // More branches = more complex (but diminishing returns)
  const branch_factor = Math.min(40, branches_count * 3)

  // Commit density - indicates file/feature count (0-40 points)
  // More commits with fewer branches = more focused work
  // More commits with many branches = complex distributed work
  const commit_factor = Math.min(40, (commits_count / 100) * 40)

  // Branching density (0-20 points)
  // Ratio of branches to commits indicates how well-managed the repo is
  const branch_density = Math.min(
    20,
    (branches_count / Math.max(commits_count, 1)) * 20
  )

  const complexity_score = branch_factor + commit_factor + branch_density
  return Math.min(100, complexity_score)
}

/**
 * Commit Activity Score (0-100)
 * Based on: recent commits, commit frequency, contributor count
 */
function calculateActivityScore(repoData: GitHubRepoData, metadata: ScoringMetadata): number {
  const { commits_count, recent_commits_7d, contributors_count } = metadata

  // Recent activity (0-40 points)
  // Heavily weight recent commits (7 days)
  const recent_factor = Math.min(40, recent_commits_7d * 5)

  // Historical activity (0-35 points)
  // Total commits indicate long-term development
  const historical_factor = Math.min(35, (commits_count / 1000) * 35)

  // Team size/contributor engagement (0-25 points)
  // More contributors = higher engagement
  const contributor_factor = Math.min(25, Math.sqrt(contributors_count) * 5)

  const activity_score = recent_factor + historical_factor + contributor_factor
  return Math.min(100, activity_score)
}

/**
 * Social Metrics Score (0-100)
 * Based on: stars, forks, watchers
 */
function calculateSocialScore(repoData: GitHubRepoData): number {
  const { stargazers_count, forks_count } = repoData

  // Star rating (0-60 points) - most important social metric
  // Logarithmic scale to handle wide range
  const star_factor = Math.min(60, Math.log10(stargazers_count + 1) * 15)

  // Fork ratio (0-40 points)
  // Forks indicate practical usage and community contributions
  const fork_factor = Math.min(40, Math.log10(forks_count + 1) * 10)

  const social_score = star_factor + fork_factor
  return Math.min(100, social_score)
}

/**
 * Repository Health Score (0-100)
 * Based on: recent updates, consistency of development, branch maintenance
 */
function calculateHealthScore(repoData: GitHubRepoData, metadata: ScoringMetadata): number {
  // Check if repo is actively maintained
  const lastCommitDate = new Date(repoData.commits[0]?.commit.author.date || repoData.updated_at)
  const daysSinceLastCommit = Math.floor(
    (new Date().getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24)
  )

  // Recency factor (0-50 points)
  // Recently active repos score higher
  let recency_factor = 50
  if (daysSinceLastCommit > 365) recency_factor = 10 // Not updated in a year
  else if (daysSinceLastCommit > 90) recency_factor = 25 // Not updated in 90 days
  else if (daysSinceLastCommit > 30) recency_factor = 40 // Not updated in 30 days
  else if (daysSinceLastCommit > 7) recency_factor = 45 // Not updated in a week

  // Development consistency (0-30 points)
  // Even distribution of commits indicates healthy development
  const commit_spread = calculateCommitSpread(repoData)
  const consistency_factor = commit_spread * 30

  // Protected branches (0-20 points)
  // Indicates good practices
  const protected_branch_factor = calculateProtectedBranchFactor(repoData) * 20

  const health_score = recency_factor + consistency_factor + protected_branch_factor
  return Math.min(100, health_score)
}

/**
 * Helper: Extract unique contributor count from commits
 */
function extractContributorCount(repoData: GitHubRepoData): number {
  const contributors = new Set<string>()
  repoData.commits.forEach(commit => {
    if (commit.author?.login) {
      contributors.add(commit.author.login)
    } else if (commit.commit.author.name) {
      contributors.add(commit.commit.author.name)
    }
  })
  return contributors.size
}

/**
 * Helper: Count commits in the last N days
 */
function countRecentCommits(repoData: GitHubRepoData, days: number): number {
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return repoData.commits.filter(commit => {
    const commitDate = new Date(commit.commit.author.date)
    return commitDate > cutoffDate
  }).length
}

/**
 * Helper: Calculate how evenly distributed commits are (0-1)
 * Perfect distribution = 1, concentrated = 0
 */
function calculateCommitSpread(repoData: GitHubRepoData): number {
  if (repoData.commits.length === 0) return 0

  // Count commits per day
  const commitsByDate = new Map<string, number>()
  repoData.commits.forEach(commit => {
    const date = commit.commit.author.date.split('T')[0]
    commitsByDate.set(date, (commitsByDate.get(date) || 0) + 1)
  })

  const dates = Array.from(commitsByDate.values())
  const average = repoData.commits.length / dates.length
  const variance = dates.reduce((sum, count) => sum + Math.pow(count - average, 2), 0) / dates.length
  const stdDev = Math.sqrt(variance)

  // Normalize: 0 = very concentrated, 1 = well distributed
  // Use coefficient of variation
  const cv = stdDev / (average + 1)
  return Math.max(0, 1 - Math.min(cv, 1))
}

/**
 * Helper: Calculate protected branch factor (0-1)
 */
function calculateProtectedBranchFactor(repoData: GitHubRepoData): number {
  if (repoData.branches.length === 0) return 0

  const protectedCount = repoData.branches.filter(b => b.protected).length
  return protectedCount / repoData.branches.length
}

/**
 * Format score components for display
 */
export function formatScoreDisplay(score: ScoringComponents): string {
  return `${score.final_score}/100`
}

/**
 * Get score tier (S, A, B, C, D)
 */
export function getScoreTier(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 85) return 'S'
  if (score >= 70) return 'A'
  if (score >= 55) return 'B'
  if (score >= 40) return 'C'
  return 'D'
}

/**
 * Get score color for UI (tailwind compatible)
 */
export function getScoreColor(score: number): string {
  if (score >= 85) return 'from-green-500 to-emerald-600'
  if (score >= 70) return 'from-blue-500 to-cyan-600'
  if (score >= 55) return 'from-yellow-500 to-orange-600'
  if (score >= 40) return 'from-orange-500 to-red-600'
  return 'from-red-500 to-red-700'
}
