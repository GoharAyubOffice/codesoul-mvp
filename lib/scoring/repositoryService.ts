// lib/scoring/repositoryService.ts
// Service for managing repository data in Supabase

import { supabase } from '@/lib/supabase'
import { GitHubRepoData } from '@/lib/github/api'
import { calculateRepositoryScore } from './calculateScore'
import { Repository, RepositoryInsert, UserVisualization, UserVisualizationInsert } from '@/types/database'

/**
 * Get or create a repository record with calculated scores
 */
export async function upsertRepository(repoData: GitHubRepoData, githubRepoId: number) {
  try {
    const { score, metadata } = calculateRepositoryScore(repoData)

    const repositoryData: RepositoryInsert = {
      github_repo_id: githubRepoId,
      owner: repoData.full_name.split('/')[0],
      name: repoData.name,
      full_name: repoData.full_name,
      url: `https://github.com/${repoData.full_name}`,
      description: repoData.description,
      language: repoData.language,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      score: score.final_score,
      complexity_score: score.complexity_score,
      activity_score: score.activity_score,
      social_score: score.social_score,
      health_score: score.health_score,
      branches_count: metadata.branches_count,
      commits_count: metadata.commits_count,
      contributors_count: metadata.contributors_count,
      recent_commits_7d: metadata.recent_commits_7d,
    }

    const { data, error } = await supabase
      .from('repositories')
      .upsert(repositoryData, { onConflict: 'full_name' })
      .select()
      .single()

    if (error) {
      console.error('Error upserting repository:', error)
      throw error
    }

    return data as Repository
  } catch (error) {
    console.error('Failed to upsert repository:', error)
    throw error
  }
}

/**
 * Record a user visualization
 */
export async function recordUserVisualization(
  userId: string,
  repositoryId: string,
  visualizationMode: 'brain' | 'tree',
  repoScore: number,
  scores: {
    complexity_score: number
    activity_score: number
    social_score: number
    health_score: number
  }
) {
  try {
    const visualizationData: UserVisualizationInsert = {
      user_id: userId,
      repository_id: repositoryId,
      repo_score: repoScore,
      complexity_score: scores.complexity_score,
      activity_score: scores.activity_score,
      social_score: scores.social_score,
      health_score: scores.health_score,
      visualization_mode: visualizationMode,
    }

    const { data, error } = await supabase
      .from('user_visualizations')
      .insert(visualizationData)
      .select()
      .single()

    if (error) {
      console.error('Error recording visualization:', error)
      throw error
    }

    return data as UserVisualization
  } catch (error) {
    console.error('Failed to record visualization:', error)
    throw error
  }
}

/**
 * Get top repositories (leaderboard)
 */
export async function getTopRepositories(limit: number = 50) {
  try {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching top repositories:', error)
      throw error
    }

    return (data || []) as Repository[]
  } catch (error) {
    console.error('Failed to get top repositories:', error)
    throw error
  }
}

/**
 * Get user's visualization history
 */
export async function getUserVisualizationHistory(userId: string, limit: number = 20) {
  try {
    const { data, error } = await supabase
      .from('user_visualizations')
      .select(`
        *,
        repositories (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching user history:', error)
      throw error
    }

    return (data || []) as any[]
  } catch (error) {
    console.error('Failed to get user history:', error)
    throw error
  }
}

/**
 * Find repository by full name
 */
export async function findRepositoryByFullName(fullName: string) {
  try {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .eq('full_name', fullName)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is normal
      console.error('Error finding repository:', error)
      throw error
    }

    return (data || null) as Repository | null
  } catch (error) {
    console.error('Failed to find repository:', error)
    throw error
  }
}

/**
 * Search repositories by owner or name
 */
export async function searchRepositories(query: string, limit: number = 20) {
  try {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .or(`owner.ilike.%${query}%,name.ilike.%${query}%`)
      .order('score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error searching repositories:', error)
      throw error
    }

    return (data || []) as Repository[]
  } catch (error) {
    console.error('Failed to search repositories:', error)
    throw error
  }
}

/**
 * Get repository with visualization count
 */
export async function getRepositoryWithStats(fullName: string) {
  try {
    const { data: repo, error: repoError } = await supabase
      .from('repositories')
      .select('*')
      .eq('full_name', fullName)
      .single()

    if (repoError && repoError.code !== 'PGRST116') {
      throw repoError
    }

    if (!repo) return null

    // Get visualization count
    const { count, error: countError } = await supabase
      .from('user_visualizations')
      .select('*', { count: 'exact' })
      .eq('repository_id', repo.id)

    if (countError) {
      console.error('Error counting visualizations:', countError)
    }

    return {
      ...repo,
      visualization_count: count || 0,
    }
  } catch (error) {
    console.error('Failed to get repository with stats:', error)
    throw error
  }
}
