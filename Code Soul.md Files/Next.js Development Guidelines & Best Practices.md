Next.js Development Guidelines & Best Practices (CodeSoul)
Table of Contents
Project Setup & Architecture
Performance Optimization
Server-Side vs. Client-Side
Data Fetching
State Management
Styling
API Routes
Deployment & Testing
Security Guidelines

Project Setup & Architecture
Initial Setup
# Use latest create-next-app with App Router, TypeScript, and Tailwind
npx create-next-app@latest YourProjectName --ts --tailwind --eslint --app

Folder Structure
app/
├── (auth)/                 # Route group for auth pages
│   └── sign-in/page.tsx
├── (main)/                   # Route group for protected app pages
│   ├── dashboard/page.tsx
│   └── visualize/page.tsx
├── api/                      # Backend API routes
│   ├── auth/[...nextauth]/route.ts
│   └── ...
├── layout.tsx                # Root layout (Server Component by default)
├── page.tsx                  # Homepage (Server Component by default)
└── loading.tsx               # App-wide loading UI (Suspense)

components/                   # Shared components
lib/                          # Helper functions, clients, auth config
hooks/                        # Custom client-side hooks
types/                        # TypeScript definitions

Essential Dependencies
{
  "dependencies": {
    "@supabase/supabase-js": "...",
    "@supabase/auth-helpers-nextjs": "...",
    "next-auth": "...",
    "@tanstack/react-query": "...",
    "zustand": "...",
    "three": "...",
    "@react-three/fiber": "...",
    "@react-three/drei": "...",
    "openai": "...",
    "html2canvas": "...",
    "next": "14.x.x",
    "react": "18.x.x",
    "tailwindcss": "..."
  }
}


Performance Optimization
Server Components by Default
// ✅ Use Server Components for data fetching and non-interactive UI
// This component fetches data on the server and renders HTML
// app/page.tsx
async function getData() {
  // Server-side logic
  return { message: "Hello from server" }
}

export default async function Page() {
  const data = await getData()
  return <h1>{data.message}</h1>
}

Client Components for Interactivity
// ✅ Use "use client" for interactivity (hooks, event handlers)
// components/ui/Button.tsx
"use client"
import { useState } from 'react'

export function Button() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}

Dynamic Imports
// ✅ Use dynamic() to code-split heavy components (like your 3D viz)
import dynamic from 'next/dynamic'

// This component will only be loaded on the client-side when rendered
const NeuralRepoViz = dynamic(
  () => import('@/components/viz/NeuralRepo'),
  { 
    ssr: false, // Disable server-side rendering for this
    loading: () => <p>Loading Visualization...</p> 
  }
)

export default function VisualizePage() {
  // ...
  return <NeuralRepoViz data={data} />
}

Image Optimization
// ✅ Always use next/image for automatic optimization
import Image from 'next/image'

const MyImage = () => (
  <Image
    src="/path/to/image.png" // From /public folder
    width={500}
    height={500}
    alt="Description"
  />
)


Server-Side vs. Client-Side
Decision Framework
Component Type
When to Use
Key Features
Server Component
(Default)
Fetching data, accessing backend resources, static UI
`async/await`, direct DB access, 0 client JS
Client Component
("use client")
Interactivity, state (useState), effects (useEffect), browser APIs
`useState`, `useEffect`, `onClick`, `useSession`

Data Fetching
Server-Side (in Server Components)
// ✅ Fetch data directly in Server Components
// app/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })
  const { data: repos } = await supabase.from('repos').select('*')

  return (
    <ul>
      {repos?.map(repo => <li key={repo.id}>{repo.name}</li>)}
    </ul>
  )
}

Client-Side (with React Query)
// ✅ Use React Query for client-side data that changes
// app/visualize/[repo]/page.tsx
"use client"
import { useQuery } from '@tanstack/react-query'

async function getRepoData(repoUrl: string) {
  const res = await fetch(`/api/github/process?repo=${repoUrl}`)
  return res.json()
}

export default function VisualizePage({ params }) {
  const { data, isLoading } = useQuery({
    queryKey: ['repoData', params.repo],
    queryFn: () => getRepoData(params.repo)
  })

  if (isLoading) return <p>Loading...</p>
  return <pre>{JSON.stringify(data, null, 2)}</pre>
}

API Routes
// ✅ Use API Routes for secure backend logic triggered by the client
// app/api/ai/caption/route.ts
import { NextResponse } from 'next/server'
import { openai } from '@/lib/clients/openai'

export async function POST(request: Request) {
  const { repoMetrics } = await request.json()

  // Secure server-side call to OpenAI
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: `Describe this repo: ${repoMetrics}` }],
  })

  return NextResponse.json({ caption: response.choices[0].message.content })
}


State Management
Global State (Zustand)
// ✅ Use Zustand for simple, global client-side state
// store/use-viz-store.ts
"use client"
import { create } from 'zustand'

type VizMode = 'brain' | 'tree'

interface VizStore {
  mode: VizMode
  setMode: (mode: VizMode) => void
}

export const useVizStore = create<VizStore>((set) => ({
  mode: 'brain',
  setMode: (mode) => set({ mode }),
}))

// Usage in a component:
// const { mode, setMode } = useVizStore()