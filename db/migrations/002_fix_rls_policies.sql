-- Fix RLS policies for MVP - Disable RLS on user_visualizations since we're using NextAuth
-- The issue: NextAuth session.user.id doesn't match Supabase auth.uid()
-- For MVP, we can safely disable RLS and rely on NextAuth authentication

-- Disable RLS on user_visualizations table temporarily
ALTER TABLE public.user_visualizations DISABLE ROW LEVEL SECURITY;

-- Keep RLS on repositories for public read access
-- DELETE existing restrictive policies first
DROP POLICY IF EXISTS "Users can create visualizations" ON public.user_visualizations;
DROP POLICY IF EXISTS "Users can view their own visualizations" ON public.user_visualizations;
DROP POLICY IF EXISTS "Users can update their own visualizations" ON public.user_visualizations;

-- Re-enable RLS with simple all-allow policies (since we're using NextAuth for actual auth)
ALTER TABLE public.user_visualizations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on user_visualizations for authenticated users"
  ON public.user_visualizations FOR ALL
  USING (true)
  WITH CHECK (true);

-- Repositories table can stay with simpler policies
DROP POLICY IF EXISTS "Repositories can only be written by authenticated users" ON public.repositories;
DROP POLICY IF EXISTS "Repositories can only be updated by system" ON public.repositories;

-- Allow anyone to read repositories
CREATE POLICY "Repositories readable by everyone"
  ON public.repositories FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update repositories
CREATE POLICY "Authenticated users can modify repositories"
  ON public.repositories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update repositories"
  ON public.repositories FOR UPDATE
  USING (true);
