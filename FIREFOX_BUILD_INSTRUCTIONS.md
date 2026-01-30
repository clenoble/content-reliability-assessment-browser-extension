# Firefox Extension Build Instructions

This document provides step-by-step instructions for Mozilla reviewers to build the Text Reliability Assessment extension from source code.

## Build Environment

**Default Mozilla Review Environment:**
- OS: Ubuntu 24.04 LTS
- Node.js: 22 LTS
- npm: 10

**Also Compatible With:**
- Windows 10/11
- macOS
- Any OS with Node.js 18+ and npm 9+

## Prerequisites

1. **Node.js 18 or higher** (Node.js 22 LTS recommended)
   - Download: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm 9 or higher** (npm 10 recommended, bundled with Node.js)
   - Verify installation: `npm --version`

## Build Process

### Step 1: Install Dependencies

```bash
npm install
```

This will install all dependencies listed in `package.json` using the exact versions specified in `package-lock.json`.

**Expected output:** Dependencies installed in `node_modules/` directory.

### Step 2: Build for Firefox

```bash
npm run build:firefox
```

This command performs the following steps automatically:
1. Cleans the `dist/` directory
2. Copies `public/manifest.firefox.json` to `public/manifest.json` (temporary)
3. Runs Vite build to compile TypeScript and bundle files
4. Runs post-build script to fix HTML paths
5. Creates `dist-firefox/` directory
6. Copies the complete build to `dist-firefox/`

**Expected output:**
- Build artifacts in `dist-firefox/` directory
- Console output showing successful build completion

### Step 3: Verify Build Output

```bash
ls dist-firefox/
```

**Expected files in `dist-firefox/`:**
```
manifest.json           # Firefox manifest (from manifest.firefox.json)
background.js           # Compiled service worker
sidepanel.js           # Main UI logic (also used for popup)
options.js             # Settings page logic
popup.html             # Extension popup UI
options.html           # Settings page
sidepanel.html         # Side panel UI
styles.css             # Main styles
popup-styles.css       # Popup-specific styles
icon48.png             # Extension icon (48x48)
icon128.png            # Extension icon (128x128)
```

## Build Tools Used

1. **Vite 6.x** - Build tool and bundler
   - Compiles TypeScript to JavaScript
   - Bundles multiple source files
   - Minifies code for production
   - Source: https://vitejs.dev/

2. **TypeScript 5.x** - Type-safe JavaScript
   - Compiles `.ts` files to `.js`
   - Source: https://www.typescriptlang.org/

3. **webextension-polyfill** - Cross-browser API wrapper
   - Provides unified browser extension API
   - Source: https://github.com/mozilla/webextension-polyfill

## Source Code Structure

```
src/                          # TypeScript source files
├── background.ts             # Service worker
├── sidepanel.ts             # Main UI logic
├── options.ts               # Settings page
├── constants.ts             # Configuration constants
├── prompts.ts               # LLM prompts
├── types/
│   └── index.ts             # TypeScript type definitions
└── utils/
    └── logger.ts            # Logging utility

public/                      # Static assets
├── manifest.firefox.json    # Firefox-specific manifest (SOURCE)
├── manifest.chrome.json     # Chrome-specific manifest
├── manifest.json            # Base manifest (replaced during build)
├── popup.html               # Popup UI
├── sidepanel.html          # Side panel UI
├── options.html            # Settings page
├── styles.css              # Main styles
├── popup-styles.css        # Popup-specific styles
├── icon48.png              # Icons
└── icon128.png

build-firefox.js             # Firefox build script
post-build.js               # Post-build HTML path fixer
vite.config.ts              # Vite configuration
tsconfig.json               # TypeScript configuration
package.json                # Dependencies and scripts
package-lock.json           # Locked dependency versions
```

## Build Configuration Files

- **vite.config.ts** - Vite build configuration (entry points, output paths)
- **tsconfig.json** - TypeScript compiler options (strict mode enabled)
- **build-firefox.js** - Firefox-specific build orchestration
- **post-build.js** - HTML path corrections after Vite build

## Verification

To verify the build matches the submitted extension:

1. Compare file checksums:
   ```bash
   sha256sum dist-firefox/background.js
   sha256sum dist-firefox/sidepanel.js
   sha256sum dist-firefox/options.js
   ```

2. Check manifest version matches:
   ```bash
   grep '"version"' dist-firefox/manifest.json
   ```
   Should show: `"version": "2.0.0"`

3. Verify Firefox-specific settings:
   ```bash
   grep -A 5 '"browser_specific_settings"' dist-firefox/manifest.json
   ```
   Should show:
   - `"id": "crabe@fastmail.com"`
   - `"strict_min_version": "128.0"`
   - `"data_collection_permissions": { "required": ["none"] }`

## Build Reproducibility

This build is designed to be reproducible. However, note:

- **Timestamps** in bundled files may vary slightly
- **Source maps** are not included in production builds
- **File order** in bundles may vary between Node.js versions

The functional code should be identical regardless of these variations.

## Troubleshooting

### Issue: `npm install` fails

**Solution:** Ensure Node.js 18+ and npm 9+ are installed:
```bash
node --version
npm --version
```

### Issue: Build fails with "command not found"

**Solution:** Ensure all dependencies are installed:
```bash
rm -rf node_modules
npm install
```

### Issue: TypeScript errors during build

**Solution:** This should not occur with locked dependencies. If it does:
```bash
npm run type-check
```
All source code passes strict TypeScript checks.

## Additional Notes

- **No external API calls during build** - Build process is fully offline after `npm install`
- **No web-based tools** - All build tools run locally
- **Open source tools only** - All build dependencies are open source (Vite, TypeScript, etc.)
- **Deterministic builds** - Using `package-lock.json` ensures consistent dependency versions

## Contact

If you have any questions about the build process:

**Developer:** Céline Lenoble
**Email:** crabe@fastmail.com
**Extension Name:** Text Reliability Assessment

## License

This extension is open source under GNU Affero General Public License v3.0 (AGPL v3).
