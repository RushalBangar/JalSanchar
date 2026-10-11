/**
 * JalSanjeevani - Frontend Build Script (when Vercel Root Directory is set to 'frontend')
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

const sourceDir = __dirname;
const targetPublic = path.join(__dirname, 'public');

console.log(`[frontend/build.js] Building static output into: ${targetPublic}`);
copyFolderSync(sourceDir, targetPublic);
console.log('[frontend/build.js] Production assets built to frontend/public/ successfully!');
