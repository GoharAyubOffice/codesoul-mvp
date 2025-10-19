# CodeSoul Leaderboard System Setup Guide

## Overview

The CodeSoul leaderboard system is a P2 feature that tracks repository scores and maintains a global leaderboard of the most interesting repositories visualized on the platform, plus per-user visualization history.

## Architecture

### Database Schema

Two main tables in Supabase:

1. **`repositories`** - Stores repository metadata and calculated scores
2. **`user_visualizations`** - Records when users visualize repositories

### Scoring System

The repository score is calculated from four components (each 0-100):

1. **Complexity Score** - Branches, commit density, repository structure
2. **Activity Score** - Recent commits, historical activity, contributor count
3. **Social Score** - Stars, forks (community engagement)
4. **Health Score** - Maintenance status, development consistency, protected branches

**Final Score** = Average of all four components (0-100)

## Setup Instructions

### Step 1: Create Database Schema

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Create a new query and paste the contents of `db/migrations/001_create_leaderboard_schema.sql`
4. Click "Run" to execute

This creates:
- `repositories` table with scoring columns
- `user_visualizations` table for tracking usage
- Indexes for performance
- Row Level Security policies
- Automatic `updated_at` timestamp triggers

### Step 2: Verify Database Connection

The application uses `lib/supabase.ts` which is already configured to connect to Supabase using:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These should already be in your `.env.local`

### Step 3: Test the Leaderboard Endpoints

The system provides two API routes:

#### Global Leaderboard
```bash
GET /api/leaderboard?limit=50&offset=0
```

Returns top repositories with rankings

#### User History
```bash
GET /api/leaderboard/user?limit=20
```

Returns authenticated user's visualization history

#### Save Visualization
```bash
POST /api/leaderboard
Body: {
  repository_id: string,
  visualization_mode: 'brain' | 'tree',
  repo_score: number,
  complexity_score: number,
  activity_score: number,
  social_score: number,
  health_score: number
}
```

## Components

### Client Components

**`components/leaderboard/LeaderboardContent.tsx`**
- Main leaderboard page component
- Tab-based UI: Global Rankings + Personal History (if authenticated)
- Score display with tier badges
- Real-time data fetching

### Services

**`lib/scoring/calculateScore.ts`**
- Pure function to calculate repository scores
- Accepts GitHub repository data
- Returns all four score components plus final score
- Helper functions for formatting and tier classification

**`lib/scoring/repositoryService.ts`**
- Supabase wrapper functions
- `upsertRepository()` - Create or update repository record
- `recordUserVisualization()` - Log user visualization
- `getTopRepositories()` - Fetch leaderboard
- `getUserVisualizationHistory()` - Fetch user history
- `findRepositoryByFullName()` - Search by repo name
- `getRepositoryWithStats()` - Enhanced repo data with usage count

### API Routes

**`app/api/leaderboard/route.ts`**
- GET: Fetch top repositories with pagination
- POST: Record new visualization (requires auth)

**`app/api/leaderboard/user/route.ts`**
- GET: Fetch user's visualization history (requires auth)

### Pages

**`app/leaderboard/page.tsx`**
- Server-side rendered leaderboard page
- No authentication required for viewing
- Accessible at `/leaderboard`

## Features

### Global Leaderboard

- **Sortable by Score** - Highest-scoring repositories first
- **Ranking Display** - Numbered positions
- **Repository Metadata** - Name, description, language, stats
- **Score Breakdown** - Visibility into Complexity (C), Activity (A), Social (S), Health (H) components
- **Links to GitHub** - Click through to original repositories

### Personal History

- **User-Specific** - Only visible to authenticated users
- **Chronological** - Most recent visualizations first
- **Mode Tracking** - Shows whether user viewed as Neural Network or Tree
- **Score Recording** - Captures score at time of visualization

### Score Display

- **Color-Coded Tiers**
  - S Tier (85+): Green - Excellent
  - A Tier (70-84): Blue - Very Good
  - B Tier (55-69): Yellow - Good
  - C Tier (40-54): Orange - Fair
  - D Tier (0-39): Red - Poor

## Integration with Visualization

When a user visualizes a repository:

1. The visualization page loads and processes GitHub data
2. A simple score calculation occurs based on available metadata
3. The visualization is automatically saved to the leaderboard (if authenticated)
4. Score is displayed at the bottom of the visualization page
5. User can click "View Leaderboard" to see rankings

Note: For a more accurate score, you may want to refactor to pass full GitHub data to `calculateRepositoryScore()` instead of using the estimated calculation.

## Row Level Security (RLS)

The Supabase schema includes RLS policies:

- **Repositories**: Public read, restricted write
- **User Visualizations**: Users see only their own, write-only to own records

This ensures data privacy while allowing public leaderboard access.

## Performance Considerations

### Indexes

The schema creates indexes on:
- `repositories(score DESC)` - Leaderboard queries
- `repositories(created_at DESC)` - Recent repos
- `repositories(full_name)` - Direct lookups
- `user_visualizations(user_id)` - User history
- `user_visualizations(created_at DESC)` - Recent visualizations

### Pagination

The API routes support pagination with `limit` and `offset` parameters to handle large datasets.

## Future Enhancements (Post-MVP)

1. **Advanced Filtering**
   - Filter by programming language
   - Filter by date range
   - Filter by repository size

2. **More Scoring Factors**
   - Code quality metrics
   - License type
   - Issue resolution time
   - Pull request merge speed

3. **Achievements/Badges**
   - "Most Visualized" badge
   - "Trending" badge
   - Language-specific badges

4. **Notifications**
   - Alert users when they enter top 10
   - Weekly leaderboard digest
   - New high score notifications

5. **Advanced Analytics**
   - Leaderboard trends over time
   - Most popular programming languages
   - Repository growth tracking

## Troubleshooting

### Database Connection Errors

**Problem**: "Failed to fetch leaderboard"
- Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Verify Supabase project is active
- Check that tables were created successfully

### Missing Visualizations in History

**Problem**: User visualizations not appearing
- Verify user is authenticated (check NextAuth session)
- Confirm POST request to `/api/leaderboard` is succeeding
- Check browser console for API errors
- Verify RLS policy: `auth.uid()::text = user_id`

### Score Calculation Issues

**Problem**: Scores seem inaccurate
- Current implementation uses simplified calculation from metadata
- For more accurate scores, refactor visualization page to use full `calculateRepositoryScore()` function
- Consider using additional GitHub API data (languages, contributors, etc.)

### RLS Policy Errors

**Problem**: 403/Permission errors on Supabase
- Check RLS policies in Supabase dashboard
- Ensure auth.uid() is properly set in NextAuth
- Test policies with different user roles

## Testing Checklist

- [ ] Database tables created successfully
- [ ] Can query global leaderboard at `/leaderboard`
- [ ] Can view global rankings without authentication
- [ ] Authenticated user can see personal history
- [ ] Visualization page displays score
- [ ] Score is recorded to database when visualizing
- [ ] Leaderboard link appears on visualization page
- [ ] Link from dashboard to leaderboard works
- [ ] Can search/filter repositories (if implemented)
- [ ] Score tiers display correct colors
- [ ] Pagination works on large result sets

## Code Examples

### Calculating a Repository Score

```typescript
import { calculateRepositoryScore } from '@/lib/scoring/calculateScore'
import { fetchRepoData } from '@/lib/github/api'

const githubData = await fetchRepoData('owner', 'repo')
const { score, metadata } = calculateRepositoryScore(githubData)

console.log(`Score: ${score.final_score}/100`)
console.log(`Tier: ${getScoreTier(score.final_score)}`)
```

### Saving a Visualization

```typescript
import { recordUserVisualization, findRepositoryByFullName } from '@/lib/scoring/repositoryService'

const repo = await findRepositoryByFullName('owner/repo')

await recordUserVisualization(
  userId,
  repo.id,
  'brain', // visualization mode
  score.final_score,
  {
    complexity_score: score.complexity_score,
    activity_score: score.activity_score,
    social_score: score.social_score,
    health_score: score.health_score,
  }
)
```

### Fetching Leaderboard

```typescript
import { getTopRepositories } from '@/lib/scoring/repositoryService'

const topRepos = await getTopRepositories(50)
```

## Files Modified/Created

**New Files:**
- `db/migrations/001_create_leaderboard_schema.sql` - Database schema
- `lib/scoring/calculateScore.ts` - Scoring algorithm
- `lib/scoring/repositoryService.ts` - Database service layer
- `lib/scoring/types.ts` - TypeScript types
- `types/database.ts` - Database model types
- `app/api/leaderboard/route.ts` - Main leaderboard API
- `app/api/leaderboard/user/route.ts` - User history API
- `app/leaderboard/page.tsx` - Leaderboard page
- `components/leaderboard/LeaderboardContent.tsx` - Leaderboard UI
- `LEADERBOARD_SETUP.md` - This file

**Modified Files:**
- `app/visualize/VisualizePageContent.tsx` - Added score display and auto-save
- `app/dashboard/page.tsx` - Added leaderboard link to navigation

## Maintenance

### Regular Tasks

1. **Database Cleanup**
   - Monitor database size
   - Archive old visualizations (optional)
   - Monitor query performance

2. **Score Recalculation**
   - Consider periodic recalculation with new factors
   - Update scores when GitHub data changes

3. **Monitoring**
   - Check API error rates
   - Monitor RLS policy usage
   - Track most-viewed repositories

## Support & Questions

For questions about the leaderboard system:
1. Check the documentation in `Code Soul.md Files/`
2. Review Next.js guidelines in documentation
3. Check Supabase documentation for database issues
4. Review official Next.js and Supabase docs

---

**Status**: P2 Feature - Production Ready for MVP
**Quality Level**: Basic (P2 shortcuts applied)
**Testing**: Smoke tests recommended before production launch
