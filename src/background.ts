/**
 * Background service worker for the extension
 * Handles sidepanel setup and text extraction from web pages
 */

import browser from 'webextension-polyfill';
import type { TabInfo } from './types';
import { STORAGE_KEYS, ERROR_MESSAGES } from './constants';
import { logger } from './utils/logger';

const CONTEXT = 'background';

// Ensure the side panel opens on a single click of the action icon (Chrome/Edge only)
// Firefox doesn't support sidePanel API, so we check if it exists
// Note: sidePanel API is not in webextension-polyfill types yet, so we use any
if ((browser as any).sidePanel) {
  (browser as any).sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error: Error) => logger.error(CONTEXT, 'Failed to set panel behavior', error));
}

// Listen for extraction requests from the sidepanel
// webextension-polyfill uses Promise-based listeners
browser.runtime.onMessage.addListener(
  (message: any, _sender: browser.Runtime.MessageSender) => {
    if (message.type === 'ra_request_extraction') {
      logger.debug(CONTEXT, 'Received extraction request from sidepanel');
      handleExtraction();
      return Promise.resolve({ ok: true });
    }
    return Promise.resolve({ ok: false });
  }
);

async function handleExtraction(): Promise<void> {
  try {
    // Get the active tab in the current window
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });

    if (!tabs || !tabs[0]) {
      logger.error(CONTEXT, 'No active tab found');
      await browser.storage.local.set({
        [STORAGE_KEYS.EXTRACTION_ERROR]: ERROR_MESSAGES.NO_ACTIVE_TAB,
        [STORAGE_KEYS.TIMESTAMP]: Date.now(),
      });
      return;
    }

    const tab = tabs[0];
    logger.debug(CONTEXT, 'Found active tab', { id: tab.id, url: tab.url });

    // Check if this is a valid web page (http or https)
    if (!tab.url || !/^https?:\/\//i.test(tab.url)) {
      logger.warn(CONTEXT, 'Not a valid http(s) page', tab.url);
      await browser.storage.local.set({
        [STORAGE_KEYS.EXTRACTION_ERROR]: ERROR_MESSAGES.INVALID_URL,
        [STORAGE_KEYS.TIMESTAMP]: Date.now(),
      });
      return;
    }

    // Extract text from the page (permission should already be granted by sidepanel)
    try {
      const results = await browser.scripting.executeScript({
        target: { tabId: tab.id! },
        func: () => document.body.innerText,
      });

      if (!results || !results[0] || !results[0].result) {
        throw new Error(ERROR_MESSAGES.EXTRACTION_FAILED);
      }

      const extractedText = (results[0].result as string).replace(/\s+/g, ' ').trim();
      logger.debug(CONTEXT, 'Successfully extracted text', { length: extractedText.length });

      const tabInfo: TabInfo = {
        id: tab.id!,
        url: tab.url,
        title: tab.title || '',
      };

      // Store in local storage for sidepanel to read
      await browser.storage.local.set({
        [STORAGE_KEYS.EXTRACTED_TEXT]: extractedText,
        [STORAGE_KEYS.TAB_INFO]: tabInfo,
        [STORAGE_KEYS.TIMESTAMP]: Date.now(),
      });
      logger.debug(CONTEXT, 'Stored extracted text in local storage');

      // Also try to send a message
      try {
        await browser.runtime.sendMessage({
          type: 'ra_text_extracted',
          text: extractedText,
          tabInfo,
        });
        logger.debug(CONTEXT, 'Message delivered to sidepanel');
      } catch (e) {
        logger.warn(CONTEXT, 'Could not send message to sidepanel', e);
      }
    } catch (scriptError) {
      const error = scriptError as Error;
      logger.error(CONTEXT, 'Script injection failed', error);
      await browser.storage.local.set({
        [STORAGE_KEYS.EXTRACTION_ERROR]: `Failed to extract text: ${error.message}`,
        [STORAGE_KEYS.TIMESTAMP]: Date.now(),
      });
    }
  } catch (err) {
    const error = err as Error;
    logger.error(CONTEXT, 'Extraction handling failed', error);
    await browser.storage.local.set({
      [STORAGE_KEYS.EXTRACTION_ERROR]: `Unexpected error: ${error.message}`,
      [STORAGE_KEYS.TIMESTAMP]: Date.now(),
    });
  }
}
