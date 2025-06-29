import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('./database.sqlite');
export const db = drizzle(sqlite, { schema });

// Initialize database
export function initializeDatabase() {
  try {
    // Enable WAL mode for better concurrent access
    sqlite.pragma('journal_mode = WAL');
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}
