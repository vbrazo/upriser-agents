const fs = require("fs");
const path = require("path");

// Read the source file
const srcPath = path.join(__dirname, "../src/upriser-widget.js");
const rawPath = path.join(__dirname, "../upriser-widget.js");

// Copy the source file to root for raw usage (CDN, direct inclusion)
fs.copyFileSync(srcPath, rawPath);

console.log(
  "✅ Raw JavaScript build completed: upriser-widget.js (for CDN/direct usage)",
);
