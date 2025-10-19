-- CodeSoul Leaderboard Schema
-- Run this in Supabase SQL Editor to set up the leaderboard tables

-- 1. Repositories Table
CREATE TABLE public.repositories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  github_repo_id INTEGER UNIQUE NOT NULL,
  owner VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL UNIQUE,
  url VARCHAR(512) NOT NULL,
  description TEXT,
  language VARCHAR(100),
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  watchers INTEGER DEFAULT 0,

  -- Scoring components
  score FLOAT DEFAULT 0,
  complexity_score FLOAT DEFAULT 0,
  activity_score FLOAT DEFAULT 0,
  social_score FLOAT DEFAULT 0,
  health_score FLOAT DEFAULT 0,

  -- Metadata for scoring
  branches_count INTEGER DEFAULT 0,
  commits_count INTEGER DEFAULT 0,
  contributors_count INTEGER DEFAULT 0,
  recent_commits_7d INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_scored_at TIMESTAMP WITH TIME ZONE,

  CONSTRAINT score_range CHECK (score >= 0 AND score <= 100)
);

-- 2. User Visualizations Table
CREATE TABLE public.user_visualizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  repository_id UUID NOT NULL REFERENCES public.repositories(id) ON DELETE CASCADE,

  -- Captured data at time of visualization
  repo_score FLOAT NOT NULL,
  complexity_score FLOAT,
  activity_score FLOAT,
  social_score FLOAT,
  health_score FLOAT,

  -- UI metadata
  visualization_mode VARCHAR(50), -- 'brain' or 'tree'
  caption_generated BOOLEAN DEFAULT FALSE,
  screenshot_taken BOOLEAN DEFAULT FALSE,
  shared_to_twitter BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_mode CHECK (visualization_mode IN ('brain', 'tree') OR visualization_mode IS NULL)
);

-- 3. Indexes for Performance
CREATE INDEX idx_repositories_score ON public.repositories(score DESC);
CREATE INDEX idx_repositories_created_at ON public.repositories(created_at DESC);
CREATE INDEX idx_repositories_full_name ON public.repositories(full_name);
CREATE INDEX idx_user_visualizations_user_id ON public.user_visualizations(user_id);
CREATE INDEX idx_user_visualizations_repo_id ON public.user_visualizations(repository_id);
CREATE INDEX idx_user_visualizations_created_at ON public.user_visualizations(created_at DESC);

-- 4. Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_visualizations ENABLE ROW LEVEL SECURITY;

-- Repositories: Everyone can read, only system can write
CREATE POLICY "Repositories are readable by everyone"
  ON public.repositories FOR SELECT
  USING (true);

CREATE POLICY "Repositories can only be written by authenticated users"
  ON public.repositories FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Repositories can only be updated by system"
  ON public.repositories FOR UPDATE
  USING (true);

-- User Visualizations: Users can read their own, system can write
CREATE POLICY "Users can view their own visualizations"
  ON public.user_visualizations FOR SELECT
  USING (auth.uid()::text = user_id OR user_id IS NOT NULL);

CREATE POLICY "Users can create visualizations"
  ON public.user_visualizations FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own visualizations"
  ON public.user_visualizations FOR UPDATE
  USING (auth.uid()::text = user_id);

-- 5. Helper Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Triggers for updated_at
CREATE TRIGGER update_repositories_updated_at
  BEFORE UPDATE ON public.repositories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_visualizations_updated_at
  BEFORE UPDATE ON public.user_visualizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
