// app/visualize/page.tsx
import { Suspense } from 'react'
import VisualizePageContent from './VisualizePageContent'

export default function VisualizePage({ searchParams }: { searchParams: { repo: string } }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VisualizePageContent repoUrl={searchParams.repo} />
    </Suspense>
  )
}