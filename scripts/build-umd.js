const fs = require("fs");
const path = require("path");

// Read the source file
const srcPath = path.join(__dirname, "../src/upriser-widget.js");
const distPath = path.join(__dirname, "../dist/upriser-widget.js");

// Ensure dist directory exists
if (!fs.existsSync(path.dirname(distPath))) {
  fs.mkdirSync(path.dirname(distPath), { recursive: true });
}

// Copy the source file to dist (it's already UMD compatible)
fs.copyFileSync(srcPath, distPath);

console.log("✅ UMD build completed: dist/upriser-widget.js");
