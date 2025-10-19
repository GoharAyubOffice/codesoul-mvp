# Leaderboard System - Verification Checklist

After applying the bug fixes, verify the system works with this checklist:

## Pre-Deployment Checklist

### Database
- [ ] Run migration: `db/migrations/001_create_leaderboard_schema.sql` in Supabase SQL Editor
- [ ] Verify `repositories` table exists
- [ ] Verify `user_visualizations` table exists
- [ ] Check that indexes were created
- [ ] Confirm RLS policies are enabled

### Environment
- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `.env.local` has `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `.env.local` has `GITHUB_TOKEN` (for GitHub API)
- [ ] NextAuth variables set up (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`)

### Application
- [ ] Run `npm run dev` successfully
- [ ] No TypeScript errors in build
- [ ] No console errors on page load

---

## Functional Testing

### ✅ Phase 1: Global Leaderboard (No Auth Required)

1. **Page Loads**
   - [ ] Navigate to `/leaderboard`
   - [ ] Page loads without errors
   - [ ] See "Repository Leaderboard" header
   - [ ] Two tabs visible: "Global Rankings" and "My Visualizations"

2. **Empty State (First Time)**
   - [ ] If no data, see "No repositories on the leaderboard yet"
   - [ ] No console errors

3. **UI Elements**
   - [ ] See column headers: #, Repository, Language, Score Breakdown
   - [ ] See example data after visualizing (next phase)

### ✅ Phase 2: Visualization & Auto-Save

1. **Repository Visualization**
   - [ ] Go to `/dashboard`
   - [ ] Enter valid GitHub URL: `https://github.com/facebook/react`
   - [ ] Click "Visualize Repository"
   - [ ] Page loads with visualization (brain or tree mode)

2. **Score Calculation**
   - [ ] Score appears at bottom of page
   - [ ] Score is between 0-100
   - [ ] See "CodeSoul Score" label
   - [ ] See score tier badge (S, A, B, C, or D)
   - [ ] Tier color is appropriate:
     - Green for S (85+)
     - Blue for A (70-84)
     - Yellow for B (55-69)
     - Orange for C (40-54)
     - Red for D (0-39)

3. **Repository Info Display**
   - [ ] See branches count
   - [ ] See commits count
   - [ ] See language
   - [ ] See stars and forks
   - [ ] See last updated date
   - [ ] See "View Leaderboard" link

4. **Auto-Save to Database**
   - [ ] Check browser Network tab → look for POST to `/api/leaderboard`
   - [ ] Response status should be 200
   - [ ] Response should have `"success": true`
   - [ ] No console errors

### ✅ Phase 3: Leaderboard with Data

1. **Global Rankings Populated**
   - [ ] Return to `/leaderboard`
   - [ ] See visualized repository in the list
   - [ ] Repository shows correct score
   - [ ] Repository shows correct metadata (stars, language, etc.)
   - [ ] See rank number (#1, #2, etc.)

2. **Score Display**
   - [ ] See score breakdown: C (Complexity), A (Activity), S (Social), H (Health)
   - [ ] Each component shows a number
   - [ ] Final score matches component average
   - [ ] Color gradient applied to final score

3. **Links Work**
   - [ ] Click repository name → goes to GitHub
   - [ ] GitHub page opens in new tab

4. **Multiple Visualizations**
   - [ ] Visualize another repository
   - [ ] Return to leaderboard
   - [ ] See both repositories listed
   - [ ] Rankings are ordered by score (highest first)

### ✅ Phase 4: Personal History (Auth Required)

1. **Sign In**
   - [ ] Ensure logged in with GitHub
   - [ ] Can see username in header

2. **View Personal History**
   - [ ] Go to leaderboard
   - [ ] Click "My Visualizations" tab
   - [ ] Should see list of visualizations you made
   - [ ] Most recent first

3. **History Details**
   - [ ] See repository name for each visualization
   - [ ] See visualization date/time
   - [ ] See visualization mode (Neural or Tree)
   - [ ] See score
   - [ ] Can click repo link

4. **Sign Out & Sign In**
   - [ ] Sign out
   - [ ] Try to view `/leaderboard` - global rankings still visible
   - [ ] "My Visualizations" tab gone or shows "Sign in to view"
   - [ ] Sign back in
   - [ ] Personal history reappears

---

## Performance Testing

### Page Load Times
- [ ] Leaderboard page loads in < 2 seconds
- [ ] Visualization page loads in < 3 seconds
- [ ] No excessive console logs or errors

### Database Queries
- [ ] Check Supabase dashboard → check query performance
- [ ] Should see queries using created indexes
- [ ] No N+1 query patterns

### Large Dataset
- [ ] Visualize 5+ different repositories
- [ ] Leaderboard still responsive
- [ ] Pagination works if > 50 repos

---

## Edge Cases & Error Handling

### Invalid Input
- [ ] Try visualizing invalid GitHub URL
- [ ] Should show error message
- [ ] Can go back and try again

### Network Errors
- [ ] Stop internet temporarily while visualizing
- [ ] Should show error message
- [ ] Can retry after connection restored

### Duplicate Visualizations
- [ ] Visualize same repo twice
- [ ] Should appear in history twice
- [ ] Leaderboard shows repo with latest score

### Missing Data
- [ ] Visualize repo with minimal metadata
- [ ] Should still save and display
- [ ] Missing fields show "—" or 0

### Authentication
- [ ] Unauthenticated user can view global leaderboard
- [ ] Cannot see personal history when logged out
- [ ] Personal history visible when logged in
- [ ] Logout removes personal data view

---

## Browser Console Check

After all tests, check browser console:
- [ ] No red error messages
- [ ] No warnings about missing dependencies
- [ ] No CORS errors
- [ ] No authentication errors

---

## Data Verification (Advanced)

### Check Supabase Tables Directly

**In Supabase SQL Editor:**

```sql
-- Check repositories table
SELECT COUNT(*) FROM repositories;
-- Should see count equal to number of visualizations

-- Check user_visualizations table
SELECT COUNT(*) FROM user_visualizations;
-- Should see same or more (can visualize same repo multiple times)

-- View recent repos
SELECT full_name, score, created_at
FROM repositories
ORDER BY created_at DESC
LIMIT 5;
-- Should see your visualized repos with scores
```

- [ ] Data appears in tables
- [ ] Scores are between 0-100
- [ ] Timestamps are recent
- [ ] Repository names are correct

---

## Rollback Plan

If major issues found:

1. [ ] Delete all records from `user_visualizations` (safe, read-only)
2. [ ] Delete all records from `repositories` (safe, can rebuild)
3. [ ] Disable leaderboard routes temporarily
4. [ ] Notify users
5. [ ] Check error logs
6. [ ] Fix and redeploy

**Command to clean (use with caution):**
```sql
-- In Supabase SQL Editor
DELETE FROM user_visualizations;
DELETE FROM repositories;
```

---

## Sign-Off

- [ ] All checks passed
- [ ] No critical issues found
- [ ] User experience is smooth
- [ ] Data is accurate
- [ ] Ready for production launch

**Tested By**: ________________
**Date**: ________________
**Status**: ✅ APPROVED / ❌ BLOCKED

**Notes**:
```
[Add any notes here]
```

---

## Quick Links

- Database Schema: `db/migrations/001_create_leaderboard_schema.sql`
- Bug Fix Details: `BUG_FIX_LEADERBOARD.md`
- Setup Guide: `LEADERBOARD_SETUP.md`
- Implementation: `IMPLEMENTATION_SUMMARY.md`
- Quick Start: `QUICK_START_LEADERBOARD.md`
