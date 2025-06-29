export interface TwitterProfile {
  fullName: string | null;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  followers: string | null;
  url: string;
}

export interface ScrapedProfileRow {
  id: number;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  followers: string | null;
  url: string;
  last_scraped: number;
  created_at: number;
  updated_at: number;
}

export interface CacheEntry {
  id: number;
  key: string;
  data: string;
  expires_at: string;
  created_at: string;
}
