import { Database } from 'bun:sqlite';
import type { TwitterProfile, ScrapedProfileRow } from './schema';

// Create SQLite database instance
const sqlite = new Database('./database.sqlite');

// Database operations using raw SQL with proper TypeScript types
export const db = {
  // Get profile by username
  getProfile: (username: string): ScrapedProfileRow | null => {
    const query = sqlite.query(`
      SELECT * FROM scraped_profiles 
      WHERE username = ? 
      LIMIT 1
    `);
    const result = query.get(username);
    return result as ScrapedProfileRow | null;
  },

  // Insert new profile
  insertProfile: (profile: TwitterProfile): void => {
    const query = sqlite.query(`
      INSERT INTO scraped_profiles 
      (username, full_name, bio, avatar_url, followers, url, last_scraped, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const now = Math.floor(Date.now() / 1000);
    query.run(
      profile.username,
      profile.fullName,
      profile.bio,
      profile.avatarUrl,
      profile.followers,
      profile.url,
      now,
      now,
      now
    );
  },

  // Update existing profile
  updateProfile: (username: string, profile: TwitterProfile): void => {
    const query = sqlite.query(`
      UPDATE scraped_profiles 
      SET full_name = ?, bio = ?, avatar_url = ?, followers = ?, url = ?, 
          last_scraped = ?, updated_at = ?
      WHERE username = ?
    `);
    const now = Math.floor(Date.now() / 1000);
    query.run(
      profile.fullName,
      profile.bio,
      profile.avatarUrl,
      profile.followers,
      profile.url,
      now,
      now,
      username
    );
  },

  // Get all profiles
  getAllProfiles: (): ScrapedProfileRow[] => {
    const query = sqlite.query('SELECT * FROM scraped_profiles ORDER BY updated_at DESC');
    const results = query.all();
    return results as ScrapedProfileRow[];
  }
};

// Initialize database
export function initializeDatabase() {
  try {
    // Enable WAL mode for better concurrent access
    sqlite.exec('PRAGMA journal_mode = WAL;');

    // Create table if not exists
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS scraped_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        full_name TEXT,
        bio TEXT,
        avatar_url TEXT,
        followers TEXT,
        url TEXT NOT NULL,
        last_scraped INTEGER DEFAULT (strftime('%s', 'now')),
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        updated_at INTEGER DEFAULT (strftime('%s', 'now'))
      );
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}
