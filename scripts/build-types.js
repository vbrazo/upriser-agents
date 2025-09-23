const fs = require('fs');
const path = require('path');

// Copy TypeScript definitions to dist
const srcPath = path.join(__dirname, '../src/upriser-widget.d.ts');
const distPath = path.join(__dirname, '../dist/upriser-widget.d.ts');

// Ensure dist directory exists
if (!fs.existsSync(path.dirname(distPath))) {
  fs.mkdirSync(path.dirname(distPath), { recursive: true });
}

// Copy the types file
fs.copyFileSync(srcPath, distPath);

console.log('✅ Types build completed: dist/upriser-widget.d.ts');
