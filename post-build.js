#!/usr/bin/env node
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { join } from 'path';

// Copy processed HTML files from dist/public/ to dist/
console.log('Copying processed HTML files...');
copyFileSync('dist/public/sidepanel.html', 'dist/sidepanel.html');
copyFileSync('dist/public/options.html', 'dist/options.html');

// Copy popup.html if it exists (for Firefox)
if (existsSync('dist/public/popup.html')) {
  copyFileSync('dist/public/popup.html', 'dist/popup.html');
}

// Fix absolute paths in HTML files (change /path to ./path for Chrome extension)
function fixPaths(filePath) {
  console.log(`Fixing paths in ${filePath}...`);
  let content = readFileSync(filePath, 'utf-8');

  // Replace absolute paths with relative paths
  content = content.replace(/src="\/([^"]+)"/g, 'src="./$1"');
  content = content.replace(/href="\/([^"]+)"/g, 'href="./$1"');

  writeFileSync(filePath, content);
}

fixPaths('dist/sidepanel.html');
fixPaths('dist/options.html');

// Fix paths in popup.html if it exists (for Firefox)
if (existsSync('dist/popup.html')) {
  fixPaths('dist/popup.html');
}

console.log('Post-build complete!');
