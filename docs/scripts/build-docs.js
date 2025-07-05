#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("📚 Building Waffle Documentation...");

// Create dist directory
const distDir = path.join(__dirname, "..", "dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy all markdown files and index.html
const docsDir = path.join(__dirname, "..");
const copyFiles = (srcDir, destDir) => {
  const items = fs.readdirSync(srcDir);

  items.forEach((item) => {
    const srcPath = path.join(srcDir, item);
    const destPath = path.join(destDir, item);

    if (
      fs.statSync(srcPath).isDirectory() &&
      !["node_modules", "dist", ".git", "scripts"].includes(item)
    ) {
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      copyFiles(srcPath, destPath);
    } else if (item.endsWith(".md") || item === "index.html" || item.startsWith("_")) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied ${item}`);
    }
  });
};

copyFiles(docsDir, distDir);

// Create a simple server HTML for deployment
const serverHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=./index.html">
  <title>Waffle Documentation</title>
</head>
<body>
  <p>Redirecting to <a href="./index.html">documentation</a>...</p>
</body>
</html>
`;

fs.writeFileSync(path.join(distDir, "404.html"), serverHtml);

console.log("🎉 Documentation build complete!");
console.log(`📁 Output directory: ${distDir}`);
console.log("");
console.log("🚀 Deployment Options:");
console.log("  1. GitHub Pages:    npm run deploy-alt");
console.log("  2. Netlify:         Drag & drop dist/ folder to netlify.com");
console.log("  3. Vercel:          vercel --prod dist/");
console.log("  4. Local preview:   npm run preview");
console.log("");
console.log("💡 The dist/ folder contains all files needed for deployment");
