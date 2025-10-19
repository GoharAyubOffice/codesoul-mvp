// app/api/ai/caption/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { repoData } = await request.json()

    if (!repoData) {
      return NextResponse.json({ error: 'Repository data is required' }, { status: 400 })
    }

    // Create a prompt for AI caption generation
    const prompt = `Generate a creative, engaging caption for a GitHub repository visualization. 

Repository: ${repoData.metadata?.repoName || 'Unknown'}
Language: ${repoData.metadata?.language || 'Unknown'}
Stars: ${repoData.metadata?.stars || 0}
Branches: ${repoData.metadata?.totalBranches || 0}
Commits: ${repoData.metadata?.totalCommits || 0}

The visualization shows this repository as a neural network or code tree. Create a caption that:
- Is creative and engaging (max 100 characters)
- Mentions the repository name
- Uses relevant emojis
- Could work well for social media sharing
- Captures the essence of "code coming alive"

Examples of good captions:
- "Watching ${repoData.metadata?.repoName} come alive! 🧠⚡️"
- "Code neurons firing in ${repoData.metadata?.repoName} 🧠✨"
- "The brain of ${repoData.metadata?.repoName} visualized 🧠🌳"

Generate ONE caption:`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 100,
      temperature: 0.8,
    })

    const caption = completion.choices[0]?.message?.content?.trim()

    if (!caption) {
      throw new Error('Failed to generate caption')
    }

    return NextResponse.json({ caption })
  } catch (error) {
    console.error('Error generating AI caption:', error)
    return NextResponse.json({ error: 'Failed to generate caption' }, { status: 500 })
  }
}
