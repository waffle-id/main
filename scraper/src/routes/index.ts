import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { scrapeTwitterProfile, scrapeTwitterAvatar, type TwitterProfile } from "../lib/scraper";
import { db } from "../lib/database";
import type { ScrapedProfileRow } from "../lib/schema";

const app = new Hono();

app.use(
  "*",
  cors()
  // cors({
  //   origin: ["http://localhost:3000", "http://localhost:5173", "http://localhost:4173"],
  //   allowMethods: ["GET", "POST", "PUT", "DELETE"],
  //   allowHeaders: ["Content-Type", "Authorization"],
  // })
);
app.use("*", logger());

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/debug", (c) => {
  let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN;

  if (!executablePath) {
    if (process.platform === "darwin") {
      executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    } else if (process.platform === "linux") {
      executablePath = "/usr/bin/chromium";
    } else if (process.platform === "win32") {
      executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    } else {
      executablePath = "/usr/bin/chromium";
    }
  }

  return c.json({
    environment: {
      PUPPETEER_EXECUTABLE_PATH: process.env.PUPPETEER_EXECUTABLE_PATH,
      CHROME_BIN: process.env.CHROME_BIN,
      PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD,
      DISPLAY: process.env.DISPLAY,
      NODE_ENV: process.env.NODE_ENV,
    },
    computed: {
      executablePath,
      platform: process.platform,
      arch: process.arch,
      nodeVersion: process.version,
    },
    timestamp: new Date().toISOString(),
  });
});

app.get("/test-chrome", async (c) => {
  try {
    console.log("Testing Chrome launch...");

    let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN;

    if (!executablePath) {
      if (process.platform === "darwin") {
        executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
      } else if (process.platform === "linux") {
        executablePath = "/usr/bin/chromium";
      } else if (process.platform === "win32") {
        executablePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
      } else {
        executablePath = "/usr/bin/chromium";
      }
    }

    const { scrapeTwitterProfile } = await import("../lib/scraper");

    const puppeteer = await import("puppeteer-extra");

    console.log("Attempting to launch Chrome...");
    const browser = await puppeteer.default.launch({
      executablePath,
      headless: true,
      timeout: 10000,
      protocolTimeout: 60000,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
        "--no-zygote",
        "--disable-web-security",
        "--disable-features=site-per-process",
        "--remote-debugging-port=0",
      ],
    });

    console.log("Chrome launched successfully!");

    const page = await browser.newPage();
    console.log("New page created");

    await page.goto("data:text/html,<h1>Test</h1>", { timeout: 5000 });
    console.log("Navigation successful");

    const title = await page.evaluate(() => document.querySelector("h1")?.textContent);
    console.log("Page evaluation successful:", title);

    await browser.close();
    console.log("Chrome closed successfully");

    return c.json({
      success: true,
      message: "Chrome test passed",
      title: title,
      executable: executablePath,
      platform: process.platform,
    });
  } catch (error: any) {
    console.error("Chrome test failed:", error);
    return c.json(
      {
        success: false,
        error: error.message,
        stack: error.stack,
        executable: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
        platform: process.platform,
      },
      500
    );
  }
});

app.get("/profile/:username", async (c) => {
  const username = c.req.param("username");

  if (!username) {
    return c.json({ error: "Username is required" }, 400);
  }

  try {
    console.log(`Checking for existing profile: ${username}`);

    db.debugDatabase();

    const existingProfile: ScrapedProfileRow | null = db.getProfile(username);
    console.log(`Profile check result:`, existingProfile ? "found" : "not found");

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (existingProfile) {
      console.log("if existingProfile");
      const lastScraped = new Date(existingProfile.last_scraped * 1000);

      if (lastScraped > oneDayAgo) {
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
          lastScraped: existingProfile.last_scraped,
        });
      }
    }

    console.log("else existingProfile");

    const scrapedData = await scrapeTwitterProfile(username);

    if (!scrapedData) {
      return c.json(
        { error: "Failed to scrape profile. Profile may not exist or be private." },
        404
      );
    }

    console.log("=== SCRAPED DATA DEBUG ===");
    console.log("Scraped data for username:", username);
    console.log("Scraped data object:", scrapedData);
    console.log("==========================");

    try {
      if (existingProfile) {
        console.log(`Updating existing profile for ${username}`);
        db.updateProfile(username, scrapedData);
      } else {
        console.log(`Inserting new profile for ${username}`);
        db.insertProfile(scrapedData);
      }
    } catch (dbError: any) {
      if (dbError.code === "SQLITE_CONSTRAINT_UNIQUE") {
        console.log(`Constraint error for ${username}, trying update instead`);
        db.updateProfile(username, scrapedData);
      } else {
        throw dbError;
      }
    }

    return c.json({
      success: true,
      data: scrapedData,
      cached: false,
      lastScraped: new Date(),
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/avatar/:username", async (c) => {
  const username = c.req.param("username");

  if (!username) {
    return c.json({ error: "Username is required" }, 400);
  }

  try {
    const avatarUrl = await scrapeTwitterAvatar(username);

    if (!avatarUrl) {
      return c.json({ error: "Failed to scrape avatar" }, 404);
    }

    return c.json({
      success: true,
      data: { avatarUrl },
      username,
    });
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/profile/:username/refresh", async (c) => {
  const username = c.req.param("username");

  if (!username) {
    return c.json({ error: "Username is required" }, 400);
  }

  try {
    // Don't auto-post to backend for manual refresh requests
    const scrapedData = await scrapeTwitterProfile(username, false);

    if (!scrapedData) {
      return c.json({ error: "Failed to scrape profile" }, 404);
    }

    try {
      const existingProfile: ScrapedProfileRow | null = db.getProfile(username);

      if (existingProfile) {
        console.log(`Updating existing profile for ${username} (refresh)`);
        db.updateProfile(username, scrapedData);
      } else {
        console.log(`Inserting new profile for ${username} (refresh)`);
        db.insertProfile(scrapedData);
      }
    } catch (dbError: any) {
      if (dbError.code === "SQLITE_CONSTRAINT_UNIQUE") {
        console.log(`Constraint error for ${username} (refresh), trying update instead`);
        db.updateProfile(username, scrapedData);
      } else {
        throw dbError;
      }
    }

    return c.json({
      success: true,
      data: scrapedData,
      cached: false,
      lastScraped: new Date(),
    });
  } catch (error) {
    console.error("Error refreshing profile:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/profiles", async (c) => {
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
        lastScraped: profile.last_scraped,
      })),
      count: profiles.length,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
