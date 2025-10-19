// app/leaderboard/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import LeaderboardContent from '@/components/leaderboard/LeaderboardContent'

export const metadata = {
  title: 'Repository Leaderboard | CodeSoul',
  description: 'Browse top repositories and your visualization history on CodeSoul',
}

export default async function LeaderboardPage() {
  // Note: We allow unauthenticated access to view global rankings
  // but personal history requires authentication

  return <LeaderboardContent />
}
