#!/usr/bin/env node
/**
 * Build script for Chrome/Edge
 * Copies Chrome-specific manifest and builds the extension
 */

import { copyFileSync, rmSync, mkdirSync, existsSync, cpSync } from 'fs';
import { execSync } from 'child_process';

console.log('🔷 Building for Chrome/Edge...\n');

// Clean dist directory
if (existsSync('dist')) {
  rmSync('dist', { recursive: true });
}

// Copy Chrome manifest to public/
console.log('📝 Using Chrome manifest...');
copyFileSync('public/manifest.chrome.json', 'public/manifest.json');

// Run Vite build
console.log('🏗️  Running Vite build...');
execSync('vite build', { stdio: 'inherit' });

// Run post-build
console.log('🔧 Running post-build...');
execSync('node post-build.js', { stdio: 'inherit' });

// Create dist-chrome directory
console.log('📦 Creating dist-chrome package...');
try {
  if (existsSync('dist-chrome')) {
    rmSync('dist-chrome', { recursive: true, force: true });
  }
  cpSync('dist', 'dist-chrome', { recursive: true, force: true });
} catch (e) {
  console.warn('⚠️  Could not update dist-chrome/ (may be locked by browser).');
  console.warn('   Close Chrome and rebuild, or load the extension from dist/ instead.');
  process.exit(1);
}

console.log('\n✅ Chrome/Edge build complete in dist-chrome/\n');
