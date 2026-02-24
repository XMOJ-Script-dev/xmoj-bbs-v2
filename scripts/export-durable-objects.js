#!/usr/bin/env node

/**
 * Export Durable Objects from compiled output.
 * This makes NotificationManager available to Wrangler.
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../.output/server/index.mjs');
const sourceFile = path.join(__dirname, '../server/durable-objects.ts');

if (!fs.existsSync(indexPath)) {
  console.error('❌ index.mjs not found');
  process.exit(1);
}

// Read source TypeScript
const source = fs.readFileSync(sourceFile, 'utf8');

// Check if already exported
const currentIndex = fs.readFileSync(indexPath, 'utf8');
if (currentIndex.includes('export{NotificationManager')) {
  console.log('✅ NotificationManager already exported');
  process.exit(0);
}

// Extract and convert NotificationManager class to JavaScript
let jsCode = source
  // Remove copyright header
  .replace(/\/\*[\s\S]*?\*\/\s*/g, '')
  // Remove interfaces
  .replace(/interface\s+\w+[\s\S]*?}[\s\n]*/g, '')
  // Remove export keyword
  .replace(/export\s+class\s+/g, 'class ')
  // Remove TypeScript access modifiers  
  .replace(/\b(private|public|protected|readonly)\s+/g, '')
  // Remove all type annotations (: followed by type)
  // Match : and everything until we hit = or { or ; or \n or ) or }
  .replace(/:\s*[\w<>|&\[\],\s'"]+(?=\s*[=;{\n)}])/g, '')
  .replace(/:\s*[\w<>|&\[\],\s'"]+$(?=\n)/gm, '')
  // Remove generic type parameters
  .replace(/<[^>]*>/g, '')
  // Remove as casts
  .replace(/\s+as\s+[\w<>]+/g, '')
  // Remove line comments
  .replace(/\/\/.*$/gm, '')
  .trim();

// Append to index.mjs
const append = '\n' + jsCode + '\nexport{NotificationManager};';
fs.appendFileSync(indexPath, append, 'utf8');

console.log('✅ Exported NotificationManager to index.mjs');
