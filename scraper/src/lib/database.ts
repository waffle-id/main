import sqlite3 from "sqlite3";
import { open, Database as SQLiteDatabase } from "sqlite";
import path from "path";
import type { TwitterProfile, ScrapedProfileRow } from "./schema";

const dbPath = path.join(process.cwd(), "database.sqlite");
console.log(`Database path: ${dbPath}`);

let sqlite: SQLiteDatabase<sqlite3.Database, sqlite3.Statement>;

export const db = {
  async init() {
    sqlite = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    await sqlite.run("PRAGMA journal_mode = WAL");
    console.log("✅ Database connection initialized");
  },

  async getProfile(username: string): Promise<ScrapedProfileRow | null> {
    try {
      const result = await sqlite.get<ScrapedProfileRow>(
        `SELECT * FROM scraped_profiles WHERE username = ? LIMIT 1`,
        username
      );
      console.log(`Database query for "${username}":`, result);
      return result ?? null;
    } catch (error) {
      console.error("Database query error:", error);
      return null;
    }
  },

  async insertProfile(profile: TwitterProfile): Promise<void> {
    try {
      console.log(`Inserting profile for: ${profile.username}`);
      const now = Math.floor(Date.now() / 1000);
      await sqlite.run(
        `INSERT INTO scraped_profiles 
        (username, full_name, bio, avatar_url, followers, url, last_scraped, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      console.log("Insert complete");
    } catch (error) {
      console.error("Insert error:", error);
    }
  },

  async updateProfile(username: string, profile: TwitterProfile): Promise<void> {
    try {
      console.log(`Updating profile for: ${username}`);
      const now = Math.floor(Date.now() / 1000);
      await sqlite.run(
        `UPDATE scraped_profiles 
        SET full_name = ?, bio = ?, avatar_url = ?, followers = ?, url = ?, 
            last_scraped = ?, updated_at = ?
        WHERE username = ?`,
        profile.fullName,
        profile.bio,
        profile.avatarUrl,
        profile.followers,
        profile.url,
        now,
        now,
        username
      );
      console.log("Update complete");
    } catch (error) {
      console.error("Update error:", error);
    }
  },

  async getAllProfiles(): Promise<ScrapedProfileRow[]> {
    try {
      return await sqlite.all<ScrapedProfileRow[]>(
        `SELECT * FROM scraped_profiles ORDER BY updated_at DESC`
      );
    } catch (error) {
      console.error("Get all profiles error:", error);
      return [];
    }
  },

  async debugDatabase(): Promise<ScrapedProfileRow[]> {
    try {
      const results = await sqlite.all<ScrapedProfileRow[]>(
        `SELECT username, last_scraped FROM scraped_profiles ORDER BY last_scraped DESC LIMIT 10`
      );
      console.log("Database contents:", results);
      return results;
    } catch (error) {
      console.error("Debug error:", error);
      return [];
    }
  },

  async testDatabase(): Promise<boolean> {
    try {
      console.log("Testing database...");

      const testProfile: TwitterProfile = {
        username: "test_user_" + Date.now(),
        fullName: "Test User",
        bio: "Test bio",
        avatarUrl: "https://test.com/avatar.jpg",
        followers: "100",
        url: "https://x.com/test",
      };

      await db.insertProfile(testProfile);
      const retrieved = await db.getProfile(testProfile.username);
      console.log("Retrieved:", retrieved);
      return !!retrieved;
    } catch (error) {
      console.error("Test failed:", error);
      return false;
    }
  },
};

export async function initializeDatabase() {
  try {
    await db.init();
    await sqlite.exec(`
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
    console.log("✅ Database schema initialized");
  } catch (error) {
    console.error("❌ Failed to initialize database schema:", error);
    throw error;
  }
}
