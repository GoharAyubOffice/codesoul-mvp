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
      visualization_mode,
      repo_score,
      complexity_score,
      activity_score,
      social_score,
      health_score,
    } = body

    // Validate required fields
    if (!repository_id || !visualization_mode || repo_score === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Record visualization
    const visualization = await recordUserVisualization(
      session.user.id || session.user.email || 'anonymous',
      repository_id,
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
