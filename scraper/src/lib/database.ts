import { Database } from "bun:sqlite";
import type { TwitterProfile, ScrapedProfileRow } from "./schema";
import path from "path";

const dbPath = path.join(process.cwd(), "database.sqlite");
console.log(`Database path: ${dbPath}`);
const sqlite = new Database(dbPath);

export const db = {
  getProfile: (username: string): ScrapedProfileRow | null => {
    try {
      const query = sqlite.query(`
        SELECT * FROM scraped_profiles 
        WHERE username = ? 
        LIMIT 1
      `);
      const result = query.get(username);

      console.log(`Database query for username "${username}":`, result);

      if (!result) {
        return null;
      }

      return result as ScrapedProfileRow;
    } catch (error) {
      console.error("Database query error:", error);
      return null;
    }
  },

  insertProfile: (profile: TwitterProfile): void => {
    console.log(`Attempting to insert profile for: ${profile.username}`);
    const query = sqlite.query(`
      INSERT INTO scraped_profiles 
      (username, full_name, bio, avatar_url, followers, url, last_scraped, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const now = Math.floor(Date.now() / 1000);
    const result = query.run(
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
    console.log(`Insert result:`, result);
  },

  updateProfile: (username: string, profile: TwitterProfile): void => {
    console.log(`Attempting to update profile for: ${username}`);
    const query = sqlite.query(`
      UPDATE scraped_profiles 
      SET full_name = ?, bio = ?, avatar_url = ?, followers = ?, url = ?, 
          last_scraped = ?, updated_at = ?
      WHERE username = ?
    `);
    const now = Math.floor(Date.now() / 1000);
    const result = query.run(
      profile.fullName,
      profile.bio,
      profile.avatarUrl,
      profile.followers,
      profile.url,
      now,
      now,
      username
    );
    console.log(`Update result:`, result);
  },

  getAllProfiles: (): ScrapedProfileRow[] => {
    const query = sqlite.query("SELECT * FROM scraped_profiles ORDER BY updated_at DESC");
    const results = query.all();
    return results as ScrapedProfileRow[];
  },

  debugDatabase: () => {
    try {
      const query = sqlite.query(
        "SELECT username, last_scraped FROM scraped_profiles ORDER BY last_scraped DESC LIMIT 10"
      );
      const results = query.all();
      console.log("Current database contents:", results);
      return results;
    } catch (error) {
      console.error("Error checking database contents:", error);
      return [];
    }
  },

  testDatabase: () => {
    try {
      console.log("Testing database operations...");

      const testProfile: TwitterProfile = {
        username: "test_user_" + Date.now(),
        fullName: "Test User",
        bio: "Test bio",
        avatarUrl: "https://test.com/avatar.jpg",
        followers: "100",
        url: "https://x.com/test",
      };

      db.insertProfile(testProfile);
      console.log("Test insert completed");

      const retrieved = db.getProfile(testProfile.username);
      console.log("Test retrieve result:", retrieved);

      return !!retrieved;
    } catch (error) {
      console.error("Database test failed:", error);
      return false;
    }
  },
};

export function initializeDatabase() {
  try {
    sqlite.exec("PRAGMA journal_mode = WAL;");

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

    console.log("✅ Database initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    throw error;
  }
}
