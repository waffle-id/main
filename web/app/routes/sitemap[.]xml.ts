export async function loader() {
    const baseUrl = "https://waffle.food";

    const staticPages = [
        { url: "", priority: "1.0", changefreq: "daily" },
        { url: "/categories", priority: "0.9", changefreq: "weekly" },
        { url: "/badges", priority: "0.8", changefreq: "weekly" },
        { url: "/leaderboard", priority: "0.9", changefreq: "daily" },
    ];

    const categories = [
        "most-credible",
        "tech-innovator",
        "defi-expert",
        "nft-enthusiast",
        "community-builder",
        "crypto-researcher",
    ];

    const categoryPages = categories.map((category) => ({
        url: `/leaderboard/${category}`,
        priority: "0.8",
        changefreq: "daily",
    }));

    const allPages = [...staticPages, ...categoryPages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
            .map(
                (page) => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
            )
            .join("\n")}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
