// app/api/leaderboard/route.ts
// GET: Fetch top repositories
// POST: Save a new visualization

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getTopRepositories, recordUserVisualization, findRepositoryByFullName } from '@/lib/scoring/repositoryService'

/**
 * GET /api/leaderboard
 * Fetch top repositories with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    const repositories = await getTopRepositories(limit + offset)
    const paginatedRepos = repositories.slice(offset, offset + limit)

    // Add ranking
    const ranked = paginatedRepos.map((repo, index) => ({
      ...repo,
      rank: offset + index + 1,
    }))

    return NextResponse.json({
      success: true,
      data: ranked,
      total: repositories.length,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/leaderboard
 * Record a new visualization (requires authentication)
 * Accepts either repository_id (if repo already in DB) or full repository data
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      repository_id,
      full_name,
      owner,
      name,
      url,
      description,
      language,
      stars,
      forks,
      visualization_mode,
      repo_score,
      complexity_score,
      activity_score,
      social_score,
      health_score,
      branches_count,
      commits_count,
    } = body

    // Validate required fields
    if (!visualization_mode || repo_score === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let repoId = repository_id
    let githubRepoId = body.github_repo_id

    // If repository_id not provided, create/upsert the repository first
    if (!repoId && full_name) {
      try {
        const { supabase } = await import('@/lib/supabase')

        // Use provided github_repo_id or generate a hash
        if (!githubRepoId) {
          githubRepoId = Math.abs(
            full_name.split('').reduce((a, b) => {
              a = (a << 5) - a + b.charCodeAt(0)
              return a & a
            }, 0)
          )
        }

        // Upsert repository
        const { data: repoData, error: repoError } = await supabase
          .from('repositories')
          .upsert(
            {
              github_repo_id: githubRepoId,
              owner: owner || full_name.split('/')[0],
              name: name || full_name.split('/')[1],
              full_name: full_name,
              url: url || `https://github.com/${full_name}`,
              description: description,
              language: language,
              stars: stars || 0,
              forks: forks || 0,
              watchers: 0,
              score: repo_score,
              complexity_score: complexity_score || 0,
              activity_score: activity_score || 0,
              social_score: social_score || 0,
              health_score: health_score || 0,
              branches_count: branches_count || 0,
              commits_count: commits_count || 0,
              contributors_count: 0,
              recent_commits_7d: 0,
            },
            { onConflict: 'full_name' }
          )
          .select()
          .single()

        if (repoError) {
          console.error('Error upserting repository:', repoError)
          throw repoError
        }

        repoId = repoData?.id
      } catch (error) {
        console.error('Error creating repository record:', error)
        throw error
      }
    }

    if (!repoId) {
      return NextResponse.json(
        { success: false, error: 'Could not create repository record' },
        { status: 400 }
      )
    }

    // Record visualization
    const visualization = await recordUserVisualization(
      session.user.id || session.user.email || 'anonymous',
      repoId,
      visualization_mode,
      repo_score,
      {
        complexity_score: complexity_score || 0,
        activity_score: activity_score || 0,
        social_score: social_score || 0,
        health_score: health_score || 0,
      }
    )

    return NextResponse.json({
      success: true,
      data: visualization,
    })
  } catch (error) {
    console.error('Error recording visualization:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record visualization' },
      { status: 500 }
    )
  }
}
