import puppeteer from "puppeteer";

export interface TwitterProfile {
    fullName: string | null;
    username: string;
    bio: string | null;
    avatarUrl: string | null;
    followers: string | null;
    url: string;
}

export async function scrapeTwitterProfile(username: string): Promise<TwitterProfile | null> {
    const url = `https://x.com/${username}`;

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
            "--disable-features=VizDisplayCompositor",
        ],
    });
    const page = await browser.newPage();

    try {
        await page.setViewport({ width: 1920, height: 1080 });

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );

        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        await page.waitForSelector(
            'div[data-testid="UserName"], [data-testid="UserAvatar-Container-"], h1',
            { timeout: 15000 }
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
            { timeout: 20000 }
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
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-blink-features=AutomationControlled",
            "--disable-features=VizDisplayCompositor",
        ],
    });
    const page = await browser.newPage();

    try {
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        );

        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });
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
            { timeout: 15000 }
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
