import { serve } from "@hono/node-server";
import app from "./routes/index";
import { CONFIG } from "./config";

const port = parseInt(process.env.PORT || "3001");

async function startServer() {
  try {
    console.log("� Starting Waffle Scraper Service...");
    console.log(`📍 Server running on http://localhost:${port}`);
    console.log(`🎯 Target engine: ${CONFIG.BACKEND_URL}`);
    console.log("� Available endpoints:");
    console.log("  GET  /health                     - Health check");
    console.log("  GET  /debug                      - Environment debug info");
    console.log("  GET  /test-chrome                - Test Chrome/Puppeteer setup");
    console.log("  GET  /profile/:username          - Scrape and register profile");
    console.log("  GET  /avatar/:username           - Get Twitter avatar only");
    console.log("  POST /profile/:username/refresh  - Force refresh and register profile");
    console.log("  GET  /profile/:username/exists   - Check if profile exists in main DB");
    console.log("  POST /profile/:username/register-only - Scrape and register (no return data)");
    console.log("  GET  /profiles                   - Deprecated (returns error)");
    console.log("");
    console.log("🔄 This scraper now posts data directly to the main engine instead of local DB");
    console.log("");
    serve({
      fetch: app.fetch,
      port: port,
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
