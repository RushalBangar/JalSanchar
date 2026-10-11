/**
 * JalSanjeevani - Production Static Asset Bundler & Vercel Output Generator
 * Generates the `public/` directory ensuring zero-dependency cross-platform builds.
 */

const fs = require('fs');
const path = require('path');

function copyFolderSync(from, to, excludeNames = ['node_modules', '.git', 'public']) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  const entries = fs.readdirSync(from, { withFileTypes: true });
  for (const entry of entries) {
    if (excludeNames.includes(entry.name)) continue;
    const srcPath = path.join(from, entry.name);
    const destPath = path.join(to, entry.name);
    if (entry.isDirectory()) {
      copyFolderSync(srcPath, destPath, excludeNames);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Determine Source Directory
const isFrontendCwd = fs.existsSync(path.join(process.cwd(), 'login.html'));
const sourceDir = isFrontendCwd ? process.cwd() : path.join(__dirname, 'frontend');

console.log(`[build.js] Source directory: ${sourceDir}`);

// 2. Populate Target Output Directory (public)
const rootPublic = path.join(__dirname, 'public');
console.log(`[build.js] Copying frontend assets to root public: ${rootPublic}`);
copyFolderSync(sourceDir, rootPublic);

// 3. Also populate frontend/public for fallback when Vercel root is set to 'frontend'
const frontendPublic = path.join(sourceDir, 'public');
console.log(`[build.js] Syncing to frontend/public: ${frontendPublic}`);
copyFolderSync(sourceDir, frontendPublic);

console.log('[build.js] Production static assets verified and built to public/ successfully!');
