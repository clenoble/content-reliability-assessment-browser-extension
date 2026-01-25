# Testing Checklist for CRABE v2.0

## 📋 Pre-Testing Setup

### Required Items
- [ ] Gemini API key (get from https://aistudio.google.com/app/apikey)
- [ ] Chrome/Edge browser (version 114+)
- [ ] Firefox browser (version 109+)
- [ ] Test webpage with text content (e.g., news article, blog post)

### Build Status
- [ ] `dist-chrome/` directory exists
- [ ] `dist-firefox/` directory exists
- [ ] Both builds have `manifest.json`, `background.js`, `options.html`, icons

---

## 🔷 Chrome/Edge Testing

### Installation (Chrome)
1. [ ] Open `chrome://extensions/`
2. [ ] Enable "Developer mode" (top right toggle)
3. [ ] Click "Load unpacked"
4. [ ] Select the `dist-chrome/` folder
5. [ ] Extension appears in toolbar with icon
6. [ ] No console errors in extension details

### Installation (Edge)
1. [ ] Open `edge://extensions/`
2. [ ] Enable "Developer mode" (left sidebar toggle)
3. [ ] Click "Load unpacked"
4. [ ] Select the `dist-chrome/` folder
5. [ ] Extension appears in toolbar with icon
6. [ ] No console errors in extension details

### UI Test: Side Panel
1. [ ] Click extension icon in toolbar
2. [ ] Side panel opens on the right side of browser
3. [ ] Panel shows "Reliability Assessment" title
4. [ ] "Analyze Page Text" button is visible
5. [ ] "Configure Settings" link is visible
6. [ ] Panel has proper styling (fonts, colors, spacing)

### Settings Test
1. [ ] Click "Configure Settings"
2. [ ] Options page opens in new tab
3. [ ] "AI Model" dropdown shows: Gemini, Mistral
4. [ ] Select "Gemini"
5. [ ] Gemini API Key field appears
6. [ ] Mistral info box is hidden
7. [ ] Select "Mistral"
8. [ ] Gemini API Key field is hidden
9. [ ] Mistral info box appears
10. [ ] Select "Gemini" again
11. [ ] Enter your API key
12. [ ] Click "Save Settings"
13. [ ] "Settings Saved!" message appears briefly
14. [ ] Refresh extension and verify key persists

### Core Functionality Test
**Navigate to a test page (e.g., https://example.com or a news article)**

1. [ ] Click extension icon to open side panel
2. [ ] Click "Analyze Page Text"
3. [ ] Permission dialog appears
4. [ ] Click "Allow" on permission prompt
5. [ ] Status shows "Fetching page text..."
6. [ ] Status changes to "Analyzing text..."
7. [ ] Analysis completes within 10-30 seconds
8. [ ] Results appear with:
   - [ ] Content Type (Factual/Opinion/Fiction)
   - [ ] Reliability score (X.X/5)
   - [ ] "Review full assessment" link
9. [ ] Click "Review full assessment"
10. [ ] Detailed assessment list appears
11. [ ] Each item shows: indicator name, score, analysis text
12. [ ] Click "Hide full assessment"
13. [ ] Assessment list collapses

### Security Tests (Phase 1)
1. [ ] Open browser DevTools (F12)
2. [ ] Go to Network tab
3. [ ] Click "Analyze Page Text"
4. [ ] Find the Gemini API request
5. [ ] **CRITICAL**: Check request headers - API key should be in `x-goog-api-key` header, NOT in URL
6. [ ] Verify no API key visible in URL parameters
7. [ ] Go to Console tab
8. [ ] Verify no excessive console.log statements (should see `[CRABE][context]` format only)
9. [ ] Inspect results HTML
10. [ ] Verify assessment text is in textContent, not innerHTML

### Error Handling Tests
1. [ ] Navigate to `chrome://extensions/`
2. [ ] Click "Analyze Page Text"
3. [ ] Should show error: "Not a valid http(s) page"
4. [ ] Navigate to valid page with very long text (e.g., Wikipedia article)
5. [ ] Analyze page
6. [ ] If text > 50,000 chars, should see: "Text truncated to 50000 characters"
7. [ ] Navigate to valid page
8. [ ] Turn off internet connection
9. [ ] Click "Analyze Page Text"
10. [ ] Should show timeout error after 30 seconds

---

## 🦊 Firefox Testing

### Installation
1. [ ] Open `about:debugging#/runtime/this-firefox`
2. [ ] Click "Load Temporary Add-on..."
3. [ ] Navigate to `dist-firefox/` folder
4. [ ] Select `manifest.json`
5. [ ] Extension appears in list with icon
6. [ ] No errors shown in debugging console

### UI Test: Popup
1. [ ] Click extension icon in toolbar
2. [ ] Popup window opens (400x600px)
3. [ ] Popup shows "Reliability Assessment" title
4. [ ] "Analyze Page Text" button is visible
5. [ ] "Configure Settings" link is visible
6. [ ] Popup has proper styling (smaller text, compact layout)
7. [ ] Popup has scrollbar if content is tall

### Settings Test (Same as Chrome)
1. [ ] Click "Configure Settings"
2. [ ] Options page opens in new tab
3. [ ] Follow same steps as Chrome Settings Test above
4. [ ] All functionality should work identically

### Core Functionality Test (Same as Chrome)
**Navigate to a test page (e.g., https://example.com or a news article)**

1. [ ] Click extension icon to open popup
2. [ ] Click "Analyze Page Text"
3. [ ] Permission dialog appears
4. [ ] Click "Allow" on permission prompt
5. [ ] Status shows "Fetching page text..."
6. [ ] Status changes to "Analyzing text..."
7. [ ] Analysis completes within 10-30 seconds
8. [ ] Results appear with same structure as Chrome
9. [ ] Test "Review full assessment" link
10. [ ] Verify all interactive elements work

### Security Tests (Same as Chrome)
Follow same security test steps as Chrome above.

### Error Handling Tests (Same as Chrome)
Follow same error handling test steps as Chrome above.

---

## 🔄 Cross-Browser Compatibility Tests

### API Compatibility
1. [ ] Chrome: `browser.storage.sync` works
2. [ ] Firefox: `browser.storage.sync` works
3. [ ] Chrome: `browser.tabs.query` works
4. [ ] Firefox: `browser.tabs.query` works
5. [ ] Chrome: `browser.runtime.sendMessage` works
6. [ ] Firefox: `browser.runtime.sendMessage` works
7. [ ] Chrome: `browser.permissions.request` works
8. [ ] Firefox: `browser.permissions.request` works

### UI Consistency
1. [ ] Chrome/Edge shows side panel (full height)
2. [ ] Firefox shows popup (400x600px)
3. [ ] Both have identical content/functionality
4. [ ] Both have same color scheme
5. [ ] Both have same font styling
6. [ ] Settings page looks identical in both

### Data Persistence
1. [ ] Save API key in Chrome, reload extension → key persists
2. [ ] Save API key in Firefox, reload extension → key persists
3. [ ] Save model selection, reload → selection persists
4. [ ] Clear storage, verify settings reset

---

## 📊 Performance Tests

### Speed
1. [ ] Extension loads in < 1 second
2. [ ] Settings page loads in < 1 second
3. [ ] Text extraction completes in < 2 seconds
4. [ ] Analysis completes in 10-30 seconds (depends on API)

### Memory
1. [ ] Open Chrome Task Manager (`Shift+Esc`)
2. [ ] Find extension process
3. [ ] Memory usage should be < 50 MB
4. [ ] Repeat in Firefox (`about:performance`)

### Multiple Tabs
1. [ ] Open multiple tabs with different pages
2. [ ] Analyze text in tab 1
3. [ ] Switch to tab 2, analyze text
4. [ ] Switch back to tab 1
5. [ ] Results from tab 1 should still be visible
6. [ ] Verify no cross-tab data leakage

---

## 🐛 Known Issues to Verify

### Expected Behaviors
1. [ ] Firefox: No side panel (uses popup instead) ✅ Expected
2. [ ] Chrome: Side panel API detected and used ✅ Expected
3. [ ] Firefox: Background uses scripts array ✅ Expected
4. [ ] Chrome: Background uses service worker ✅ Expected

### Should NOT Occur
1. [ ] ❌ API key visible in network tab URL
2. [ ] ❌ XSS injection from analysis results
3. [ ] ❌ Excessive console logging
4. [ ] ❌ Race conditions in message handling
5. [ ] ❌ Infinite hangs without timeout
6. [ ] ❌ Type errors in browser console

---

## 📝 Bug Reporting Template

If you find issues, please note:

```
**Browser**: Chrome / Edge / Firefox (version)
**Issue**: [Description]
**Steps to Reproduce**:
1.
2.
3.

**Expected**: [What should happen]
**Actual**: [What actually happened]
**Console Errors**: [Any errors in DevTools console]
**Screenshots**: [If applicable]
```

---

## ✅ Testing Complete

Once all checkboxes are marked:
- [ ] Chrome testing complete (all tests passed)
- [ ] Edge testing complete (all tests passed)
- [ ] Firefox testing complete (all tests passed)
- [ ] Security tests verified (Phase 1 fixes working)
- [ ] Browser compatibility confirmed (Phase 2 working)
- [ ] No critical bugs found

**Status**: Ready for Phase 3 ✨

---

## 🎯 Critical Test Priority

If time is limited, focus on these tests first:

### Must Test (Critical)
1. ✅ Extension loads without errors
2. ✅ Settings save API key
3. ✅ Analyze button works
4. ✅ Results display correctly
5. ✅ API key NOT in URL (security fix)

### Should Test (Important)
6. Text truncation (50k limit)
7. Timeout handling (30s)
8. Error messages
9. Cross-browser consistency

### Nice to Test (Optional)
10. Memory usage
11. Multiple tabs
12. Edge browser specifically
