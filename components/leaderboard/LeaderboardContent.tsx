// components/leaderboard/LeaderboardContent.tsx
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { getScoreTier, getScoreColor } from '@/lib/scoring/calculateScore'

interface Repository {
  id: string
  full_name: string
  owner: string
  name: string
  description: string | null
  language: string | null
  stars: number
  forks: number
  score: number
  complexity_score: number
  activity_score: number
  social_score: number
  health_score: number
  rank?: number
  url: string
}

interface UserVisualization {
  id: string
  repository_id: string
  repo_score: number
  visualization_mode: string
  created_at: string
  repositories: Repository
}

export default function LeaderboardContent() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'global' | 'personal'>('global')
  const [globalRepos, setGlobalRepos] = useState<Repository[]>([])
  const [userVisualizations, setUserVisualizations] = useState<UserVisualization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch global leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/leaderboard?limit=50')
        const result = await response.json()

        if (result.success) {
          setGlobalRepos(result.data)
        } else {
          setError('Failed to load leaderboard')
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
        setError('Error loading leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  // Fetch user history when tab changes
  useEffect(() => {
    if (activeTab === 'personal' && session?.user) {
      fetchUserHistory()
    }
  }, [activeTab, session])

  const fetchUserHistory = async () => {
    try {
      const response = await fetch('/api/leaderboard/user')
      const result = await response.json()

      if (result.success) {
        setUserVisualizations(result.data)
      } else {
        setError('Failed to load your history')
      }
    } catch (err) {
      console.error('Error fetching user history:', err)
      setError('Error loading your history')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-white mb-2">Repository Leaderboard</h1>
          <p className="text-slate-400">Discover the most interesting repositories visualized on CodeSoul</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('global')}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === 'global'
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              Global Rankings
            </button>
            {session?.user && (
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-4 px-2 border-b-2 transition-colors ${
                  activeTab === 'personal'
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-300'
                }`}
              >
                My Visualizations
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
            {error}
          </div>
        )}

        {loading && activeTab === 'global' ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-slate-400">Loading leaderboard...</div>
          </div>
        ) : activeTab === 'global' ? (
          <GlobalLeaderboard repos={globalRepos} />
        ) : session?.user ? (
          <PersonalHistory visualizations={userVisualizations} loading={loading} />
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">Sign in to view your visualization history</p>
          </div>
        )}
      </div>
    </div>
  )
}

function GlobalLeaderboard({ repos }: { repos: Repository[] }) {
  if (repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No repositories on the leaderboard yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-800/50 rounded-lg text-sm font-semibold text-slate-300">
        <div className="col-span-1">#</div>
        <div className="col-span-5">Repository</div>
        <div className="col-span-2">Language</div>
        <div className="col-span-4">Score Breakdown</div>
      </div>

      {repos.map((repo) => (
        <div
          key={repo.id}
          className="grid grid-cols-12 gap-4 px-4 py-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors border border-slate-700/50 hover:border-slate-600"
        >
          {/* Rank */}
          <div className="col-span-1 flex items-center">
            <span className="text-lg font-bold text-purple-400">{repo.rank || '-'}</span>
          </div>

          {/* Repository Info */}
          <div className="col-span-5">
            <Link href={repo.url} target="_blank" rel="noopener noreferrer">
              <div className="font-semibold text-white hover:text-purple-400 transition-colors">
                {repo.full_name}
              </div>
            </Link>
            {repo.description && (
              <p className="text-sm text-slate-400 line-clamp-1">{repo.description}</p>
            )}
            <div className="flex gap-4 mt-1 text-xs text-slate-400">
              <span>⭐ {repo.stars.toLocaleString()}</span>
              <span>🔀 {repo.forks.toLocaleString()}</span>
            </div>
          </div>

          {/* Language */}
          <div className="col-span-2 flex items-center">
            {repo.language ? (
              <span className="inline-block px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                {repo.language}
              </span>
            ) : (
              <span className="text-slate-500 text-sm">—</span>
            )}
          </div>

          {/* Score Breakdown */}
          <div className="col-span-4">
            <div className="flex items-center gap-3">
              <div className="text-right flex-1">
                <div className="flex gap-2 justify-end mb-1">
                  <ScoreTag label="C" value={repo.complexity_score} />
                  <ScoreTag label="A" value={repo.activity_score} />
                  <ScoreTag label="S" value={repo.social_score} />
                  <ScoreTag label="H" value={repo.health_score} />
                </div>
                <div className={`text-lg font-bold bg-gradient-to-r ${getScoreColor(repo.score)} bg-clip-text text-transparent`}>
                  {repo.score.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function PersonalHistory({
  visualizations,
  loading,
}: {
  visualizations: UserVisualization[]
  loading: boolean
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-slate-400">Loading your history...</div>
      </div>
    )
  }

  if (visualizations.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400 mb-4">You haven't visualized any repositories yet</p>
        <Link href="/dashboard">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            Start Visualizing
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-800/50 rounded-lg text-sm font-semibold text-slate-300">
        <div className="col-span-7">Repository</div>
        <div className="col-span-2">Mode</div>
        <div className="col-span-3">Score</div>
      </div>

      {visualizations.map((viz) => (
        <div
          key={viz.id}
          className="grid grid-cols-12 gap-4 px-4 py-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg transition-colors border border-slate-700/50 hover:border-slate-600"
        >
          {/* Repository Info */}
          <div className="col-span-7">
            <Link href={viz.repositories.url} target="_blank" rel="noopener noreferrer">
              <div className="font-semibold text-white hover:text-purple-400 transition-colors">
                {viz.repositories.full_name}
              </div>
            </Link>
            <p className="text-xs text-slate-400 mt-1">
              {new Date(viz.created_at).toLocaleDateString()} at{' '}
              {new Date(viz.created_at).toLocaleTimeString()}
            </p>
          </div>

          {/* Visualization Mode */}
          <div className="col-span-2 flex items-center">
            <span className="px-2 py-1 bg-slate-700 text-slate-200 rounded text-xs font-medium capitalize">
              {viz.visualization_mode === 'brain' ? '🧠 Neural' : '🌳 Tree'}
            </span>
          </div>

          {/* Score */}
          <div className="col-span-3 flex items-center justify-end">
            <div className="text-right">
              <div className={`text-xl font-bold bg-gradient-to-r ${getScoreColor(viz.repo_score)} bg-clip-text text-transparent`}>
                {viz.repo_score.toFixed(1)}
              </div>
              <div className="text-xs text-slate-400">{getScoreTier(viz.repo_score)} Tier</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ScoreTag({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center bg-slate-700/50 px-2 py-1 rounded text-xs">
      <span className="text-slate-400">{label}</span>
      <span className="font-semibold text-white">{value.toFixed(0)}</span>
    </div>
  )
}
