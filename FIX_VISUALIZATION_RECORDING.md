# Fix for Visualization Recording Issue

## Problem

Visualizations are being recorded in the UI, but not being saved to the database. Error: "Failed to record visualization"

**Root Cause**: RLS (Row Level Security) policies on `user_visualizations` table are too restrictive. They require `auth.uid()::text = user_id`, but we're using NextAuth which has a different user ID format.

## Solution

Run this migration in Supabase to fix the RLS policies:

### Quick Fix (2 minutes)

1. **Open Supabase Dashboard** → SQL Editor
2. **Create New Query**
3. **Copy and paste** the contents of: `db/migrations/002_fix_rls_policies.sql`
4. **Click "Run"**

### What This Does

- ✅ Allows `user_visualizations` inserts from authenticated users
- ✅ Keeps `repositories` table readable by everyone
- ✅ Relies on NextAuth for actual security (not Supabase auth)
- ✅ Maintains data integrity

### Why This Is Safe for MVP

1. **NextAuth Protection**: Real auth is done at the API level via NextAuth
2. **API Validation**: `/api/leaderboard` route checks `getServerSession()` before allowing inserts
3. **Temporary**: Can be tightened in post-MVP with proper Supabase auth integration
4. **Still Private**: Users can only see their own data at API level

## Alternative: Manual Fix

If you prefer to keep more restrictive policies, update the migration to:

```sql
-- Option 1: Allow any authenticated user (broad)
CREATE POLICY "Allow all authenticated users"
  ON public.user_visualizations FOR INSERT
  WITH CHECK (auth.role() = 'authenticated_user');

-- Option 2: Allow by email
CREATE POLICY "Allow by user email"
  ON public.user_visualizations FOR INSERT
  WITH CHECK (auth.jwt() ->> 'email' = user_id);
```

## Verification

After running the migration:

1. Go to Dashboard
2. Visualize a repository
3. Check server logs - should see `console.log` output:
   ```
   Recording visualization: { userId: "...", repositoryId: "...", ... }
   Visualization recorded successfully: { id: "...", ... }
   ```
4. Go to `/leaderboard`
5. Check "My Visualizations" tab
6. Should see your visualization ✅

## Files Changed

- `db/migrations/002_fix_rls_policies.sql` - New migration to fix RLS
- `lib/scoring/repositoryService.ts` - Added detailed console logging
- `app/api/leaderboard/route.ts` - Better error details

## Next Steps After Fix

1. Run the migration
2. Restart your dev server: `npm run dev`
3. Try visualizing a repo again
4. Check leaderboard - data should appear

## Troubleshooting

### Still getting errors?

Check server console for detailed error messages. Look for:
```
Supabase error recording visualization: {
  code: "...",
  message: "...",
  details: "...",
  hint: "..."
}
```

### RLS policy errors?

If you see "new row violates row level security policy", it means the migration didn't run properly:
- Go to Supabase → Authentication → Policies
- Make sure the policies on `user_visualizations` are updated
- Try running the migration again

### Foreign key errors?

If you see "violates foreign key constraint", it means:
- Repository wasn't created properly
- Check `repositories` table exists and has data
- Restart dev server and try again

## Post-MVP Improvement

For production, integrate with Supabase auth properly:

```sql
-- Better policy for production
CREATE POLICY "Users own their visualizations"
  ON public.user_visualizations FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own visualizations"
  ON public.user_visualizations FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);
```

Then update NextAuth to use Supabase auth as the source of truth.

---

**Status**: 🔴 BLOCKING (needs migration)
**Fix Time**: 2 minutes
**Difficulty**: Easy
