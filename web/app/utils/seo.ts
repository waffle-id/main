/**
 * SEO Utilities for Waffle - Context7 Pattern
 * Centralized SEO management following best practices
 */

export interface SEOConfig {
    title: string;
    description: string;
    keywords?: readonly string[];
    image?: string;
    url?: string;
    type?: "website" | "article" | "profile";
    twitterCard?: "summary" | "summary_large_image";
    noIndex?: boolean;
}

export const SITE_CONFIG = {
    name: "Waffle",
    description: "Decentralized reputation and review platform building trust in the Web3 ecosystem",
    url: "https://waffle.food",
    image: "https://waffle.food/og-image.png",
    twitter: "@waffleidn",
    keywords: [
        "Web3",
        "blockchain",
        "reputation",
        "reviews",
        "decentralized",
        "trust",
        "DeFi",
        "cryptocurrency",
        "social proof",
        "on-chain identity",
    ],
} as const;

/**
 * Generate comprehensive meta tags following Context7 SEO patterns
 */
export function generateSEO({
    title,
    description,
    keywords = [],
    image = SITE_CONFIG.image,
    url,
    type = "website",
    twitterCard = "summary_large_image",
    noIndex = false,
}: SEOConfig) {
    const fullTitle = title.includes(SITE_CONFIG.name) ? title : `${title} | ${SITE_CONFIG.name}`;
    const allKeywords = [...SITE_CONFIG.keywords, ...keywords].join(", ");
    const finalUrl = url || SITE_CONFIG.url;

    const meta = [
        { title: fullTitle },
        { name: "description", content: description },
        { name: "keywords", content: allKeywords },

        { property: "og:title", content: fullTitle },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:url", content: finalUrl },
        { property: "og:type", content: type },
        { property: "og:site_name", content: SITE_CONFIG.name },

        { name: "twitter:card", content: twitterCard },
        { name: "twitter:site", content: SITE_CONFIG.twitter },
        { name: "twitter:title", content: fullTitle },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },

        { name: "author", content: SITE_CONFIG.name },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "theme-color", content: "#F59E0B" },

        { name: "web3:network", content: "ethereum" },
        { name: "web3:platform", content: "decentralized-reputation" },
    ];

    if (noIndex) {
        meta.push({ name: "robots", content: "noindex, nofollow" });
    } else {
        meta.push({ name: "robots", content: "index, follow" });
    }

    return meta;
}

/**
 * SEO configurations for different page types
 */
export const SEO_CONFIGS = {
    home: {
        title: "Waffle",
        description:
            "Build trust in Web3 with decentralized reputation and reviews. Connect your wallet, earn badges, and establish verifiable on-chain credibility.",
        keywords: ["reputation platform", "Web3 trust", "blockchain reviews", "decentralized identity"],
    },

    categories: {
        title: "Categories",
        description:
            "Explore different categories and discover top performers in various fields on Waffle. Find experts in DeFi, NFTs, development, and more.",
        keywords: ["categories", "expertise", "specializations", "Web3 experts"],
    },

    leaderboard: {
        title: "Leaderboard",
        description:
            "Discover the top performers and most trusted users in the Waffle ecosystem. See who leads in reputation and community impact.",
        keywords: ["leaderboard", "top users", "reputation ranking", "Web3 leaders"],
    },

    badges: {
        title: "Badges",
        description:
            "Earn achievement badges that showcase your accomplishments and expertise in the Web3 ecosystem. Build your reputation through verified achievements.",
        keywords: ["badges", "achievements", "credentials", "Web3 accomplishments"],
    },

    profile: {
        title: "Profile",
        description:
            "View user profiles, achievements, and activity history on Waffle. Discover reputation scores, reviews, and Web3 credentials.",
        keywords: ["user profile", "reputation score", "Web3 identity", "reviews"],
    },
} as const;

/**
 * Generate category-specific SEO for leaderboard pages
 */
export function getLeaderboardSEO(category: string) {
    const categoryTitle = category
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

    return generateSEO({
        title: `Leaderboard - ${categoryTitle}`,
        description: `Discover the top performers in ${categoryTitle} on Waffle. See who leads in reputation and community impact in this category.`,
        keywords: [category, "leaderboard", "top performers", "reputation ranking"],
        url: `${SITE_CONFIG.url}/leaderboard/${category}`,
    });
}

/**
 * Generate profile-specific SEO
 */
export function getProfileSEO(variant: "x" | "w", slug: string, userData?: any) {
    let title: string;
    let description: string;
    let keywords: string[];

    if (variant === "x") {
        title = userData?.fullName ? `${userData.fullName} (@${slug})` : `@${slug}`;
        description = userData?.bio
            ? `${userData.bio} View @${slug}'s reputation, reviews, and Web3 activity on Waffle.`
            : `View @${slug}'s reputation, reviews, and Web3 activity on Waffle. Discover their achievements and community impact.`;
        keywords = ["twitter profile", "social verification", slug];
    } else {
        const shortAddress = `${slug.slice(0, 6)}...${slug.slice(-4)}`;
        title = `${shortAddress}`;
        description = userData?.bio
            ? `${userData.bio} View ${shortAddress}'s Web3 reputation and on-chain activity on Waffle.`
            : `View ${shortAddress}'s Web3 reputation, reviews, and on-chain activity on Waffle. Explore their decentralized identity.`;
        keywords = ["wallet profile", "Web3 identity", "on-chain reputation"];
    }

    return generateSEO({
        title,
        description,
        keywords,
        type: "profile",
        url: `${SITE_CONFIG.url}/profile/${variant}/${slug}`,
        image: userData?.avatarUrl || SITE_CONFIG.image,
    });
}
