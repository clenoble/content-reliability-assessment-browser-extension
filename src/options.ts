/**
 * Options page for configuring LLM provider and API keys
 */

import browser from 'webextension-polyfill';
import type { ModelType } from './types';
import { STORAGE_KEYS, UI_CONFIG } from './constants';

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('settings-form') as HTMLFormElement;
  const modelSelect = document.getElementById('model-select') as HTMLSelectElement;
  const geminiConfig = document.getElementById('gemini-config') as HTMLElement;
  const mistralConfig = document.getElementById('mistral-config') as HTMLElement;
  const geminiApiKeyInput = document.getElementById('gemini-api-key') as HTMLInputElement;
  const statusMessage = document.getElementById('status-message') as HTMLElement;

  // Load saved settings
  const items = await browser.storage.sync.get([STORAGE_KEYS.SELECTED_MODEL, STORAGE_KEYS.GEMINI_API_KEY]);
  if (items[STORAGE_KEYS.SELECTED_MODEL]) {
    modelSelect.value = items[STORAGE_KEYS.SELECTED_MODEL] as string;
  }
  if (items[STORAGE_KEYS.GEMINI_API_KEY]) {
    geminiApiKeyInput.value = items[STORAGE_KEYS.GEMINI_API_KEY] as string;
  }
  toggleConfigVisibility();

  // Toggle visibility based on selection
  modelSelect.addEventListener('change', toggleConfigVisibility);

  function toggleConfigVisibility(): void {
    if (modelSelect.value === 'gemini') {
      geminiConfig.classList.remove('hidden');
      mistralConfig.classList.add('hidden');
    } else {
      geminiConfig.classList.add('hidden');
      mistralConfig.classList.remove('hidden');
    }
  }

  // Save settings
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedModel = modelSelect.value as ModelType;
    const geminiApiKey = geminiApiKeyInput.value.trim();

    await browser.storage.sync.set({
      [STORAGE_KEYS.SELECTED_MODEL]: selectedModel,
      [STORAGE_KEYS.GEMINI_API_KEY]: geminiApiKey,
    });

    // Show success message
    statusMessage.classList.remove('opacity-0');
    setTimeout(() => {
      statusMessage.classList.add('opacity-0');
    }, UI_CONFIG.STATUS_MESSAGE_DURATION_MS);
  });
});
