# CodeSoul Leaderboard - Quick Start Guide

## What You Built ✨

A complete **repository scoring and leaderboard system** that gamifies CodeSoul by ranking repositories based on their complexity, activity, social metrics, and health.

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Database Tables
1. Open your Supabase project dashboard
2. Go to SQL Editor → New Query
3. Copy-paste contents of: `db/migrations/001_create_leaderboard_schema.sql`
4. Click "Run"
5. Done! ✅

### Step 2: Start Using It

**Visit the leaderboard:**
```
http://localhost:3000/leaderboard
```

**Visualize a repository to add it to leaderboard:**
1. Go to Dashboard
2. Enter a GitHub repository URL
3. Visualize it (choose Brain or Tree mode)
4. See your score displayed at the bottom
5. Check the leaderboard to see where it ranks

## 📊 How Scoring Works

Each repository gets a score from 0-100 based on:

| Component | Factor | Weight |
|-----------|--------|--------|
| **Complexity** | Branches, commits, structure | 25% |
| **Activity** | Recent commits, contributors | 25% |
| **Social** | Stars, forks | 25% |
| **Health** | Maintenance, consistency | 25% |

### Score Tiers
- 🏆 **S Tier** (85+): Excellent
- 🥇 **A Tier** (70-84): Very Good
- 🥈 **B Tier** (55-69): Good
- 🥉 **C Tier** (40-54): Fair
- 📉 **D Tier** (0-39): Poor

## 📁 Key Files

### Database
- `db/migrations/001_create_leaderboard_schema.sql` - Database schema

### Scoring Logic
- `lib/scoring/calculateScore.ts` - Scoring algorithm
- `lib/scoring/repositoryService.ts` - Database operations

### API Routes
- `app/api/leaderboard/route.ts` - Main leaderboard API
- `app/api/leaderboard/user/route.ts` - User history API

### Frontend
- `app/leaderboard/page.tsx` - Leaderboard page
- `components/leaderboard/LeaderboardContent.tsx` - Leaderboard UI

### Integration
- `app/visualize/VisualizePageContent.tsx` - Score display on viz page
- `app/dashboard/page.tsx` - Navigation link to leaderboard

## 🔌 API Endpoints

### Get Top Repositories
```bash
GET /api/leaderboard?limit=50&offset=0

Response:
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "full_name": "facebook/react",
      "score": 92.3,
      "complexity_score": 88,
      "activity_score": 95,
      "social_score": 98,
      "health_score": 87,
      "stars": 215000,
      "language": "JavaScript"
    }
  ]
}
```

### Get User's History
```bash
GET /api/leaderboard/user?limit=20
# Requires authentication

Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "repository_id": "uuid",
      "repo_score": 85.5,
      "visualization_mode": "brain",
      "created_at": "2025-10-19T10:30:00Z"
    }
  ]
}
```

### Save Visualization
```bash
POST /api/leaderboard
# Requires authentication

Body:
{
  "repository_id": "uuid",
  "visualization_mode": "brain",
  "repo_score": 85.5,
  "complexity_score": 82,
  "activity_score": 88,
  "social_score": 85,
  "health_score": 87
}
```

## 🎯 User Journey

```
User visualizes repo
     ↓
Score calculated automatically
     ↓
Score displayed on visualization page
     ↓
Visualization saved to database (if authenticated)
     ↓
User can view leaderboard
     ↓
View global rankings OR personal history
     ↓
Click repo to view on GitHub
```

## ✅ Verification Checklist

Run through these to verify everything works:

- [ ] Run database migration successfully
- [ ] Navigate to `/leaderboard` page
- [ ] See "Global Rankings" tab with repositories
- [ ] Visualize a repository
- [ ] See score displayed at bottom
- [ ] Click "View Leaderboard" button
- [ ] See your visualization in personal history
- [ ] Click repository link goes to GitHub
- [ ] Scores are colored appropriately (green for S, red for D)

## 🐛 Troubleshooting

### "Failed to fetch leaderboard"
- Check Supabase connection in `.env.local`
- Verify database tables exist (run migration)
- Check browser console for errors

### "No data in leaderboard"
- Visualize at least one repository first
- Ensure you're authenticated when visualizing
- Check browser console for POST errors

### "Personal history not showing"
- Make sure you're logged in (check session)
- Try logging out and back in
- Check browser console for auth errors

### Scores seem wrong
- Current implementation uses simplified calculation
- See `LEADERBOARD_SETUP.md` for enhancement ideas

## 📚 Documentation

**Full Details**: See `LEADERBOARD_SETUP.md` for:
- Complete architecture overview
- Database schema explanation
- Scoring algorithm details
- Component documentation
- Performance tuning
- Future enhancement ideas

## 🎮 What's Next?

The leaderboard is production-ready! Potential next steps:

1. **Monitor Performance** - Track query times, database size
2. **Collect Feedback** - How do users react to scores?
3. **Enhancements** - Add filters, achievements, weekly digests
4. **Analytics** - Track most popular repos, trending languages

---

**Status**: ✅ Complete and Ready to Use
**Deployment**: Requires database schema creation (5 min)
**Quality**: Production-ready for MVP
**Maintenance**: Minimal - mostly read operations
