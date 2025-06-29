import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const scrapedProfiles = sqliteTable('scraped_profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  fullName: text('full_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  followers: text('followers'),
  url: text('url').notNull(),
  lastScraped: integer('last_scraped', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`)
});

export type TwitterProfile = typeof scrapedProfiles.$inferSelect;
export type NewTwitterProfile = typeof scrapedProfiles.$inferInsert;
