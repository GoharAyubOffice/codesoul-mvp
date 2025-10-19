# Post-Migration Verification Guide

Migration is complete! Now let's verify the system works end-to-end.

## Step 1: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Then start fresh:
npm run dev
```

Wait for the dev server to fully start (you should see "ready on http://localhost:3000").

## Step 2: Test the Full Flow

### A. Go to Dashboard
- Navigate to: `http://localhost:3000/dashboard`
- You should see the "Visualize Your Repository" page
- Should be logged in (see username in top right)

### B. Visualize a Repository
1. Enter: `https://github.com/facebook/react`
2. Click "Visualize Repository"
3. Wait for visualization to load

### C. Monitor Console for Success

**Open Browser DevTools** (F12 or Right-click → Inspect)

Go to the **Console** tab and look for logs like:
```
Recording visualization: {
  userId: "...",
  repositoryId: "uuid-...",
  repoScore: 85.5,
  visualizationMode: "brain"
}

Visualization recorded successfully: {
  id: "uuid-...",
  user_id: "...",
  repository_id: "...",
  repo_score: 85.5,
  created_at: "2025-10-19T..."
}
```

✅ **If you see this, it worked!**

### D. Check Network Tab

1. In DevTools, go to **Network** tab
2. Look for the POST request to `/api/leaderboard`
3. Click on it and check the response
4. Should see:
```json
{
  "success": true,
  "data": {
    "id": "uuid-...",
    "user_id": "...",
    "repository_id": "...",
    "repo_score": 85.5,
    "visualization_mode": "brain",
    "created_at": "2025-10-19T...",
    ...
  }
}
```

✅ **Response status should be 200, not 500**

## Step 3: Check Database

### In Supabase Dashboard:

1. **Check Repositories Table**
   - Go to: Supabase Dashboard → SQL Editor
   - Run this query:
   ```sql
   SELECT full_name, score, stars, created_at
   FROM repositories
   ORDER BY created_at DESC
   LIMIT 5;
   ```
   - Should see `facebook/react` with a score (e.g., 85.5)

2. **Check User Visualizations Table**
   - Run this query:
   ```sql
   SELECT user_id, repository_id, repo_score, visualization_mode, created_at
   FROM user_visualizations
   ORDER BY created_at DESC
   LIMIT 5;
   ```
   - Should see your visualization entry
   - `visualization_mode` should be "brain" or "tree"
   - `repo_score` should match what you saw on the page

✅ **Both tables should have data**

## Step 4: View Leaderboard

1. Navigate to: `http://localhost:3000/leaderboard`
2. You should see:
   - ✅ "Global Rankings" tab with facebook/react listed
   - ✅ Repository name as a clickable link
   - ✅ Score displayed (e.g., 85.5)
   - ✅ Score tier badge (S, A, B, C, or D)
   - ✅ Language, Stars, Forks, etc.

3. Click the "My Visualizations" tab (if logged in)
   - ✅ Should see facebook/react in your history
   - ✅ Shows date/time you visualized it
   - ✅ Shows the score you got

## Step 5: Test Personal History

1. Visualize another repository:
   - Go back to Dashboard
   - Try: `https://github.com/microsoft/vscode`
   - Visualize it

2. Go back to Leaderboard → "My Visualizations"
   - ✅ Should see both repositories
   - ✅ Most recent first

## Success Criteria Checklist

- [ ] Dev server starts without errors
- [ ] Can visualize a repository
- [ ] See score at bottom of visualization page
- [ ] Browser console shows "Recording visualization..." logs
- [ ] Network tab shows POST `/api/leaderboard` with 200 status
- [ ] Supabase `repositories` table has data
- [ ] Supabase `user_visualizations` table has data
- [ ] Leaderboard shows repositories
- [ ] Leaderboard shows scores with correct colors
- [ ] Personal history tab shows your visualizations

✅ **All checked? System is working!**

## Troubleshooting

### Issue: Still getting "Failed to record visualization"

**Check 1: Migration really ran?**
- Go to Supabase → SQL Editor → Queries (History tab)
- Should see your migration in the history
- Look for "002_fix_rls_policies" query

**Check 2: RLS Policies Updated?**
- Go to Supabase → Authentication → Policies
- Look at `user_visualizations` table
- Should have policy: "Allow all operations on user_visualizations..."
- Should NOT have the old strict policies

**Check 3: Server Logs**
- Look at terminal where you ran `npm run dev`
- Should see detailed error messages
- Check for RLS policy errors

**Solution: Run Migration Again**
```sql
-- In Supabase SQL Editor, delete old policies first:
DROP POLICY IF EXISTS "Users can create visualizations" ON public.user_visualizations;
DROP POLICY IF EXISTS "Users can view their own visualizations" ON public.user_visualizations;
DROP POLICY IF EXISTS "Users can update their own visualizations" ON public.user_visualizations;

-- Then run the migration again:
-- Copy entire contents of db/migrations/002_fix_rls_policies.sql
```

### Issue: Leaderboard shows no data

**Check 1: Repositories exist?**
```sql
SELECT COUNT(*) FROM repositories;
```
Should return > 0

**Check 2: Visualizations exist?**
```sql
SELECT COUNT(*) FROM user_visualizations;
```
Should return > 0

**Check 3: API working?**
- Open browser DevTools → Network tab
- Go to `/leaderboard`
- Look for GET request to `/api/leaderboard`
- Should have 200 status, not 500

### Issue: Can visualize but data not appearing

**Check 1: Is the POST succeeding?**
- Network tab → look for POST to `/api/leaderboard`
- Response body should have `"success": true`

**Check 2: Wrong user ID?**
- Server logs should show `userId: "..."`
- If userId is "anonymous", auth isn't working
- Make sure you're logged in

**Check 3: Repository not created?**
```sql
SELECT * FROM repositories
WHERE full_name = 'facebook/react';
```
Should return 1 row

## Next Steps if Everything Works ✅

1. **Test more repositories**
   - Try: `https://github.com/vercel/next.js`
   - Try: `https://github.com/torvalds/linux`

2. **Test personal history**
   - Visualize 3-5 different repos
   - Check "My Visualizations" shows all of them

3. **Test ranking**
   - Check that leaderboard sorts by score
   - Higher scores should be at the top

4. **Check performance**
   - Leaderboard should load in < 2 seconds
   - No lag when switching tabs

5. **Ready to deploy!** 🚀

## Still Having Issues?

1. Check the detailed error in browser console
2. Look at server terminal for logs
3. Check Supabase dashboard → Logs for database errors
4. Review `FIX_VISUALIZATION_RECORDING.md` for details

---

**Status**: Post-migration verification phase
**Time to complete**: 5-10 minutes
**Expected outcome**: Full leaderboard system working ✨
