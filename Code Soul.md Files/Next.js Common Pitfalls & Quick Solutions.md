Next.js Common Pitfalls & Quick Solutions (CodeSoul)
Table of Contents
Development Environment Issues
Next.js Common Errors (Hydration)
TypeScript Issues
NextAuth & Supabase Problems
Data Fetching (React Query) Pitfalls
Three.js (WebGL) Issues
Build and Deployment Issues (Vercel)
Quick Debugging Strategies

Development Environment Issues
🔧 Next.js Dev Server
Problem: "Port 3000 already in use"
# Quick Solution:
npx kill-port 3000
# Or run on a different port
npm run dev -- -p 3001

Problem: Tailwind CSS classes not applying
# Quick Solutions:
# 1. Check tailwind.config.ts `content` paths
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // ...
}
# 2. Restart the dev server. New classes sometimes need a restart.
# 3. Check for typos in your `className` prop.

Next.js Common Errors (Hydration)
⚠️ Hydration Errors
Problem: "Hydration failed...", "Text content does not match"
// ❌ Common cause: Using browser-only APIs on server
const MyComponent = () => {
  // This runs on the server (undefined) and client (e.g., 'MacIntel')
  const platform = navigator.platform 
  return <div>Platform: {platform}</div>
}

// ✅ Fix: Use useEffect to run on client only
"use client"
import { useState, useEffect } from 'react'

const MyComponent = () => {
  const [platform, setPlatform] = useState('Loading...')
  
  useEffect(() => {
    // This only runs on the client
    setPlatform(navigator.platform)
  }, [])

  return <div>Platform: {platform}</div>
}

// ✅ Fix 2: Suppress hydration warning (if you must)
<div suppressHydrationWarning>{new Date().toLocaleTimeString()}</div>

Problem: "use client" component imported into a Server Component
// ❌ You cannot import a Server Component into a Client Component
// This is a common pattern that works:
// app/page.tsx (Server)
import ClientComponent from '@/components/ClientComponent'

export default async function Page() {
  const serverData = await fetchData()
  return <ClientComponent serverData={serverData} />
}

TypeScript Issues
📝 Type Definition Problems
Problem: "Property 'id' does not exist on type 'User'" (NextAuth)
// ❌ Default NextAuth User type is minimal

// ✅ Fix: Extend the type in `types/next-auth.d.ts`
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string // Add your custom property
    } & DefaultSession['user']
  }
  
  interface User {
    id: string // Add your custom property
  }
}

Problem: "Type 'null' is not assignable to type 'string'"
// ✅ Fix: Check your types and provide defaults
function MyComponent({ name }: { name: string }) {
  return <p>{name}</p>
}
// const data = null
// <MyComponent name={data} /> // Error!

// Fix:
// <MyComponent name={data || "Default Name"} />

NextAuth & Supabase Problems
🗄️ Auth Issues
Problem: GitHub OAuth redirect fails, "Invalid callback URL"
// ✅ Fix: Check your GitHub OAuth App settings
// 1. URL: http://localhost:3000
// 2. Callback URL: http://localhost:3000/api/auth/callback/github
// 3. Check Vercel deployment URLs are also added.

// ✅ Fix 2: Check .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_is_set

Problem: `useSession()` returns `null` or `loading`
// ✅ Fix: Make sure the component is wrapped in `<AuthProvider>`
// This is done in the root `app/layout.tsx`
// If it's still null, the user is not logged in.

Problem: Supabase RLS error, "new row violates RLS"
// ❌ Common issue: You are using the client-side `anon` key for a protected action.
// ✅ Fix: For server-side, use the `service_role` key.
// ✅ Fix 2: For client-side, make sure the user is logged in (`session` exists)
// ✅ Fix 3: Check your RLS policies in the Supabase dashboard.

Three.js (WebGL) Issues
🧠 Visualization Problems
Problem: Black screen, nothing renders
// ❌ Common causes:
// 1. No lights in the scene
// 2. Camera is inside the object or looking the wrong way
// 3. Component is Server-Side Rendered (SSR)

// ✅ Fix 1: Add lights
<Canvas>
  <ambientLight intensity={0.5} />
  <pointLight position={[10, 10, 10]} />
  <mesh>...</mesh>
</Canvas>

// ✅ Fix 2: Use <OrbitControls> to debug camera
import { OrbitControls } from '@react-three/drei'
<Canvas>
  <OrbitControls />
  ...
</Canvas>

// ✅ Fix 3: Dynamically import the viz component with SSR disabled
import dynamic from 'next/dynamic'
const MyViz = dynamic(() => import('@/components/viz/MyViz'), { ssr: false })

Build and Deployment Issues (Vercel)
🔨 Vercel Build Problems
Problem: Build fails with "Type error"
// ✅ Fix: Vercel runs `tsc --noEmit` by default.
// Fix all TypeScript errors locally before pushing.

Problem: Build fails on dependency install
// ✅ Fix: Check for `pnpm-lock.yaml` or `yarn.lock` if you're not using npm.
// Vercel defaults to `npm`. Change the "Install Command" in project settings if needed.

Problem: Serverless Function Timeout
// ❌ Your `/api/github/process` route takes > 10s
// ✅ Fix 1: (Pro Plan) Extend the timeout
// app/api/github/process/route.ts
export const maxDuration = 60 // 60 seconds

// ✅ Fix 2: (Recommended) Refactor to a background job.
// (See Next.js Advanced Guidelines)