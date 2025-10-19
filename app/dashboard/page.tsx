// app/dashboard/page.tsx
"use client"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [repoUrl, setRepoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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

  const handleVisualize = async () => {
    if (!repoUrl.trim()) return
    
    setIsLoading(true)
    try {
      // Navigate to visualize page with repo URL
      const encodedUrl = encodeURIComponent(repoUrl.trim())
      router.push(`/visualize?repo=${encodedUrl}`)
    } catch (error) {
      console.error('Error navigating to visualize:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const isValidGitHubUrl = (url: string) => {
    const githubRegex = /^https:\/\/github\.com\/[^\/]+\/[^\/]+/
    return githubRegex.test(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                CodeSoul Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user?.name}
              </span>
              <Link 
                href="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Visualize Your Repository 🧠🌳
          </h2>
          <p className="text-lg text-gray-600">
            Enter a GitHub repository URL to see it come alive as a neural network or code tree
          </p>
        </div>

        {/* Repo Input Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="repo-url" className="block text-sm font-medium text-gray-700 mb-2">
                GitHub Repository URL
              </label>
              <input
                id="repo-url"
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {repoUrl && !isValidGitHubUrl(repoUrl) && (
                <p className="mt-2 text-sm text-red-600">
                  Please enter a valid GitHub repository URL
                </p>
              )}
            </div>

            <button
              onClick={handleVisualize}
              disabled={!repoUrl.trim() || !isValidGitHubUrl(repoUrl) || isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Processing...' : 'Visualize Repository'}
            </button>
          </div>
        </div>

        {/* Example Repositories */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Try These Popular Repositories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'https://github.com/facebook/react',
              'https://github.com/microsoft/vscode',
              'https://github.com/vercel/next.js',
              'https://github.com/tensorflow/tensorflow'
            ].map((exampleRepo) => (
              <button
                key={exampleRepo}
                onClick={() => setRepoUrl(exampleRepo)}
                className="p-4 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow text-left"
              >
                <div className="font-medium text-gray-900">{exampleRepo.split('/').slice(-2).join('/')}</div>
                <div className="text-sm text-gray-500">{exampleRepo}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
