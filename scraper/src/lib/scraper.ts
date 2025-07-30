import puppeteer from "puppeteer-extra";

export interface TwitterProfile {
  fullName: string | null;
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  followers: string | null;
  url: string;
}

export interface TwitterBioAvatar {
  username: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  url: string;
}

export interface ExistingUserProfile {
  address: string;
  username: string;
  fullName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  reputationScore: number;
  hasInvitationAuthority: boolean;
  userPersonaScores: any[];
}

export async function scrapeTwitterProfile(username: string): Promise<TwitterProfile | null> {
  const url = `https://x.com/${username}`;

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

  console.log(
    "scrapeTwitterProfile ",
    url,
    "using executable:",
    executablePath,
    "platform:",
    process.platform
  );

  const chromeArgs = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-gpu",
    "--disable-software-rasterizer",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-features=TranslateUI",
    "--disable-ipc-flooding-protection",
    "--disable-blink-features=AutomationControlled",
    "--disable-features=VizDisplayCompositor",
    "--disable-extensions",
    "--disable-plugins",
    "--disable-default-apps",
    "--disable-sync",
    "--disable-translate",
    "--hide-scrollbars",
    "--mute-audio",
    "--no-first-run",
    "--no-default-browser-check",
    "--no-zygote",
    "--single-process",
    "--disable-web-security",
    "--disable-features=site-per-process",
    "--disable-infobars",
    "--window-position=0,0",
    "--ignore-certifcate-errors",
    "--ignore-certifcate-errors-spki-list",
    "--ignore-certificate-errors",
    "--ignore-ssl-errors",
    "--allow-running-insecure-content",
    "--disable-web-security",
    "--disable-features=VizDisplayCompositor",
    "--remote-debugging-port=0",
    "--memory-pressure-off",
    "--max_old_space_size=4096",
    "--disable-background-networking",
    "--disable-background-media-suspend",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
    "--disable-client-side-phishing-detection",
    "--disable-default-apps",
    "--disable-hang-monitor",
    "--disable-popup-blocking",
    "--disable-prompt-on-repost",
    "--disable-sync",
    "--disable-domain-reliability",
    "--disable-features=AudioServiceOutOfProcess",
    "--disable-features=MediaRouter",
    "--disable-print-preview",
    "--disable-voice-input",
    "--disable-wake-on-wifi",
    "--enable-features=NetworkService,NetworkServiceLogging",
    "--force-color-profile=srgb",
    "--metrics-recording-only",
    "--use-mock-keychain",
    "--enable-automation",
    "--password-store=basic",
    "--use-mock-keychain",
    "--no-service-autorun",
    "--disable-component-update",
  ];

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: chromeArgs,
    timeout: 0,
    // protocolTimeout: 300000,
  });
  const page = await browser.newPage();

  try {
    await page.setViewport({ width: 1920, height: 1080 });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    console.log("Navigating to:", url);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    console.log("Page loaded, waiting for content...");

    try {
      await page.waitForSelector("div, span, h1", { timeout: 10000 });
      console.log("Basic content found");
    } catch (e) {
      console.log("No basic content found, proceeding anyway");
    }

    await page.waitForSelector(
      'div[data-testid="UserName"], [data-testid="UserAvatar-Container-"], h1',
      { timeout: 15000 * 2 }
    );

    await page.waitForNetworkIdle();

    await page.waitForFunction(
      () => {
        const imgWithSrc = document.querySelector('img[alt="Opens profile photo"]');
        const divWithBg = Array.from(document.querySelectorAll("div")).find(
          (div) =>
            div.style.backgroundImage &&
            div.style.backgroundImage.includes("pbs.twimg.com/profile_images")
        );
        return imgWithSrc || divWithBg;
      },
      { timeout: 20000 * 2 }
    );

    const data = await page.evaluate((username) => {
      const nameEl =
        document.querySelector('div[data-testid="UserName"] span span') ||
        document.querySelector('h1[role="heading"]') ||
        document.querySelector('[data-testid="UserDescription"] + div span') ||
        document.querySelector("h1");

      const usernameEl =
        document.querySelector('div[data-testid="UserName"] span:last-child') ||
        document.querySelector('[data-testid="UserScreenName"]') ||
        document.querySelector('span:contains("@")');

      const bioEl =
        document.querySelector('[data-testid="UserDescription"]') ||
        document.querySelector('[data-testid="UserBio"]') ||
        document.querySelector('div[data-testid="UserDescription"] span') ||
        document.querySelector('div[data-testid="UserName"] + div[dir="auto"]') ||
        document.querySelector(
          'div[data-testid="UserName"] ~ div[dir="auto"]:not([data-testid*="tweet"])'
        );

      let bio = bioEl?.textContent?.trim() || null;
      if (bio) {
        const tweetPatterns: (RegExp | boolean)[] = [
          /^RT @/,
          /https:\/\/t\.co\//,
          /^@\w+/,
          bio.length > 300,
          /\n.*\n/,
        ];

        const looksLikeTweet = tweetPatterns.some((pattern) =>
          typeof pattern === "boolean" ? pattern : pattern.test(bio!)
        );

        if (looksLikeTweet) {
          console.log("Detected tweet content instead of bio, skipping:", bio.substring(0, 100));
          bio = null;
        }
      }

      let avatarUrl: string | null = null;

      console.log("=== AVATAR EXTRACTION DEBUG ===");

      const profileImg = document.querySelector(
        'img[alt="Opens profile photo"]'
      ) as HTMLImageElement | null;
      console.log("Profile img element:", profileImg);
      console.log("Profile img src:", profileImg?.src);

      if (profileImg && profileImg.src && profileImg.src.includes("pbs.twimg.com/profile_images")) {
        avatarUrl = profileImg.src;
        console.log("✅ Found avatar via img alt method:", avatarUrl);
      }

      if (!avatarUrl) {
        const allImgs = document.querySelectorAll("img") as NodeListOf<HTMLImageElement>;
        console.log("Total img elements found:", allImgs.length);

        for (let img of allImgs) {
          console.log("Checking img:", img.src, img.alt);
          if (img.src && img.src.includes("pbs.twimg.com/profile_images")) {
            avatarUrl = img.src;
            console.log("✅ Found avatar via img src scan:", avatarUrl);
            break;
          }
        }
      }

      if (!avatarUrl) {
        const allDivs = document.querySelectorAll("div") as NodeListOf<HTMLDivElement>;
        console.log("Total div elements to scan:", allDivs.length);

        for (let div of allDivs) {
          if (div.style.backgroundImage) {
            console.log("Found div with background-image:", div.style.backgroundImage);
            if (div.style.backgroundImage.includes("pbs.twimg.com/profile_images")) {
              const match = div.style.backgroundImage.match(/url\("([^"]+)"\)/);
              if (match) {
                avatarUrl = match[1];
                console.log("✅ Found avatar via background-image:", avatarUrl);
                break;
              }
            }
          }
        }
      }

      if (!avatarUrl) {
        const profileDiv = document.querySelector(
          'div[aria-label="Opens profile photo"]'
        ) as HTMLDivElement | null;
        console.log("Profile div with aria-label:", profileDiv);

        if (profileDiv) {
          const childImg = profileDiv.querySelector("img") as HTMLImageElement | null;
          if (childImg && childImg.src) {
            avatarUrl = childImg.src;
            console.log("✅ Found avatar via aria-label div child img:", avatarUrl);
          }

          if (!avatarUrl) {
            const childDivs = profileDiv.querySelectorAll("div") as NodeListOf<HTMLDivElement>;
            for (let childDiv of childDivs) {
              if (
                childDiv.style.backgroundImage &&
                childDiv.style.backgroundImage.includes("profile_images")
              ) {
                const match = childDiv.style.backgroundImage.match(/url\("([^"]+)"\)/);
                if (match) {
                  avatarUrl = match[1];
                  console.log("✅ Found avatar via aria-label div child background:", avatarUrl);
                  break;
                }
              }
            }
          }
        }
      }

      const followersEl = Array.from(
        document.querySelectorAll(
          'a[href$="/verified_followers"] span, a[href$="/followers"] span, span'
        )
      )
        .map((el) => el.textContent?.trim())
        .find(
          (t) => t && /\d/.test(t) && (t.includes("followers") || /^\d+(\.\d+)?[KMB]?$/.test(t))
        );

      const followerText =
        document.querySelector('a[href$="/followers"]')?.textContent ||
        document.querySelector('a[href$="/verified_followers"]')?.textContent ||
        Array.from(document.querySelectorAll("span")).find(
          (el) => el.textContent?.includes("followers") || el.textContent?.includes("Followers")
        )?.textContent;

      console.log("=== FINAL RESULTS ===");
      console.log("Avatar URL:", avatarUrl);

      if (avatarUrl && avatarUrl.includes("_200x200")) {
        const highResUrl = avatarUrl.replace("_200x200", "_400x400");
        console.log("Attempting to upgrade to higher resolution:", highResUrl);
        avatarUrl = highResUrl;
      } else if (avatarUrl && !avatarUrl.includes("_400x400") && !avatarUrl.includes("_200x200")) {
        const urlParts = avatarUrl.split(".");
        if (urlParts.length >= 2) {
          const extension = urlParts.pop();
          const baseUrl = urlParts.join(".");
          const highResUrl = baseUrl + "_400x400." + extension;
          console.log("Attempting to add 400x400 resolution:", highResUrl);
          avatarUrl = highResUrl;
        }
      }

      console.log("Final Avatar URL:", avatarUrl);
      console.log("========================");

      const fullName = nameEl?.textContent?.trim() || null;

      const handle = username;

      console.log("=== SCRAPER DEBUG ===");
      console.log("Input username:", username);
      console.log("Found fullName:", fullName);
      console.log("Using handle (forced to input):", handle);
      console.log("usernameEl content:", usernameEl?.textContent);
      console.log("=====================");

      let followersCount = followersEl || followerText || null;
      if (followersCount) {
        const match = followersCount.match(/(\d+(?:\.\d+)?[KMB]?)/);
        if (match) {
          followersCount = match[1];
        }
      }

      return {
        fullName,
        username: handle,
        bio,
        avatarUrl,
        followers: followersCount,
        url: window.location.href,
      };
    }, username);

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    console.log("err ", err);
    const error = err as Error;
    console.error("Scraping failed:", error.message);
    console.error("This might be due to:");
    console.error("1. Twitter/X bot detection");
    console.error("2. Rate limiting");
    console.error("3. Changed HTML structure");
    console.error("4. Profile doesn't exist or is private");
    return null;
  }
}

export async function scrapeTwitterAvatar(username: string): Promise<string | null> {
  const url = `https://x.com/${username}`;

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

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    timeout: 0,
    // protocolTimeout: 300000,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-blink-features=AutomationControlled",
      "--disable-features=VizDisplayCompositor",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-extensions",
      "--disable-default-apps",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--remote-debugging-port=0",
    ],
  });
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 * 2 });
    await page.waitForNetworkIdle();

    await page.waitForFunction(
      () => {
        const imgWithProfilePhoto = document.querySelector('img[alt="Opens profile photo"]');
        const anyProfileImg = document.querySelector('img[src*="pbs.twimg.com/profile_images"]');
        const divWithProfileBg = Array.from(document.querySelectorAll("div")).find(
          (div) =>
            div.style.backgroundImage &&
            div.style.backgroundImage.includes("pbs.twimg.com/profile_images")
        );

        console.log("Waiting for profile elements...");
        console.log("Found img with alt:", !!imgWithProfilePhoto);
        console.log("Found img with profile src:", !!anyProfileImg);
        console.log("Found div with profile bg:", !!divWithProfileBg);

        return imgWithProfilePhoto || anyProfileImg || divWithProfileBg;
      },
      { timeout: 15000 * 2 }
    );

    const avatarUrl = await page.evaluate(() => {
      console.log("=== DEDICATED AVATAR SCRAPER ===");

      const profileImg = document.querySelector(
        'img[alt="Opens profile photo"]'
      ) as HTMLImageElement | null;
      if (profileImg && profileImg.src) {
        console.log('Found via alt="Opens profile photo":', profileImg.src);
        return profileImg.src;
      }

      const anyProfileImg = document.querySelector(
        'img[src*="pbs.twimg.com/profile_images"]'
      ) as HTMLImageElement | null;
      if (anyProfileImg && anyProfileImg.src) {
        console.log("Found via profile_images img:", anyProfileImg.src);
        return anyProfileImg.src;
      }

      const allDivs = document.querySelectorAll("div") as NodeListOf<HTMLDivElement>;
      for (const div of allDivs) {
        if (
          div.style.backgroundImage &&
          div.style.backgroundImage.includes("pbs.twimg.com/profile_images")
        ) {
          const match = div.style.backgroundImage.match(/url\("([^"]+)"\)/);
          if (match) {
            console.log("Found via background-image:", match[1]);
            return match[1];
          }
        }
      }

      console.log("No avatar found");
      return null;
    });

    let finalAvatarUrl = avatarUrl;
    if (finalAvatarUrl && finalAvatarUrl.includes("_200x200")) {
      const highResUrl = finalAvatarUrl.replace("_200x200", "_400x400");
      console.log("Upgraded to higher resolution:", highResUrl);
      finalAvatarUrl = highResUrl;
    }

    await browser.close();
    return finalAvatarUrl;
  } catch (err) {
    await browser.close();
    const error = err as Error;
    console.error("Avatar scraping failed:", error.message);
    return null;
  }
}

export async function scrapeTwitterBioAndAvatar(
  username: string
): Promise<TwitterBioAvatar | null> {
  const url = `https://x.com/${username}`;

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

  console.log(
    "scrapeTwitterBioAndAvatar ",
    url,
    "using executable:",
    executablePath,
    "platform:",
    process.platform
  );

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    // protocolTimeout: 300000,
    timeout: 0,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-blink-features=AutomationControlled",
      "--disable-features=VizDisplayCompositor",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-extensions",
      "--disable-default-apps",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--remote-debugging-port=0",
      "--disable-web-security",
      "--disable-features=site-per-process",
    ],
  });
  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    console.log("Loading page for bio and avatar...");
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });

    try {
      await page.waitForSelector(
        'img[alt="Opens profile photo"], img[src*="pbs.twimg.com/profile_images"], [data-testid="UserDescription"]',
        { timeout: 10000 }
      );
      console.log("Bio or avatar elements found");
    } catch (e) {
      console.log("Basic elements not found, proceeding anyway");
    }

    // await page.waitForNetworkIdle({ idleTime: 1000, timeout: 8000 });

    const data = await page.evaluate((username) => {
      console.log("=== BIO + AVATAR + FULLNAME SCRAPER ===");

      const nameEl =
        document.querySelector('div[data-testid="UserName"] span span') ||
        document.querySelector('h1[role="heading"]') ||
        document.querySelector('[data-testid="UserDescription"] + div span') ||
        document.querySelector("h1");

      const fullName = nameEl?.textContent?.trim() || null;

      const bioEl =
        document.querySelector('[data-testid="UserDescription"]') ||
        document.querySelector('[data-testid="UserBio"]') ||
        document.querySelector('div[data-testid="UserDescription"] span') ||
        document.querySelector('div[data-testid="UserName"] + div[dir="auto"]') ||
        document.querySelector(
          'div[data-testid="UserName"] ~ div[dir="auto"]:not([data-testid*="tweet"])'
        );

      let bio = bioEl?.textContent?.trim() || null;
      if (bio) {
        const tweetPatterns: (RegExp | boolean)[] = [
          /^RT @/,
          /https:\/\/t\.co\//,
          /^@\w+/,
          bio.length > 300,
          /\n.*\n/,
        ];

        const looksLikeTweet = tweetPatterns.some((pattern) =>
          typeof pattern === "boolean" ? pattern : pattern.test(bio!)
        );

        if (looksLikeTweet) {
          console.log("Detected tweet content instead of bio, skipping:", bio.substring(0, 100));
          bio = null;
        }
      } else {
        bio = null;
      }

      let avatarUrl: string | null = null;

      const profileImg = document.querySelector(
        'img[alt="Opens profile photo"]'
      ) as HTMLImageElement | null;
      if (profileImg && profileImg.src && profileImg.src.includes("pbs.twimg.com/profile_images")) {
        avatarUrl = profileImg.src;
        console.log("✅ Found avatar via img alt method:", avatarUrl);
      }

      if (!avatarUrl) {
        const anyProfileImg = document.querySelector(
          'img[src*="pbs.twimg.com/profile_images"]'
        ) as HTMLImageElement | null;
        if (anyProfileImg && anyProfileImg.src) {
          avatarUrl = anyProfileImg.src;
          console.log("✅ Found avatar via profile_images img:", avatarUrl);
        }
      }

      if (!avatarUrl) {
        const allDivs = document.querySelectorAll("div") as NodeListOf<HTMLDivElement>;
        for (const div of allDivs) {
          if (
            div.style.backgroundImage &&
            div.style.backgroundImage.includes("pbs.twimg.com/profile_images")
          ) {
            const match = div.style.backgroundImage.match(/url\("([^"]+)"\)/);
            if (match) {
              avatarUrl = match[1];
              console.log("✅ Found avatar via background-image:", avatarUrl);
              break;
            }
          }
        }
      }

      if (avatarUrl && avatarUrl.includes("_200x200")) {
        const highResUrl = avatarUrl.replace("_200x200", "_400x400");
        console.log("Upgraded to higher resolution:", highResUrl);
        avatarUrl = highResUrl;
      } else if (avatarUrl && !avatarUrl.includes("_400x400") && !avatarUrl.includes("_200x200")) {
        const urlParts = avatarUrl.split(".");
        if (urlParts.length >= 2) {
          const extension = urlParts.pop();
          const baseUrl = urlParts.join(".");
          const highResUrl = baseUrl + "_400x400." + extension;
          console.log("Added 400x400 resolution:", highResUrl);
          avatarUrl = highResUrl;
        }
      }

      console.log("=== RESULTS ===");
      console.log("Full Name:", fullName);
      console.log("Bio:", bio ? bio.substring(0, 100) + "..." : "null");
      console.log("Avatar URL:", avatarUrl);
      console.log("================");

      return {
        username,
        fullName,
        bio,
        avatarUrl,
        url: window.location.href,
      };
    }, username);

    await browser.close();
    console.log(`✅ Successfully scraped bio, avatar and fullName for ${username}`);
    return data;
  } catch (err) {
    await browser.close();
    const error = err as Error;
    console.error("Bio + Avatar + FullName scraping failed:", error.message);
    return null;
  }
}

export async function checkUserInMainDB(username: string): Promise<ExistingUserProfile | null> {
  const url = `https://api.waffle.food/account/${username}`;

  console.log(`🔍 Checking user in main DB: ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const userData = await response.json();
      console.log(`✅ User ${username} found in main DB`);
      return userData;
    } else if (response.status === 404) {
      console.log(`📭 User ${username} not found in main DB`);
      return null;
    } else {
      console.warn(`⚠️ Unexpected response when checking user: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error(`❌ Error checking user in main DB:`, error);
    return null;
  }
}

export async function getOrScrapeUserProfile(username: string): Promise<{
  success: boolean;
  data?: ExistingUserProfile | TwitterBioAvatar;
  fromCache: boolean;
  error?: string;
}> {
  try {
    console.log(`🚀 Getting or scraping profile for: ${username}`);

    const existingUser = await checkUserInMainDB(username);

    if (existingUser) {
      console.log(`✅ User ${username} found in cache, returning existing data`);
      return {
        success: true,
        data: existingUser,
        fromCache: true,
      };
    }

    console.log(`🔄 User ${username} not in cache, scraping bio and avatar...`);
    const scrapedData = await scrapeTwitterBioAndAvatar(username);

    if (!scrapedData) {
      return {
        success: false,
        fromCache: false,
        error: "Failed to scrape profile data",
      };
    }

    console.log(`✅ Successfully scraped bio and avatar for ${username}`);
    return {
      success: true,
      data: scrapedData,
      fromCache: false,
    };
  } catch (error) {
    console.error(`❌ Error in getOrScrapeUserProfile:`, error);
    return {
      success: false,
      fromCache: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
