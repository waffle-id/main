#!/usr/bin/env tsx

/**
 * Waffle Username Scraper
 *
 * A simple automated tool to scrape X (Twitter) profile data using the Waffle scraper API.
 *
 * Usage:
 * - npm run scrape          - Scrape 15 usernames (default)
 * - npm run scrape [number] - Scrape specific number of usernames
 * - npm run scrape forever  - Scrape continuously 24/7
 */

import {
    generateUsername,
    uniqueUsernameGenerator,
    adjectives,
    nouns,
} from "unique-username-generator";

interface ScraperProfileData {
    success: boolean;
    data: {
        username: string;
        fullName: string | null;
        bio: string | null;
        avatarUrl: string | null;
        url: string;
    };
    fromCache: boolean;
    registeredUser?: {
        id: string;
        address: string;
        username: string;
        hasInvitationAuthority: boolean;
        reputationScore: number;
    };
}

interface ScrapeResult {
    username: string;
    success: boolean;
    data?: ScraperProfileData["data"];
    error?: string;
}

function generateRandomUsername(): string {
    const patterns = [
        () =>
            uniqueUsernameGenerator({
                dictionaries: [adjectives, nouns],
                separator: "",
                style: "lowerCase",
            }),

        () =>
            uniqueUsernameGenerator({
                dictionaries: [adjectives, nouns],
                separator: "_",
                style: "lowerCase",
            }),

        () =>
            uniqueUsernameGenerator({
                dictionaries: [adjectives, nouns],
                separator: "",
                randomDigits: 2,
                style: "lowerCase",
            }),

        () =>
            uniqueUsernameGenerator({
                dictionaries: [adjectives, nouns],
                separator: "_",
                randomDigits: 1,
                style: "lowerCase",
            }),

        () => generateUsername("", 3),

        () => generateUsername("-", 2),
    ];

    const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
    return selectedPattern();
}

function getRandomUsername(): string {
    return generateRandomUsername();
}

function getRandomUsernames(count: number): string[] {
    const usernames = new Set<string>();

    while (usernames.size < count) {
        usernames.add(getRandomUsername());
    }

    return Array.from(usernames);
}

async function scrapeUsername(username: string): Promise<ScrapeResult> {
    try {
        console.log(`🔍 Scraping profile for: ${username}`);

        const response = await fetch(`https://scraper.waffle.food/profile/${username}/optimized`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "User-Agent": "Waffle-Scraper-Bot/1.0",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const scraperData: ScraperProfileData = await response.json();

        if (!scraperData.success) {
            throw new Error("Scraper returned unsuccessful response");
        }

        console.log(`✅ Successfully scraped: ${username}`);
        return {
            username,
            success: true,
            data: scraperData.data,
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`❌ Failed to scrape ${username}:`, errorMessage);

        return {
            username,
            success: false,
            error: errorMessage,
        };
    }
}

async function scrapeMultipleUsernames(usernames: string[]): Promise<ScrapeResult[]> {
    const results: ScrapeResult[] = [];

    console.log(`🚀 Starting batch scrape of ${usernames.length} usernames...`);

    for (let i = 0; i < usernames.length; i++) {
        const username = usernames[i];
        const result = await scrapeUsername(username);
        results.push(result);
    }

    const successCount = results.filter((r) => r.success).length;
    console.log(`📊 Batch complete: ${successCount}/${usernames.length} successful`);

    return results;
}

async function scrapeRandomUsernames(count: number = 5): Promise<ScrapeResult[]> {
    const randomUsernames = getRandomUsernames(count);
    console.log(`🎲 Selected random usernames:`, randomUsernames);

    return scrapeMultipleUsernames(randomUsernames);
}

async function scrapeAndLog(count: number = 5): Promise<void> {
    console.log(`\n🤖 Waffle Username Scraper Bot`);
    console.log(`📅 ${new Date().toISOString()}`);
    console.log(`🎯 Target: ${count} random usernames\n`);

    const results = await scrapeRandomUsernames(count);

    console.log(`\n📋 SCRAPING RESULTS:`);
    console.log(`${"=".repeat(50)}`);

    results.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.username}`);
        if (result.success && result.data) {
            console.log(`   ✅ Success`);
            console.log(`   📝 Name: ${result.data.fullName || "Not available"}`);
            const bio = result.data.bio || "No bio available";
            console.log(`   📊 Bio: ${bio.slice(0, 100)}${bio.length > 100 ? "..." : ""}`);
            console.log(`   🔗 URL: ${result.data.url}`);
        } else {
            console.log(`   ❌ Failed: ${result.error}`);
        }
    });

    const successCount = results.filter((r) => r.success).length;
    console.log(`\n🏁 SUMMARY:`);
    console.log(`   Total: ${results.length}`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${results.length - successCount}`);
    console.log(`   Success Rate: ${((successCount / results.length) * 100).toFixed(1)}%`);
    console.log(`\n${"=".repeat(50)}\n`);
}

async function scrapeForever(): Promise<void> {
    console.log(`\n🔄 Waffle Username Scraper - FOREVER MODE`);
    console.log(`📅 Started: ${new Date().toISOString()}`);
    console.log(`🚨 This will run continuously until manually stopped (Ctrl+C)`);
    console.log(`🎲 Using dynamic username generation for infinite variety\n`);

    let totalScraped = 0;
    let totalSuccessful = 0;
    let batchCount = 0;

    while (true) {
        try {
            batchCount++;
            const batchSize = Math.floor(Math.random() * 5) + 3;

            console.log(`\n🔁 BATCH #${batchCount} - ${new Date().toISOString()}`);
            console.log(`📦 Batch size: ${batchSize} usernames`);

            const results = await scrapeRandomUsernames(batchSize);
            const successCount = results.filter((r) => r.success).length;

            totalScraped += results.length;
            totalSuccessful += successCount;

            console.log(`📊 Batch #${batchCount} complete:`);
            console.log(`   ✅ Success: ${successCount}/${batchSize}`);
            console.log(`   📈 Total scraped: ${totalScraped}`);
            console.log(`   🏆 Total successful: ${totalSuccessful}`);
            console.log(
                `   📊 Overall success rate: ${((totalSuccessful / totalScraped) * 100).toFixed(1)}%`
            );

            const pauseMs = Math.floor(Math.random() * 2000) + 1000;
            console.log(`   ⏸️  Pausing ${pauseMs}ms before next batch...\n`);
            await new Promise((resolve) => setTimeout(resolve, pauseMs));
        } catch (error) {
            console.error(`💥 Error in batch #${batchCount}:`, error);
            console.log(`🔄 Continuing to next batch...\n`);

            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (
        args.length > 0 &&
        (args[0] === "forever" || args[0] === "continuous" || args[0] === "24/7")
    ) {
        console.log("🚀 Starting Forever Mode...");
        await scrapeForever();
        return;
    }

    const count = args.length > 0 ? parseInt(args[0]) || 15 : 15;

    if (count < 1 || count > 100) {
        console.error("❌ Count must be between 1 and 100");
        process.exit(1);
    }

    console.log(`🚀 Starting Single Batch Mode...`);
    await scrapeAndLog(count);
}

process.on("SIGINT", () => {
    console.log("\n\n⏹️  Scraping stopped by user (Ctrl+C)");
    console.log("👋 Goodbye!");
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("\n\n⏹️  Scraping terminated");
    process.exit(0);
});

main().catch((error) => {
    console.error("\n💥 Unexpected error:", error);
    process.exit(1);
});
