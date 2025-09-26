const fs = require("fs");
const path = require("path");

// Read the source file
const srcPath = path.join(__dirname, "../src/upriser-widget.js");
const distPath = path.join(__dirname, "../dist/upriser-widget.esm.js");

// Ensure dist directory exists
if (!fs.existsSync(path.dirname(distPath))) {
  fs.mkdirSync(path.dirname(distPath), { recursive: true });
}

// Read the source content
let content = fs.readFileSync(srcPath, "utf8");

// Create ESM version by adding export at the end
const esmContent =
  content +
  "\n\n// ES Module export\nexport default UpriserWidget;\nexport { UpriserWidget };";

// Write ESM version
fs.writeFileSync(distPath, esmContent);

console.log("✅ ESM build completed: dist/upriser-widget.esm.js");
