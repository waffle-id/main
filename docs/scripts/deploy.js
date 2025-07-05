#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🚀 Deploying Waffle Documentation to GitHub Pages...");

try {
  // Check if gh-pages is installed
  try {
    require("gh-pages");
  } catch (e) {
    console.log("📦 Installing gh-pages...");
    execSync("npm install gh-pages --save-dev", { stdio: "inherit" });
  }

  // Build first
  console.log("📚 Building documentation...");
  execSync("npm run build-alt", { stdio: "inherit" });

  // Check if dist exists
  const distDir = path.join(__dirname, "..", "dist");
  if (!fs.existsSync(distDir)) {
    throw new Error("dist/ directory not found. Build failed?");
  }

  // Deploy to GitHub Pages
  console.log("🌐 Deploying to GitHub Pages...");
  const ghPages = require("gh-pages");

  ghPages.publish(
    "dist",
    {
      branch: "gh-pages",
      message: `Deploy docs: ${new Date().toISOString()}`,
      user: {
        name: "Waffle Docs Bot",
        email: "docs@waffle.food",
      },
    },
    (err) => {
      if (err) {
        console.error("❌ Deployment failed:", err);
        process.exit(1);
      } else {
        console.log("✅ Documentation deployed successfully!");
        console.log("🌐 Your docs are now live at:");
        console.log("   https://waffle-id.github.io/main/");
        console.log("");
        console.log("💡 It may take a few minutes for GitHub Pages to update");
      }
    }
  );
} catch (error) {
  console.error("❌ Error during deployment:", error.message);
  process.exit(1);
}
