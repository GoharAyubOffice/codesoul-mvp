Next.js Advanced Guidelines & AI-Assisted Development (CodeSoul)
Table of Contents
AI-Assisted Development Guidelines
Documentation References & Search Strategy
Advanced Integration Patterns (WebGL)
Production Deployment Strategies (Vercel)
Real-World Edge Cases & Solutions
Enterprise-Level Considerations
Troubleshooting Common Issues
AI Code Generation Best Practices

AI-Assisted Development Guidelines
(This section remains conceptually the same but applies to Next.js. Always check official docs for Next.js, NextAuth, R3F, etc.)

Documentation References & Search Strategy
(This is now covered by the updated 'Documentation Search Instructions' doc.)

Advanced Integration Patterns
WebGL Performance Optimization (Three.js)
// ✅ Use React Three Fiber best practices
import { PerformanceMonitor } from '@react-three/drei'
import { useState } from 'react'

function MyScene() {
  const [dpr, setDpr] = useState(1.5) // Start with a reasonable device pixel ratio

  return (
    <>
      {/* This will automatically lower DPR if performance drops */}
      <PerformanceMonitor 
        onIncline={() => setDpr(2)} 
        onDecline={() => setDpr(1)} 
      />
      
      {/* - Use `useMemo` for complex geometries/materials
        - Use `instancedMesh` for thousands of similar objects (like leaves or particles)
        - `drei` components are highly optimized (e.g., <Line>)
      */}
    </>
  )
}

Sharing Canvas Snapshots (html2canvas)
// ✅ Logic for capturing the screen
"use client"
import html2canvas from 'html2canvas'

const handleShare = async () => {
  const vizElement = document.getElementById('visualization-container')
  if (!vizElement) return

  try {
    const canvas = await html2canvas(vizElement, {
      useCORS: true, // Important for external images/fonts
    })
    
    const imageUrl = canvas.toDataURL('image/png')
    
    // TODO:
    // 1. Upload this `imageUrl` (or blob) to Supabase Storage
    // 2. Get the public URL
    // 3. Open the X (Twitter) share intent with that URL
    
    const tweetText = "Just visualized my repo brain! 🧠⚡️ Try yours: #CodeSoul"
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent('https://codesoul.ai')}` //&media=${publicImageUrl}
    
    window.open(shareUrl, '_blank')

  } catch (error) {
    console.error('Failed to capture image', error)
  }
}

Production Deployment Strategies (Vercel)
Environment Variables
// ✅ Manage variables in the Vercel dashboard
// Production:
// - GITHUB_CLIENT_ID
// - GITHUB_CLIENT_SECRET
// - OPENAI_API_KEY
// - SUPABASE_SERVICE_ROLE_KEY
// - NEXTAUTH_SECRET
// - NEXTAUTH_URL (e.g., https://codesoul.ai)
// - NEXT_PUBLIC_SUPABASE_URL
// - NEXT_PUBLIC_SUPABASE_ANON_KEY

// ✅ Preview:
// - Can use separate "preview" Supabase/OpenAI keys

Analytics
// ✅ Use Vercel Analytics for simple, out-of-the-box tracking
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  analytics: {
    // Enables Vercel Analytics
    // You can also add Google Analytics here
  },
};
export default nextConfig;

Real-World Edge Cases & Solutions
GitHub API Rate Limiting
// ✅ Handle GitHub rate limits
// lib/github/api.ts
export async function fetchRepoData(repoUrl: string) {
  // Use NextAuth to get the user's OAuth token
  // const session = await getServerSession(authOptions)
  // const token = session.accessToken // This requires a callback in auth.ts
  
  // const octokit = new Octokit({ auth: token })
  // const res = await octokit.graphql(...)
  
  // if (res.headers['x-ratelimit-remaining'] < 10) {
  //   console.warn("GitHub rate limit approaching!")
  // }
  
  // Handle 403 Forbidden errors
}

Large Repositories (Timeouts)
// ✅ Problem: `api/github/process` times out on Vercel (10s limit)
// ✅ Solution: Use Vercel Edge Functions or Serverless Functions
// app/api/github/process/route.ts
export const maxDuration = 60 // Extend function timeout to 60s (Pro plan)

// ✅ Better Solution: Use a webhook / queue
// 1. Client hits /api/github/request
// 2. API route adds "repo_url" to a Supabase "jobs" table
// 3. A separate Supabase Edge Function (or cron job) picks up the job
// 4. It processes the repo and updates the "jobs" table with status: "complete"
// 5. Client polls the job status using `useQuery` with `refetchInterval`