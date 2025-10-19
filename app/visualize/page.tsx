// app/visualize/page.tsx
"use client"
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

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

function VisualizeContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const repoUrl = searchParams.get('repo')
  const [vizMode, setVizMode] = useState<VizMode>('brain')

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

  // Fetch repository data
  const { data: repoData, isLoading, error } = useQuery({
    queryKey: ['repoData', repoUrl],
    queryFn: async () => {
      const response = await fetch(`/api/github/process?repo=${encodeURIComponent(repoUrl)}`)
      if (!response.ok) {
        throw new Error('Failed to fetch repository data')
      }
      return response.json()
    },
    enabled: !!repoUrl
  })

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
              onClick={() => setVizMode('brain')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                vizMode === 'brain'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🧠 Neural Network
            </button>
            <button
              onClick={() => setVizMode('tree')}
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

      {/* Visualization Container */}
      <main className="flex-1">
        <div className="h-[calc(100vh-140px)]">
          {vizMode === 'brain' ? (
            <NeuralRepoViz data={repoData} />
          ) : (
            <CodeTreeViz data={repoData} />
          )}
        </div>
      </main>

      {/* Repository Info */}
      {repoData?.metadata && (
        <div className="bg-white border-t p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Branches: {repoData.metadata.totalBranches}</span>
              <span>Commits: {repoData.metadata.totalCommits}</span>
              <span>Last Updated: {new Date(repoData.metadata.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function VisualizePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VisualizeContent />
    </Suspense>
  )
}
