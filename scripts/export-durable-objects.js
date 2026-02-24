#!/usr/bin/env node

/**
 * Export Durable Objects by compiling TypeScript to JavaScript.
 * This makes NotificationManager available to Wrangler.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const indexPath = path.join(__dirname, '../.output/server/index.mjs');
const sourceFile = path.join(__dirname, '../server/durable-objects.ts');
const tmpFile = path.join(__dirname, '../.output/server/_durable-objects-compiled.mjs');

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.mjs not found');
  process.exit(1);
}

// Check if already exported
const currentIndex = fs.readFileSync(indexPath, 'utf8');
if (currentIndex.includes('export{NotificationManager')) {
  console.log('✅ NotificationManager already exported');
  process.exit(0);
}

try {
  // Use esbuild to transpile TypeScript to JavaScript
  execSync(`npx esbuild ${sourceFile} --outfile=${tmpFile} --format=esm --target=es2020`, {
    stdio: 'pipe'
  });

  // Read the compiled code
  let compiled = fs.readFileSync(tmpFile, 'utf8');

  // Just use the compiled code as-is (esbuild handles type removal)
  // Append to index.mjs
  fs.appendFileSync(indexPath, '\n' + compiled);

  // Clean up temp file
  fs.unlinkSync(tmpFile);

  console.log('✅ Exported NotificationManager to index.mjs');
} catch (error) {
  console.error('❌ Failed to export:', error.message);
  process.exit(1);
}
