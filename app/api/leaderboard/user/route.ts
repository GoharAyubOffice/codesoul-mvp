// app/api/leaderboard/user/route.ts
// GET: Fetch user's visualization history

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { getUserVisualizationHistory } from '@/lib/scoring/repositoryService'

/**
 * GET /api/leaderboard/user
 * Fetch authenticated user's visualization history
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)

    const userId = session.user.id || session.user.email || 'anonymous'
    const visualizations = await getUserVisualizationHistory(userId, limit)

    return NextResponse.json({
      success: true,
      data: visualizations,
      count: visualizations.length,
    })
  } catch (error) {
    console.error('Error fetching user history:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user history' },
      { status: 500 }
    )
  }
}
