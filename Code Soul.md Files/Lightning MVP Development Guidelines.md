Lightning MVP Development Guidelines (CodeSoul)
Table of Contents
MVP Tech Stack
Lightning Setup Protocol
Essential MVP Features
Copy-Paste Code Templates
Rapid Database Design
Authentication in 5 Minutes (NextAuth)
API Routes & Data Fetching
UI Component Library
Quick Deployment Strategy

MVP Tech Stack
🎯 Frontend Stack (Next.js)
{
  "core": "Next.js (App Router)",
  "language": "TypeScript",
  "routing": "Next.js File-based Router",
  "styling": "Tailwind CSS",
  "state": "Zustand (client-side) + React Query (server-state)",
  "forms": "React Hook Form",
  "http": "@tanstack/react-query",
  "visualization": "Three.js (@react-three/fiber)"
}

⚡ Backend Stack (Next.js API + Supabase + OpenAI)
{
  "api_routes": "Next.js API Routes",
  "authentication": "NextAuth.js (with GitHub Provider)",
  "database": "Supabase (PostgreSQL for user data/viz storage)",
  "data_source": "GitHub GraphQL API",
  "ai_layer": "OpenAI API",
  "storage": "Supabase Storage (for shared images)",
  "session_storage": "Supabase (via NextAuth SupabaseAdapter)"
}

🚀 Deployment Stack
{
  "build": "Vercel",
  "updates": "Vercel (Instant Git-based deploys)",
  "distribution": "Vercel",
  "testing": "Vercel Preview Deployments"
}


Lightning Setup Protocol
Phase 1: Project Initialization (5 minutes)
# 1. Create Next.js project
npx create-next-app@latest codesoul-mvp --ts --tailwind --eslint --app

# 2. Navigate to project
cd codesoul-mvp

# 3. Install essential dependencies
npm install @supabase/supabase-js @tanstack/react-query zustand react-hook-form
npm install next-auth @supabase/auth-helpers-nextjs @supabase/auth-helpers-react
npm install three @react-three/fiber @react-three/drei
npm install openai html2canvas

# 4. Install dev dependencies
npm install -D @types/three @types/html2canvas

Phase 2: Environment Setup (3 minutes)
# 1. Create .env.local file
# 2. Get keys from Supabase, GitHub (OAuth App), and OpenAI
# 3. Generate a NEXTAUTH_SECRET: `openssl rand -base64 32`

# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_generated_secret

OPENAI_API_KEY=your_openai_api_key

Phase 3: Core Configuration (2 minutes)
# See 'Copy-Paste Code Templates' section below


Essential MVP Features (CodeSoul)
Core Features Checklist (Must-Have)
- [ ] GitHub OAuth Authentication (NextAuth)
- [ ] Repo Selection (Dashboard page)
- [ ] Backend API route to fetch & process repo data
- [ ] Universal Graph JSON transformation
- [ ] Visualization Mode 1: 🧠 Neural Repo (Three.js)
- [ ] Visualization Mode 2: 🌳 Code Tree (Three.js)
- [ ] Error handling & loading states
- [ ] Basic navigation

Nice-to-Have Features (P1 / Week 2)
- [ ] AI Caption Generation (OpenAI API)
- [ ] Shareable Image Export (html2canvas)
- [ ] Share to X (Twitter) button
- [ ] Store generated visuals in Supabase Storage


Copy-Paste Code Templates
1. NextAuth.js Configuration
// lib/auth.ts
import { NextAuthOptions } from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import { SupabaseAdapter } from '@supabase/auth-helpers-nextjs'

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  callbacks: {
    async session({ session, user }) {
      // Add user ID to the session object
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  session: {
    strategy: 'database',
  },
}

2. NextAuth.js API Route
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

3. Root Layout (with Providers)
// app/layout.tsx
import './globals.css'
import QueryProvider from '@/lib/providers/QueryProvider'
import AuthProvider from '@/lib/providers/AuthProvider'

export const metadata = {
  title: 'CodeSoul',
  description: 'See your code come alive.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

4. Client-side Providers
// lib/providers/AuthProvider.tsx
"use client"
import { SessionProvider } from 'next-auth/react'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

// lib/providers/QueryProvider.tsx
"use client"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

5. Homepage / Login Page
// app/page.tsx
"use client"
import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') return <p>Loading...</p>

  return (
    <div>
      <h1>Welcome to CodeSoul 🧠🌳</h1>
      <p>See your code come alive.</p>
      {session ? (
        <>
          <p>Welcome, {session.user?.name}</p>
          <Link href="/dashboard">Go to Dashboard</Link>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
      ) : (
        <button onClick={() => signIn('github')}>Sign in with GitHub</button>
      )}
    </div>
  )
}

6. Data Processing API Route (Stub)
// app/api/github/process/route.ts
import { NextResponse } from 'next/server'
// import { fetchRepoData } from '@/lib/github/api'
// import { transformToGraph } from '@/lib/github/transformer'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const repoUrl = searchParams.get('repo')

  if (!repoUrl) {
    return NextResponse.json({ error: 'Repo URL is required' }, { status: 400 })
  }

  try {
    // TODO: Implement this logic
    // const rawData = await fetchRepoData(repoUrl)
    // const graphData = transformToGraph(rawData)
    
    // STUBBED DATA
    const graphData = {
      nodes: [
        { "id": "main", "size": 5, "color": "#00ffaa", "type": "root" },
        { "id": "feature-login", "size": 3, "color": "#ffaa00", "type": "branch" }
      ],
      links: [
        { "source": "feature-login", "target": "main" }
      ]
    }

    return NextResponse.json(graphData)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process repo' }, { status: 500 })
  }
}