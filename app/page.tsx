"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to CodeSoul 🧠🌳
        </h1>
        <p className="text-gray-600 mb-8">See your code come alive.</p>
        
        {session ? (
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Welcome, {session.user?.name}
            </p>
            <Link 
              href="/dashboard"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </Link>
            <button 
              onClick={() => signOut()}
              className="block w-full text-gray-500 hover:text-gray-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => signIn('github')}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Sign in with GitHub
          </button>
        )}
      </div>
    </div>
  )
}