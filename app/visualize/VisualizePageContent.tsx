// app/visualize/VisualizePageContent.tsx
"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ShareButton from '@/components/ShareButton'
import { calculateRepositoryScore, getScoreTier, getScoreColor } from '@/lib/scoring/calculateScore'

// Dynamically import Three.js components to avoid SSR issues
const NeuralRepoViz = dynamic(() => import('@/components/viz/NeuralRepo'), {
  ssr: false,
  loading: () => <div className="text-center py-8">Loading Neural Network...</div>
})

const CodeTreeViz = dynamic(() => import('@/components/viz/CodeTree'), {
  ssr: false,
  loading: () => <div className="text-center py-8">Loading Code Tree...</div>
})

type VizMode = 'brain' | 'tree'

export default function VisualizePageContent({ repoUrl }: { repoUrl: string }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [vizMode, setVizMode] = useState<VizMode>('brain')
  const [aiCaption, setAiCaption] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const [repoScore, setRepoScore] = useState<number | null>(null)
  const [visualizationSaved, setVisualizationSaved] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
    if (status === 'authenticated' && !repoUrl) {
      router.push('/dashboard')
    }
  }, [status, repoUrl, router])

  const handleModeChange = (mode: VizMode) => {
    startTransition(() => {
      setVizMode(mode)
    })
  }

  // Fetch repository data
  const { data: repoData, isLoading, error } = useQuery({
    queryKey: ['repoData', repoUrl],
    queryFn: async () => {
      const response = await fetch(`/api/github/process?repo=${encodeURIComponent(repoUrl!)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch repository data')
      }
      return response.json()
    },
    enabled: !!repoUrl
  })

  // Generate AI caption
  const generateCaptionMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/ai/caption', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoData }),
      })
      if (!response.ok) {
        throw new Error('Failed to generate caption')
      }
      return response.json()
    },
    onSuccess: (data) => {
      setAiCaption(data.caption)
    },
    onError: (error) => {
      console.error('Error generating caption:', error)
      setAiCaption('Code visualization complete! 🧠✨')
    }
  })

  // Save visualization to leaderboard
  const saveVisualizationMutation = useMutation({
    mutationFn: async (score: any) => {
      if (!repoData?.metadata?.repoName) {
        throw new Error('Repository data not available')
      }

      // Extract owner and repo from full_name (e.g., "facebook/react")
      const [owner, repo] = repoData.metadata.repoName.split('/')
      if (!owner || !repo) {
        throw new Error('Invalid repository name format')
      }

      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          github_repo_id: repoData.metadata?.repoId || undefined,
          full_name: repoData.metadata.repoName,
          owner: owner,
          name: repo,
          url: `https://github.com/${repoData.metadata.repoName}`,
          description: repoData.metadata?.description || null,
          language: repoData.metadata?.language || null,
          stars: repoData.metadata?.stars || 0,
          forks: repoData.metadata?.forks || 0,
          visualization_mode: vizMode,
          repo_score: score.final_score,
          complexity_score: score.complexity_score,
          activity_score: score.activity_score,
          social_score: score.social_score,
          health_score: score.health_score,
          branches_count: repoData.metadata?.totalBranches || 0,
          commits_count: repoData.metadata?.totalCommits || 0,
        }),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save visualization')
      }
      return response.json()
    },
    onSuccess: () => {
      setVisualizationSaved(true)
    },
    onError: (error) => {
      console.error('Error saving visualization:', error)
    }
  })

  // Calculate and save score when data loads
  useEffect(() => {
    if (repoData?.metadata && !repoScore && !visualizationSaved) {
      // Note: We need to pass the full GitHubRepoData to calculateRepositoryScore
      // For now, we'll calculate from the metadata we have
      // In a real scenario, you'd want to pass the full data
      const estimatedScore = Math.min(100, Math.max(0,
        (Math.log10(repoData.metadata.stars + 1) * 15) +
        (Math.log10(repoData.metadata.forks + 1) * 10) +
        (Math.min(50, repoData.metadata.totalBranches * 3)) +
        (Math.min(35, (repoData.metadata.totalCommits / 1000) * 35))
      ))

      setRepoScore(estimatedScore)

      // Auto-save visualization
      if (session?.user) {
        saveVisualizationMutation.mutate({
          final_score: estimatedScore,
          complexity_score: Math.min(50, repoData.metadata.totalBranches * 3),
          activity_score: Math.min(35, (repoData.metadata.totalCommits / 1000) * 35),
          social_score: (Math.log10(repoData.metadata.stars + 1) * 15),
          health_score: 25,
        })
      }
    }
  }, [repoData, repoScore, visualizationSaved, session])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    router.push('/')
    return null
  }

  if (!repoUrl) {
    router.push('/dashboard')
    return null
  }

  const handleGenerateCaption = () => {
    generateCaptionMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg mb-4">Processing Repository...</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600 mb-4">Error loading repository</div>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:underline">
                ← Back to Dashboard
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">
                {repoData?.metadata?.repoName || 'Repository Visualization'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {session.user?.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Visualization Mode Toggle */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-4">
            <button
              onClick={() => handleModeChange('brain')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                vizMode === 'brain'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🧠 Neural Network
            </button>
            <button
              onClick={() => handleModeChange('tree')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                vizMode === 'tree'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🌳 Code Tree
            </button>
          </div>
        </div>
      </div>

      {/* AI Caption Section */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            {aiCaption ? (
              <div className="text-sm text-gray-700">
                <span className="font-medium">AI Caption:</span> {aiCaption}
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Generate an AI caption for this visualization
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateCaption}
              disabled={generateCaptionMutation.isPending}
              className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
              {generateCaptionMutation.isPending ? 'Generating...' : 'Generate Caption'}
            </button>
            <ShareButton 
              repoData={repoData} 
              aiCaption={aiCaption} 
              vizMode={vizMode}
            />
          </div>
        </div>
      </div>

      {/* Visualization Container */}
      <main className="flex-1">
        <div className={`h-[calc(100vh-200px)] ${isPending ? 'fade-out' : 'fade-in'}`}>
          {vizMode === 'brain' ? (
            <NeuralRepoViz data={repoData} />
          ) : (
            <CodeTreeViz data={repoData} />
          )}
        </div>
      </main>

      {/* Repository Info & Score */}
      {repoData?.metadata && (
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border-t p-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Branches</div>
                <div className="text-lg font-semibold text-gray-900">{repoData.metadata.totalBranches}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Commits</div>
                <div className="text-lg font-semibold text-gray-900">{repoData.metadata.totalCommits}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Language</div>
                <div className="text-lg font-semibold text-gray-900">{repoData.metadata.language || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Stars</div>
                <div className="text-lg font-semibold text-gray-900">{repoData.metadata.stars.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Forks</div>
                <div className="text-lg font-semibold text-gray-900">{repoData.metadata.forks.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Last Updated</div>
                <div className="text-lg font-semibold text-gray-900">{new Date(repoData.metadata.lastUpdated).toLocaleDateString()}</div>
              </div>
            </div>

            {/* Score Display */}
            {repoScore !== null && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">CodeSoul Score</div>
                    <div className="flex items-center space-x-2">
                      <div className={`text-3xl font-bold bg-gradient-to-r ${getScoreColor(repoScore)} bg-clip-text text-transparent`}>
                        {repoScore.toFixed(1)}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold px-2 py-1 rounded ${
                          repoScore >= 85 ? 'bg-green-100 text-green-700' :
                          repoScore >= 70 ? 'bg-blue-100 text-blue-700' :
                          repoScore >= 55 ? 'bg-yellow-100 text-yellow-700' :
                          repoScore >= 40 ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {getScoreTier(repoScore)} Tier
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Link href="/leaderboard" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View Leaderboard →
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
