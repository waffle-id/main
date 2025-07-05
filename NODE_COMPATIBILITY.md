# Node.js Compatibility Fix for Waffle Documentation

## Issue
GitBook CLI has compatibility issues with Node.js v17+ due to changes in the `fs` module. This causes the error:

```
TypeError: cb.apply is not a function
at /Users/.../graceful-fs/polyfills.js:287:18
```

## Solutions

### Option 1: Use Alternative Documentation (Recommended)

We've set up **Docsify** as a modern alternative that works with all Node.js versions:

```bash
# Install dependencies
npm install

# Start documentation server
npm run serve-alt

# Build for deployment
npm run build-alt
```

**Features:**
- ✅ Works with Node.js v22+
- ✅ Modern, responsive UI
- ✅ Search functionality
- ✅ Mermaid diagram support
- ✅ Syntax highlighting
- ✅ Easy deployment

### Option 2: Use Node.js v16 for GitBook

If you prefer GitBook, use Node.js v16:

```bash
# Using nvm (recommended)
nvm install 16
nvm use 16

# Run original setup
./setup.sh

# Start GitBook server
npm run serve
```

### Option 3: Fix GitBook with Node.js Patch

For advanced users, you can patch the issue:

```bash
# Install dependencies first
npm install --legacy-peer-deps

# Create a patch file
cat > graceful-fs-patch.js << 'EOF'
const fs = require('fs');
const gracefulFs = require('graceful-fs');

// Patch the problematic function
const originalFs = gracefulFs.prototype || {};
if (originalFs.realpath && originalFs.realpath.native) {
  delete originalFs.realpath.native;
}
EOF

# Apply the patch before running gitbook
node graceful-fs-patch.js && gitbook serve
```

## Recommended Workflow

1. **Development**: Use `npm run serve-alt` with Docsify (works with any Node.js version)
2. **Production**: Deploy using `npm run build-alt` or use GitBook.com hosting
3. **CI/CD**: Use Node.js v16 in your CI pipeline if you need GitBook

## Commands Summary

```bash
# Modern approach (any Node.js version)
npm run serve-alt     # Start Docsify server
npm run build-alt     # Build static site
npm run deploy-alt    # Deploy to GitHub Pages

# Traditional GitBook (Node.js v16 only)
npm run serve         # Start GitBook server
npm run build         # Build GitBook
npm run deploy        # Deploy GitBook to GitHub Pages

# Common commands
npm run lint          # Check markdown formatting
npm run clean         # Clean build artifacts
```

## What We've Set Up

- **index.html**: Docsify configuration with modern UI
- **_coverpage.md**: Beautiful landing page
- **_sidebar.md**: Navigation structure
- **scripts/build-docs.js**: Custom build script
- **package.json**: Updated with modern alternatives

The documentation content remains the same - only the rendering engine changes!
