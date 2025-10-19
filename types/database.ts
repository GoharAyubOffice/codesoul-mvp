// types/database.ts
// Database types for Supabase tables

export interface Repository {
  id: string;
  github_repo_id: number;
  owner: string;
  name: string;
  full_name: string;
  url: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  watchers: number;

  // Scores
  score: number;
  complexity_score: number;
  activity_score: number;
  social_score: number;
  health_score: number;

  // Metadata
  branches_count: number;
  commits_count: number;
  contributors_count: number;
  recent_commits_7d: number;

  // Timestamps
  created_at: string;
  updated_at: string;
  last_scored_at: string | null;
}

export interface RepositoryInsert {
  github_repo_id: number;
  owner: string;
  name: string;
  full_name: string;
  url: string;
  description?: string | null;
  language?: string | null;
  stars?: number;
  forks?: number;
  watchers?: number;
  branches_count?: number;
  commits_count?: number;
  contributors_count?: number;
  recent_commits_7d?: number;
}

export interface UserVisualization {
  id: string;
  user_id: string;
  repository_id: string;
  repo_score: number;
  complexity_score: number | null;
  activity_score: number | null;
  social_score: number | null;
  health_score: number | null;
  visualization_mode: 'brain' | 'tree' | null;
  caption_generated: boolean;
  screenshot_taken: boolean;
  shared_to_twitter: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserVisualizationInsert {
  user_id: string;
  repository_id: string;
  repo_score: number;
  complexity_score?: number;
  activity_score?: number;
  social_score?: number;
  health_score?: number;
  visualization_mode?: 'brain' | 'tree';
  caption_generated?: boolean;
  screenshot_taken?: boolean;
  shared_to_twitter?: boolean;
}

export interface RepositoryWithVisualizationCount extends Repository {
  visualization_count: number;
}
