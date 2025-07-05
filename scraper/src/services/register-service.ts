import { CONFIG } from "../config";
import type { TwitterProfile, TwitterBioAvatar } from "../lib/scraper";

export interface RegisterResponse {
    isSuccess: boolean;
    user?: {
        id: string;
        address: string;
        username: string;
        hasInvitationAuthority: boolean;
        reputationScore: number;
    };
    error?: string;
}

export async function registerScrapedProfile(profile: TwitterProfile): Promise<RegisterResponse> {
    const url = `${CONFIG.BACKEND_URL}${CONFIG.REGISTER_SCRAPER_ENDPOINT}`;

    console.log(`🚀 Posting scraped profile to: ${url}`);
    console.log(`📊 Profile data:`, {
        username: profile.username,
        fullName: profile.fullName,
        bio: profile.bio ? profile.bio.substring(0, 100) + "..." : null,
        avatarUrl: profile.avatarUrl,
        followers: profile.followers,
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: profile.username,
                fullName: profile.fullName,
                bio: profile.bio,
                avatarUrl: profile.avatarUrl,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Failed to register profile. Status: ${response.status}`);
            console.error(`❌ Error response:`, errorText);

            return {
                isSuccess: false,
                error: `HTTP ${response.status}: ${errorText}`,
            };
        }

        const result = await response.json();
        console.log(`✅ Successfully registered profile for ${profile.username}`);
        console.log(`✅ Response:`, result);

        return result;
    } catch (error) {
        console.error(`❌ Network error while registering profile:`, error);
        return {
            isSuccess: false,
            error: error instanceof Error ? error.message : "Unknown network error",
        };
    }
}

export async function checkProfileExists(username: string): Promise<boolean> {
    const url = `${CONFIG.BACKEND_URL}/api/account/${username}`;

    console.log(`🔍 Checking if profile exists: ${url}`);

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.status === 404) {
            console.log(`📭 Profile ${username} does not exist in main DB`);
            return false;
        }

        if (response.ok) {
            console.log(`📬 Profile ${username} exists in main DB`);
            return true;
        }

        console.warn(`⚠️ Unexpected response when checking profile: ${response.status}`);
        return false;
    } catch (error) {
        console.error(`❌ Error checking if profile exists:`, error);
        return false;
    }
}

export async function registerBioAndAvatar(data: TwitterBioAvatar): Promise<RegisterResponse> {
    const url = `${CONFIG.BACKEND_URL}${CONFIG.REGISTER_SCRAPER_ENDPOINT}`;

    console.log(`🚀 Posting bio, avatar and fullName to: ${url}`);
    console.log(`📊 Bio + Avatar + FullName data:`, {
        username: data.username,
        fullName: data.fullName || data.username,
        bio: data.bio ? data.bio.substring(0, 100) + "..." : null,
        avatarUrl: data.avatarUrl,
    });

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: data.username,
                fullName: data.fullName || data.username,
                bio: data.bio,
                avatarUrl: data.avatarUrl,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Failed to register bio, avatar and fullName. Status: ${response.status}`);
            console.error(`❌ Error response:`, errorText);

            return {
                isSuccess: false,
                error: `HTTP ${response.status}: ${errorText}`,
            };
        }

        const result = await response.json();
        console.log(`✅ Successfully registered bio, avatar and fullName for ${data.username}`);
        console.log(`✅ Response:`, result);

        return result;
    } catch (error) {
        console.error(`❌ Network error while registering bio, avatar and fullName:`, error);
        return {
            isSuccess: false,
            error: error instanceof Error ? error.message : "Unknown network error",
        };
    }
}
