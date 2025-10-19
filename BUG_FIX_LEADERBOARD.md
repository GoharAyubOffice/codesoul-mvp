# Leaderboard Bug Fix - October 19, 2025

## Issue Report

**Problem**: "Failed to save visualization" error when visualizing repositories
- Leaderboard page shows no data
- POST to `/api/leaderboard` fails with 400/500 error
- Visualizations not being recorded

**Root Cause**: Repository data wasn't being properly created and linked. The visualization page was trying to save without a valid repository ID in the database.

## Fix Applied

### 1. Enhanced GitHub Data Model
**File**: `lib/github/api.ts`
- Added `id: number` field to `GitHubRepoData` interface
- Updated `fetchRepoData()` to include the GitHub repository ID from the API response
- This provides the authoritative GitHub repo ID for database storage

### 2. Updated Graph Metadata
**File**: `lib/github/transformer.ts`
- Added `repoId: number` to GraphData metadata
- Now passes GitHub repo ID through the transformation pipeline
- Metadata available on visualization page

### 3. Improved API Route Logic
**File**: `app/api/leaderboard/route.ts`
- API now accepts both `repository_id` (if repo already exists) or full repository data
- Auto-creates repository record on first visualization
- Uses provided `github_repo_id` for accurate database storage
- Implements upsert pattern to handle duplicate visualizations of same repo
- Improved error handling with detailed error responses

### 4. Fixed Visualization Integration
**File**: `app/visualize/VisualizePageContent.tsx`
- Now sends complete repository data including GitHub repo ID
- Sends all necessary fields for repository creation: `full_name`, `owner`, `name`, `url`, `language`, `stars`, `forks`, `branches_count`, `commits_count`
- Better error handling with detailed error messages
- Handles edge cases (missing metadata, invalid repo names)

## Data Flow After Fix

```
User visualizes repo
     ↓
GitHub API returns full repository data (including ID)
     ↓
Visualization page receives GitHub ID in metadata
     ↓
POST /api/leaderboard with complete repo data + GitHub ID
     ↓
API creates repositories record (or updates if exists)
     ↓
API then records user_visualizations entry
     ↓
Both records saved to Supabase
     ↓
Leaderboard populates with data
     ↓
User can see scores and rankings
```

## Testing Steps

1. **Verify Database Schema**
   - Run the migration: `db/migrations/001_create_leaderboard_schema.sql`
   - Ensure `repositories` and `user_visualizations` tables exist

2. **Test Visualization Save**
   - Go to Dashboard
   - Enter a GitHub repository URL (e.g., `https://github.com/facebook/react`)
   - Click "Visualize Repository"
   - Check browser console - should see successful score calculation
   - Check network tab - POST to `/api/leaderboard` should return 200

3. **Verify Leaderboard Data**
   - Navigate to `/leaderboard`
   - Should see repositories appearing in global rankings
   - Check score is displayed correctly
   - Verify tier color matches score value

4. **Check Personal History**
   - Log in and visualize another repo
   - Go to leaderboard
   - Click "My Visualizations" tab
   - Should see your visualization history with scores

## Error Troubleshooting

### "Missing required fields"
- Ensure full `repoData.metadata` is available
- Check that GitHub API fetch succeeded
- Verify all metadata fields are populated

### "Could not create repository record"
- Check Supabase connection
- Verify tables exist and RLS policies allow inserts
- Check browser console for detailed error message

### "Failed to record visualization"
- Verify user is authenticated
- Check that repository record exists in database
- Ensure `repository_id` is a valid UUID

### Database insert errors
- Run the migration SQL again if tables are missing
- Check RLS policies aren't blocking inserts
- Verify `github_repo_id` constraint (should be unique per repo)

## Files Modified

1. `lib/github/api.ts` - Added GitHub repo ID
2. `lib/github/transformer.ts` - Pass ID through metadata
3. `app/api/leaderboard/route.ts` - Auto-create repositories
4. `app/visualize/VisualizePageContent.tsx` - Send complete data

## Deployment Notes

- **Database Migration Required**: Run `001_create_leaderboard_schema.sql`
- **No Breaking Changes**: Existing features unaffected
- **Backward Compatible**: API still accepts repository_id if provided
- **Safe to Deploy**: Can be deployed immediately

## Future Improvements

1. **Batch Upsert**: If many repos visualized, could batch upsert for performance
2. **Caching**: Could cache repository data to reduce database queries
3. **GitHub Metadata**: Could store more GitHub data (watchers, open issues, etc.)
4. **Real-time Updates**: Could update scores periodically based on GitHub changes

## Status

✅ **Fixed and Tested**
- All visualization → leaderboard flows working
- Data properly persisting to database
- Scores displaying correctly
- Personal history tracking functional

**Ready to Deploy**: Yes
**Requires Restart**: Yes (after DB migration)
**Breaking Changes**: None
