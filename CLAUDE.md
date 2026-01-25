# CLAUDE.md - AI Assistant Guide for Content Reliability Assessment Browser Extension

## Project Overview

This is a Chrome browser extension (Manifest V3) that helps users systematically assess the reliability of online content. It uses LLMs (Google Gemini or local Mistral via Ollama) to classify web page text as **Factual**, **Opinion**, or **Fiction**, and provides a reliability score based on rigorous rubrics.

**Current Status**: Phase 1 (POC) is complete with text-only analysis. Phase 2+ will add provenance verification, multimedia forensics, and multi-agent orchestration.

## Tech Stack

- **TypeScript** (strict mode) - All source files
- **Vite** - Build system with HMR
- **Chrome Extension Manifest V3** - Side panel architecture
- **LLM Providers**: Google Gemini (cloud) or Mistral via Ollama (local)
- **License**: AGPL-3.0

## Project Structure

```
content-reliability-assessment-browser-extension/
├── src/                      # TypeScript source files
│   ├── background.ts         # Service worker - handles text extraction
│   ├── sidepanel.ts          # Main UI logic - LLM API calls, results display
│   ├── options.ts            # Settings page - model selection, API keys
│   ├── constants.ts          # All configuration constants
│   ├── prompts.ts            # LLM system prompts and response schemas
│   ├── types/
│   │   └── index.ts          # Type definitions
│   └── utils/
│       └── logger.ts         # Structured logging utility
├── public/                   # Static assets (copied to dist/)
│   ├── manifest.json         # Chrome extension manifest
│   ├── sidepanel.html        # Side panel UI
│   ├── options.html          # Settings page
│   ├── styles.css            # Custom CSS (Tailwind-like variables)
│   └── icon*.png             # Extension icons
├── docs/                     # Framework PDFs (reliability rubrics)
├── dist/                     # Build output (gitignored)
├── vite.config.ts            # Vite build configuration
├── tsconfig.json             # TypeScript configuration
├── post-build.js             # Fixes HTML paths after build
└── package.json              # Dependencies and scripts
```

## Development Commands

```bash
# Install dependencies
npm install

# Type check without emitting
npm run type-check

# Build for production
npm run build

# Development server (for debugging)
npm run dev
```

**Build output**: Load the `dist/` folder as an unpacked extension in Chrome.

## Key Architecture

### Extension Components

1. **Background Service Worker** (`src/background.ts`)
   - Opens side panel on extension icon click
   - Handles `ra_request_extraction` messages from sidepanel
   - Extracts page text via `chrome.scripting.executeScript`
   - Stores results in `chrome.storage.local`

2. **Side Panel UI** (`src/sidepanel.ts`)
   - Entry point for user interaction
   - Requests host permissions on user gesture (button click)
   - Calls LLM APIs (Gemini or Mistral)
   - Displays classification and reliability scores
   - Uses safe DOM manipulation (no innerHTML with untrusted content)

3. **Options Page** (`src/options.ts`)
   - Model selection (Gemini/Mistral)
   - API key configuration (stored in `chrome.storage.sync`)

### Message Flow

```
User clicks "Analyze" → sidepanel requests permission → sends ra_request_extraction
→ background extracts text → stores in storage + sends ra_text_extracted
→ sidepanel calls LLM API → displays results
```

### Storage Keys (from `src/constants.ts`)

- `ra_extractedText` - Extracted page text
- `ra_tabInfo` - Tab metadata
- `ra_extractionError` - Error messages
- `ra_timestamp` - Extraction timestamp
- `selectedModel` - User's model choice ('gemini' | 'mistral')
- `geminiApiKey` - User's Gemini API key

## Coding Conventions

### TypeScript

- **Strict mode enabled** - No implicit any, unused locals/parameters checked
- All types defined in `src/types/index.ts`
- Use `as const` for immutable object literals
- Prefer type imports: `import type { X } from './types'`

### Code Style

- Use the `logger` utility instead of `console.log`
- All magic strings/numbers go in `src/constants.ts`
- Error messages centralized in `ERROR_MESSAGES` constant
- Context-based logging: `logger.debug(CONTEXT, 'message', data)`

### Security Practices (from Phase 1 fixes)

- **API keys in headers**, never in URL parameters
- **Safe DOM manipulation** - Use `textContent` instead of `innerHTML` for LLM responses
- **Input validation** - Text truncated to 50k characters
- **Request timeouts** - 30-second AbortController timeout on all API calls
- **No polling** - Use message listeners only

### Chrome Extension Patterns

- All chrome API calls should be wrapped in try/catch
- Use `chrome.storage.sync` for user settings
- Use `chrome.storage.local` for temporary data
- Handle `chrome.runtime.lastError` in callbacks

## Important Files to Know

| File | Purpose |
|------|---------|
| `src/prompts.ts` | LLM system prompt with rubrics - **edit this for analysis changes** |
| `src/constants.ts` | API config, timeouts, thresholds - **edit this for config changes** |
| `src/types/index.ts` | All TypeScript interfaces |
| `public/manifest.json` | Extension permissions and entry points |
| `public/styles.css` | All styling (CSS variables, no Tailwind build) |

## LLM Integration Details

### Gemini API

- Endpoint: `https://generativelanguage.googleapis.com/v1beta`
- Model: `gemini-2.5-flash-preview-09-2025`
- Uses structured output with `responseSchema`
- API key passed via `x-goog-api-key` header

### Mistral (Ollama)

- Endpoint: `http://localhost:11434/api/chat`
- Model: `mistral`
- Requires Ollama running locally with CORS configured
- JSON output format enforced via prompt

### Response Schema (from `src/prompts.ts`)

```typescript
{
  classification: 'Factual' | 'Opinion' | 'Fiction',
  finalScore: number,  // 0-5
  rawAssessment: Array<{
    indicator: string,
    analysis: string,
    score: number
  }>
}
```

## Common Tasks

### Adding a new LLM provider

1. Add config to `API_CONFIG` in `src/constants.ts`
2. Add model type to `ModelType` in `src/types/index.ts`
3. Create `call{Provider}API()` function in `src/sidepanel.ts`
4. Update `performAnalysis()` switch statement
5. Add UI option in `public/options.html`

### Modifying the analysis rubric

Edit the `SYSTEM_PROMPT` in `src/prompts.ts`. The rubric has three sections:
- **Factual**: Evidentiary Integrity, Logical Coherence, Rhetorical Style
- **Opinion**: Transparency of Position, Support for Opinion, Intellectual Honesty
- **Fiction**: Explicit Labeling, Content & Stylistic Cues

### Adding new permissions

1. Add to `permissions` or `host_permissions` in `public/manifest.json`
2. For optional permissions, use `chrome.permissions.request()` with user gesture

### Debugging

- Logger output prefixed with `[CRABE]` (Content Reliability Assessment Browser Extension)
- Open Chrome DevTools on the extension's side panel or service worker
- Check `chrome.storage.local` for extraction state

## Testing the Extension

1. Run `npm run build`
2. Go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `dist/` folder
5. Navigate to any webpage and click the extension icon
6. Configure API key in Settings if using Gemini

## Roadmap Reference

- **Phase 2** (Current Focus): Provenance & Lateral Reading (SIFT method automation)
- **Phase 3**: Multimedia Forensics (EXIF, deepfake detection, C2PA)
- **Phase 4**: Multi-agent orchestration

## Files NOT to Modify

- `docs/*.pdf` - Reference framework documents
- `.git/` - Git internals
- `node_modules/` - Dependencies (gitignored)
- `dist/` - Build output (gitignored)
