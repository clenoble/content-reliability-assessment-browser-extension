// Ensure the side panel opens on a single click of the action icon
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

// Listen for extraction requests from the sidepanel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ra_request_extraction') {
        console.log('[bg] Received extraction request from sidepanel');
        handleExtraction();
        sendResponse({ ok: true });
    }
    return true; // Keep channel open for async response
});

async function handleExtraction() {
    try {
        // Get the active tab in the current window
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

        if (!tabs || !tabs[0]) {
            console.error('[bg] No active tab found');
            chrome.storage.local.set({
                ra_extractionError: 'No active tab found. Please make sure you have a webpage open.',
                ra_timestamp: Date.now()
            });
            return;
        }

        const tab = tabs[0];
        console.log('[bg] Found active tab:', tab.id, tab.url);

        // Check if this is a valid web page (http or https)
        if (!tab.url || !/^https?:\/\//i.test(tab.url)) {
            console.warn('[bg] Not a valid http(s) page:', tab.url);
            chrome.storage.local.set({
                ra_extractionError: 'Cannot extract text from this page. Please navigate to a regular webpage (http:// or https://).',
                ra_timestamp: Date.now()
            });
            return;
        }

        // Extract text from the page (permission should already be granted by sidepanel)
        try {
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => document.body.textContent,
            });

            if (!results || !results[0] || !results[0].result) {
                throw new Error('Could not extract text from the page.');
            }

            const extractedText = results[0].result.replace(/\s+/g, ' ').trim();
            console.log('[bg] Successfully extracted text, length:', extractedText.length);

            // Store in local storage for sidepanel to read
            await chrome.storage.local.set({
                ra_extractedText: extractedText,
                ra_tabInfo: { id: tab.id, url: tab.url, title: tab.title },
                ra_timestamp: Date.now()
            });
            console.log('[bg] Stored extracted text in local storage');

            // Also try to send a message
            try {
                chrome.runtime.sendMessage({
                    type: 'ra_text_extracted',
                    text: extractedText,
                    tabInfo: { id: tab.id, url: tab.url, title: tab.title }
                }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.log('[bg] Message not received:', chrome.runtime.lastError.message);
                    } else {
                        console.log('[bg] Message delivered to sidepanel');
                    }
                });
            } catch (e) {
                console.warn('[bg] Could not send message to sidepanel', e);
            }

        } catch (scriptError) {
            console.error('[bg] Script injection failed:', scriptError);
            chrome.storage.local.set({
                ra_extractionError: `Failed to extract text: ${scriptError.message}`,
                ra_timestamp: Date.now()
            });
        }

    } catch (err) {
        console.error('[bg] Extraction handling failed', err);
        chrome.storage.local.set({
            ra_extractionError: `Unexpected error: ${err.message}`,
            ra_timestamp: Date.now()
        });
    }
}