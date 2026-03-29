#!/usr/bin/env node

/**
 * Post-build script to add NotificationManager export to index.mjs
 * Appends the class definition and export statement
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../.output/server/index.mjs');
const doSourcePath = path.join(__dirname, '../server/durable-objects.ts');

if (!fs.existsSync(indexPath)) {
  console.error('✗ index.mjs not found at', indexPath);
  process.exit(1);
}

// Read existing index.mjs
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Check if already done
if (indexContent.includes('export{NotificationManager')) {
  console.log('✓ NotificationManager export already present');
  process.exit(0);
}

// Read source Durable Objects file
let doSource = fs.readFileSync(doSourcePath, 'utf8');

// Convert TypeScript to JavaScript
const jsSource = doSource
  // Remove the entire copyright header block
  .replace(/\/\*[\s\S]*?\*\/\s*\n*/g, '')
  // Remove interface definitions
  .replace(/interface\s+\w+\s*{[\s\S]*?}\n/g, '')
  // Remove access modifiers (private, public, protected)
  .replace(/\b(private|public|protected)\s+/g, '')
  // Remove TypeScript type annotations on variables
  .replace(/:\s*DurableObjectState\b/g, '')
  .replace(/:\s*any\b/g, '')
  .replace(/:\s*string\b/g, '')
  .replace(/:\s*number\b/g, '')
  .replace(/:\s*boolean\b/g, '')
  .replace(/:\s*Record<[^>]*>\b/g, '')
  .replace(/:\s*Notification\b/g, '')
  .replace(/:\s*Map<[^>]*>\b/g, '')
  .replace(/:\s*Promise<[^>]*>\b/g, '')
  // Remove return type annotations on methods
  .replace(/\):\s*Promise<Response>/g, ')')
  .replace(/\):\s*Promise<void>/g, ')')
  .replace(/\):\s*void/g, ')')
  .replace(/\):\s*Response/g, ')')
  .replace(/\):\s*Notification\[\]/g, ')')
  // Remove type casts with 'as'
  .replace(/\s+as\s+[A-Za-z<>,\s]*/g, '')
  // Remove generic type parameters but keep the identifiers
  .replace(/<[^>]*>/g, '')
  // Clean up extra whitespace
  .replace(/\s+/g, ' ')
  .trim();

// Append the converted source and the export
const output = indexContent + '\n' + jsSource + '\nexport{NotificationManager};';

fs.writeFileSync(indexPath, output, 'utf8');
console.log('✓ Added NotificationManager to index.mjs');
