export const CONFIG = {
    BACKEND_URL: process.env.BACKEND_URL || "https://api.waffle.food",
    REGISTER_SCRAPER_ENDPOINT: "/account/register-scraper",
} as const;
