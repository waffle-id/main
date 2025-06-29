import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { scrapeTwitterProfile, scrapeTwitterAvatar, type TwitterProfile } from '../lib/scraper';
import { db } from '../lib/database';
import type { ScrapedProfileRow } from '../lib/schema';

const app = new Hono();

// Middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:4173'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization']
}));
app.use('*', logger());

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get profile (check cache first, then scrape if needed)
app.get('/profile/:username', async (c) => {
  const username = c.req.param('username');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  try {
    // Check if we have recent data (within last 24 hours)
    const existingProfile: ScrapedProfileRow | null = db.getProfile(username);

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (existingProfile) {
      const lastScraped = new Date(existingProfile.last_scraped * 1000);

      if (lastScraped > oneDayAgo) {
        // Return cached data
        return c.json({
          success: true,
          data: {
            fullName: existingProfile.full_name,
            username: existingProfile.username,
            bio: existingProfile.bio,
            avatarUrl: existingProfile.avatar_url,
            followers: existingProfile.followers,
            url: existingProfile.url,
          },
          cached: true,
          lastScraped: existingProfile.last_scraped
        });
      }
    }

    // Scrape fresh data
    const scrapedData = await scrapeTwitterProfile(username);

    if (!scrapedData) {
      return c.json({ error: 'Failed to scrape profile. Profile may not exist or be private.' }, 404);
    }

    // Save to database
    if (existingProfile) {
      // Update existing record
      db.updateProfile(username, scrapedData);
    } else {
      // Insert new record
      db.insertProfile(scrapedData);
    }

    return c.json({
      success: true,
      data: scrapedData,
      cached: false,
      lastScraped: new Date()
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get avatar only (faster endpoint)
app.get('/avatar/:username', async (c) => {
  const username = c.req.param('username');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  try {
    const avatarUrl = await scrapeTwitterAvatar(username);

    if (!avatarUrl) {
      return c.json({ error: 'Failed to scrape avatar' }, 404);
    }

    return c.json({
      success: true,
      data: { avatarUrl },
      username
    });

  } catch (error) {
    console.error('Error fetching avatar:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Force refresh profile (bypass cache)
app.post('/profile/:username/refresh', async (c) => {
  const username = c.req.param('username');

  if (!username) {
    return c.json({ error: 'Username is required' }, 400);
  }

  try {
    const scrapedData = await scrapeTwitterProfile(username);

    if (!scrapedData) {
      return c.json({ error: 'Failed to scrape profile' }, 404);
    }

    // Save to database
    const existingProfile: ScrapedProfileRow | null = db.getProfile(username);

    if (existingProfile) {
      db.updateProfile(username, scrapedData);
    } else {
      db.insertProfile(scrapedData);
    }

    return c.json({
      success: true,
      data: scrapedData,
      cached: false,
      lastScraped: new Date()
    });

  } catch (error) {
    console.error('Error refreshing profile:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get all cached profiles
app.get('/profiles', async (c) => {
  try {
    const profiles: ScrapedProfileRow[] = db.getAllProfiles();

    return c.json({
      success: true,
      data: profiles.map((profile: ScrapedProfileRow) => ({
        fullName: profile.full_name,
        username: profile.username,
        bio: profile.bio,
        avatarUrl: profile.avatar_url,
        followers: profile.followers,
        url: profile.url,
        lastScraped: profile.last_scraped
      })),
      count: profiles.length
    });

  } catch (error) {
    console.error('Error fetching profiles:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default app;
