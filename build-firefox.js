#!/usr/bin/env node
/**
 * Build script for Firefox
 * Copies Firefox-specific manifest and builds the extension
 */

import { copyFileSync, rmSync, mkdirSync, existsSync, cpSync } from 'fs';
import { execSync } from 'child_process';

console.log('🦊 Building for Firefox...\n');

// Clean dist directory
if (existsSync('dist')) {
  rmSync('dist', { recursive: true });
}

// Copy Firefox manifest to public/
console.log('📝 Using Firefox manifest...');
copyFileSync('public/manifest.firefox.json', 'public/manifest.json');

// Run Vite build
console.log('🏗️  Running Vite build...');
execSync('vite build', { stdio: 'inherit' });

// Run post-build
console.log('🔧 Running post-build...');
execSync('node post-build.js', { stdio: 'inherit' });

// Create dist-firefox directory
console.log('📦 Creating dist-firefox package...');
try {
  if (existsSync('dist-firefox')) {
    rmSync('dist-firefox', { recursive: true, force: true });
  }
  cpSync('dist', 'dist-firefox', { recursive: true, force: true });
} catch (e) {
  console.warn('⚠️  Could not update dist-firefox/ (may be locked by browser).');
  console.warn('   Close Firefox and rebuild, or load the extension from dist/ instead.');
  process.exit(1);
}

console.log('\n✅ Firefox build complete in dist-firefox/\n');
