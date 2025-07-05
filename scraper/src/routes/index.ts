import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import {
  scrapeTwitterProfile,
  scrapeTwitterAvatar,
  scrapeTwitterBioAndAvatar,
  getOrScrapeUserProfile,
  type TwitterProfile,
  type TwitterBioAvatar,
  type ExistingUserProfile,
} from "../lib/scraper";
import {
  registerScrapedProfile,
  registerBioAndAvatar,
  checkProfileExists,
} from "../services/register-service";

const app = new Hono();

app.use("*", cors());
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
    console.log(`🔍 Scraping profile for: ${username}`);

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

    const registerResult = await registerScrapedProfile(scrapedData);

    if (!registerResult.isSuccess) {
      console.error(`❌ Failed to register profile in main DB:`, registerResult.error);

      return c.json({
        success: true,
        data: scrapedData,
        cached: false,
        lastScraped: new Date(),
        registrationWarning: `Failed to register in main DB: ${registerResult.error}`,
      });
    }

    console.log(`✅ Successfully scraped and registered profile for ${username}`);

    return c.json({
      success: true,
      data: scrapedData,
      cached: false,
      lastScraped: new Date(),
      registeredUser: registerResult.user,
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
    console.log(`🔄 Force refreshing profile for: ${username}`);

    const scrapedData = await scrapeTwitterProfile(username);

    if (!scrapedData) {
      return c.json({ error: "Failed to scrape profile" }, 404);
    }

    const registerResult = await registerScrapedProfile(scrapedData);

    if (!registerResult.isSuccess) {
      console.error(`❌ Failed to register refreshed profile in main DB:`, registerResult.error);

      return c.json({
        success: true,
        data: scrapedData,
        cached: false,
        lastScraped: new Date(),
        registrationWarning: `Failed to register in main DB: ${registerResult.error}`,
      });
    }

    console.log(`✅ Successfully refreshed and registered profile for ${username}`);

    return c.json({
      success: true,
      data: scrapedData,
      cached: false,
      lastScraped: new Date(),
      registeredUser: registerResult.user,
    });
  } catch (error) {
    console.error("Error refreshing profile:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/profiles", async (c) => {
  return c.json(
    {
      error:
        "This endpoint is deprecated. The scraper no longer maintains a local database. Please use the main engine API to get user profiles.",
      suggestion: "Use GET /api/account/ on the main engine to get all user profiles",
    },
    410
  );
});

app.get("/profile/:username/exists", async (c) => {
  const username = c.req.param("username");

  if (!username) {
    return c.json({ error: "Username is required" }, 400);
  }

  try {
    const exists = await checkProfileExists(username);
    return c.json({
      success: true,
      username,
      exists,
    });
  } catch (error) {
    console.error("Error checking if profile exists:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/profile/:username/register-only", async (c) => {
  const username = c.req.param("username");

  if (!username) {
    return c.json({ error: "Username is required" }, 400);
  }

  try {
    console.log(`🎯 Scraping and registering profile (register-only mode): ${username}`);

    const scrapedData = await scrapeTwitterProfile(username);

    if (!scrapedData) {
      return c.json(
        { error: "Failed to scrape profile. Profile may not exist or be private." },
        404
      );
    }

    const registerResult = await registerScrapedProfile(scrapedData);

    if (!registerResult.isSuccess) {
      console.error(`❌ Failed to register profile in main DB:`, registerResult.error);
      return c.json(
        {
          success: false,
          error: `Failed to register profile: ${registerResult.error}`,
          scrapedData,
        },
        500
      );
    }

    console.log(`✅ Successfully scraped and registered profile for ${username}`);

    return c.json({
      success: true,
      message: `Profile ${username} successfully scraped and registered`,
      registeredUser: registerResult.user,
    });
  } catch (error) {
    console.error("Error in register-only mode:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/profile/:username/optimized", async (c) => {
  const username = c.req.param("username");

  if (!username) {
    return c.json({ error: "Username is required" }, 400);
  }

  try {
    console.log(`⚡ Optimized profile fetch for: ${username}`);

    const result = await getOrScrapeUserProfile(username);

    if (!result.success) {
      return c.json({ error: result.error || "Failed to get profile" }, 500);
    }

    if (!result.fromCache && result.data) {
      const bioAvatarData = result.data as TwitterBioAvatar;
      const registerResult = await registerBioAndAvatar(bioAvatarData);

      if (!registerResult.isSuccess) {
        console.warn(`⚠️ Failed to register scraped data: ${registerResult.error}`);

        return c.json({
          success: true,
          data: result.data,
          fromCache: false,
          registrationWarning: `Failed to register: ${registerResult.error}`,
        });
      }

      return c.json({
        success: true,
        data: result.data,
        fromCache: false,
        registeredUser: registerResult.user,
      });
    }

    return c.json({
      success: true,
      data: result.data,
      fromCache: true,
    });
  } catch (error) {
    console.error("Error in optimized profile fetch:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/profile/:username/bio-avatar", async (c) => {
  const username = c.req.param("username");

  if (!username) {
    return c.json({ error: "Username is required" }, 400);
  }

  try {
    console.log(`🔄 Scraping bio and avatar only for: ${username}`);

    const scrapedData = await scrapeTwitterBioAndAvatar(username);

    if (!scrapedData) {
      return c.json(
        { error: "Failed to scrape bio and avatar. Profile may not exist or be private." },
        404
      );
    }

    const registerResult = await registerBioAndAvatar(scrapedData);

    if (!registerResult.isSuccess) {
      console.error(`❌ Failed to register bio and avatar in main DB:`, registerResult.error);

      return c.json({
        success: true,
        data: scrapedData,
        registrationWarning: `Failed to register in main DB: ${registerResult.error}`,
      });
    }

    console.log(`✅ Successfully scraped and registered bio+avatar for ${username}`);

    return c.json({
      success: true,
      data: scrapedData,
      registeredUser: registerResult.user,
    });
  } catch (error) {
    console.error("Error scraping bio and avatar:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.post("/profile/:username/avatar-to-db", async (c) => {
  const username = c.req.param("username");

  if (!username) {
    return c.json({ error: "Username is required" }, 400);
  }

  try {
    console.log(`🖼️ Scraping avatar and posting to DB for: ${username}`);

    const avatarUrl = await scrapeTwitterAvatar(username);

    if (!avatarUrl) {
      return c.json({ error: "Failed to scrape avatar" }, 404);
    }

    const avatarData: TwitterBioAvatar = {
      username,
      fullName: null,
      bio: null,
      avatarUrl,
      url: `https://x.com/${username}`,
    };

    const registerResult = await registerBioAndAvatar(avatarData);

    if (!registerResult.isSuccess) {
      console.error(`❌ Failed to register avatar in main DB:`, registerResult.error);
      return c.json(
        {
          success: false,
          error: `Failed to register avatar: ${registerResult.error}`,
          avatarUrl,
        },
        500
      );
    }

    console.log(`✅ Successfully scraped and registered avatar for ${username}`);

    return c.json({
      success: true,
      message: `Avatar for ${username} successfully scraped and registered`,
      avatarUrl,
      registeredUser: registerResult.user,
    });
  } catch (error) {
    console.error("Error in avatar-to-db:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default app;
