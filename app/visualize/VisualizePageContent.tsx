// app/visualize/VisualizePageContent.tsx
"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState, useTransition, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ShareButton from '@/components/ShareButton'

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

      {/* Repository Info */}
      {repoData?.metadata && (
        <div className="bg-white border-t p-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Branches: {repoData.metadata.totalBranches}</span>
              <span>Commits: {repoData.metadata.totalCommits}</span>
              <span>Language: {repoData.metadata.language || 'Unknown'}</span>
              <span>Stars: {repoData.metadata.stars}</span>
              <span>Last Updated: {new Date(repoData.metadata.lastUpdated).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
