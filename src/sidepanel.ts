/**
 * Side panel UI for analyzing web page content
 * Handles text extraction, LLM API calls, and results display
 */

import type {
  RuntimeMessage,
  TabInfo,
  AnalysisResult,
  GeminiRequestPayload,
  GeminiResponse,
  MistralRequestPayload,
  MistralResponse,
} from './types';
import { SYSTEM_PROMPT, RESPONSE_SCHEMA } from './prompts';
import { API_CONFIG, STORAGE_KEYS, UI_CONFIG, ERROR_MESSAGES, SCORE_THRESHOLDS } from './constants';
import { logger } from './utils/logger';

const CONTEXT = 'sidepanel';

// Listen for messages from background script
chrome.runtime.onMessage.addListener(
  (message: RuntimeMessage, _sender: chrome.runtime.MessageSender, sendResponse: (response?: { ok: boolean }) => void) => {
    logger.debug(CONTEXT, 'Received message', message.type);

    if (message.type === 'ra_text_extracted') {
      logger.debug(CONTEXT, 'Received extracted text', { length: message.text?.length });
      if (window.handleExtractedText) {
        window.handleExtractedText(message.text, message.tabInfo);
      }
      try {
        sendResponse({ ok: true });
      } catch (e) {
        /* ignore */
      }
    } else if (message.type === 'ra_extraction_error') {
      logger.error(CONTEXT, 'Extraction error', message.error);
      if (window.handleExtractionError) {
        window.handleExtractionError(message.error);
      }
      try {
        sendResponse({ ok: true });
      } catch (e) {
        /* ignore */
      }
    }
  }
);

// Extend window interface for global functions
declare global {
  interface Window {
    handleExtractedText?: (text: string, tabInfo: TabInfo) => Promise<void>;
    handleExtractionError?: (error: string) => void;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  logger.debug(CONTEXT, 'DOMContentLoaded - initializing');

  // UI elements
  const analyzeButton = document.getElementById('analyze-button') as HTMLButtonElement;
  const statusArea = document.getElementById('status-area') as HTMLElement;
  const statusIcon = document.getElementById('status-icon') as HTMLElement;
  const statusMessage = document.getElementById('status-message') as HTMLElement;
  const statusDetail = document.getElementById('status-detail') as HTMLElement;
  const openSettingsBtn = document.getElementById('open-settings') as HTMLButtonElement;
  const resultsContainer = document.getElementById('results-container') as HTMLElement;
  const classificationEl = document.getElementById('classification') as HTMLElement;
  const finalScoreEl = document.getElementById('final-score') as HTMLElement;
  const assessmentList = document.getElementById('assessment-list') as HTMLElement;

  let currentTab: chrome.tabs.Tab | null = null;

  // Track the active tab to ensure we have the URL ready for the permission request
  function updateCurrentTab(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        currentTab = tabs[0];
        logger.debug(CONTEXT, 'Current tab updated', currentTab.url);
      }
    });
  }

  updateCurrentTab();
  chrome.tabs.onActivated.addListener(updateCurrentTab);
  chrome.tabs.onUpdated.addListener(updateCurrentTab);

  // Status display functions
  function showStatus(type: 'fetching' | 'analyzing' | 'success' | 'error', message: string, detail = ''): void {
    statusArea.classList.remove('hidden');
    analyzeButton.classList.add('hidden');

    // Reset classes
    statusArea.className = 'status-box';

    switch (type) {
      case 'fetching':
        statusArea.classList.add('status-fetching');
        statusIcon.innerHTML = '<div class="spinner"></div>';
        break;
      case 'analyzing':
        statusArea.classList.add('status-analyzing');
        statusIcon.innerHTML = '<div class="spinner"></div>';
        break;
      case 'success':
        statusArea.classList.add('status-success');
        statusIcon.innerHTML =
          '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
        break;
      case 'error':
        statusArea.classList.add('status-error');
        statusIcon.innerHTML =
          '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        break;
    }

    statusMessage.textContent = message;
    if (detail) {
      statusDetail.textContent = detail;
      statusDetail.classList.remove('hidden');
    } else {
      statusDetail.classList.add('hidden');
    }
  }

  // Button click handler - provides user gesture for permission request
  analyzeButton.addEventListener('click', async () => {
    logger.debug(CONTEXT, 'Analyze button clicked');

    if (!currentTab) {
      // Try one last time if cache is empty
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tabs && tabs[0]) currentTab = tabs[0];
    }

    if (!currentTab || !currentTab.url) {
      showStatus('error', ERROR_MESSAGES.NO_ACTIVE_TAB, 'Please make sure you have a webpage open.');
      return;
    }

    showStatus('fetching', 'Requesting permission...', 'Please grant access when prompted');

    try {
      const origin = new URL(currentTab.url).origin + '/*';
      logger.debug(CONTEXT, 'Requesting permission for', origin);

      // Request permission IMMEDIATELY to satisfy "user gesture" requirement
      const granted = await chrome.permissions.request({
        origins: [origin],
      });

      if (!granted) {
        logger.warn(CONTEXT, 'Permission denied');
        showStatus('error', ERROR_MESSAGES.PERMISSION_DENIED, 'Please grant access to this website to analyze its content.');
        return;
      }

      logger.debug(CONTEXT, 'Permission granted, requesting extraction');
      showStatus('fetching', 'Fetching page text...', 'Please wait while we extract text from the current page');

      // Now request extraction from background script
      chrome.runtime.sendMessage({ type: 'ra_request_extraction' }, () => {
        if (chrome.runtime.lastError) {
          logger.error(CONTEXT, 'Failed to send extraction request', chrome.runtime.lastError);
          showStatus('error', 'Failed to communicate with background script', chrome.runtime.lastError.message);
        } else {
          logger.debug(CONTEXT, 'Extraction request sent');
        }
      });

      // SECURITY FIX: Remove polling - rely solely on message listener
      // The message listener will call handleExtractedText when data arrives
    } catch (error) {
      const err = error as Error;
      logger.error(CONTEXT, 'Error in analyze button handler', err);
      showStatus('error', 'Failed to request permission', err.message);
    }
  });

  // Handle text extracted by background script
  async function handleExtractedText(text: string, _tabInfo: TabInfo): Promise<void> {
    // SECURITY FIX: Input validation - truncate text to 50k characters
    let processedText = text;
    if (text.length > UI_CONFIG.MAX_TEXT_LENGTH) {
      processedText = text.substring(0, UI_CONFIG.MAX_TEXT_LENGTH);
      showStatus(
        'analyzing',
        'Analyzing text...',
        `Note: Text truncated to ${UI_CONFIG.MAX_TEXT_LENGTH} characters for analysis`
      );
    } else {
      showStatus('analyzing', 'Analyzing text...', 'Running reliability assessment');
    }

    try {
      logger.debug(CONTEXT, 'Analyzing extracted text', { length: processedText.length });
      const analysisResult = await performAnalysis(processedText);
      updateUI(analysisResult);
      showStatus('success', 'Analysis complete!', 'Results displayed below');
    } catch (error) {
      const err = error as Error;
      logger.error(CONTEXT, 'Analysis error', err);
      if (err.message.includes('API Key') || err.message.includes('Settings')) {
        showStatus('error', 'Analysis failed', 'Please check your settings and ensure your API key is configured correctly.');
      } else if (err.message.includes('Ollama')) {
        showStatus('error', 'Analysis failed', ERROR_MESSAGES.OLLAMA_CONNECTION_FAILED);
      } else if (err.message.includes('timeout') || err.message.includes('aborted')) {
        showStatus('error', 'Analysis failed', 'Request timed out. Please try again.');
      } else {
        showStatus('error', 'Analysis failed', err.message);
      }
    }
  }

  // Handle extraction error from background script
  function handleExtractionError(error: string): void {
    showStatus('error', 'Failed to extract text', error);
  }

  // Make functions available globally for message listener
  window.handleExtractedText = handleExtractedText;
  window.handleExtractionError = handleExtractionError;

  async function performAnalysis(text: string): Promise<AnalysisResult> {
    const settings = await chrome.storage.sync.get([STORAGE_KEYS.SELECTED_MODEL, STORAGE_KEYS.GEMINI_API_KEY]);
    const selectedModel = settings[STORAGE_KEYS.SELECTED_MODEL] || 'gemini';

    if (selectedModel === 'gemini') {
      if (!settings[STORAGE_KEYS.GEMINI_API_KEY]) {
        throw new Error(ERROR_MESSAGES.API_KEY_MISSING);
      }
      return await callGeminiAPI(text, settings[STORAGE_KEYS.GEMINI_API_KEY] as string);
    } else if (selectedModel === 'mistral') {
      return await callMistralAPI(text);
    } else {
      throw new Error(ERROR_MESSAGES.INVALID_MODEL);
    }
  }

  // SECURITY FIX: API key moved to Authorization header instead of URL parameter
  // SECURITY FIX: Added timeout handling with AbortController
  async function callGeminiAPI(text: string, apiKey: string): Promise<AnalysisResult> {
    const API_URL = `${API_CONFIG.GEMINI.BASE_URL}/models/${API_CONFIG.GEMINI.MODEL}:generateContent`;

    const payload: GeminiRequestPayload = {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: `Text to Analyze: "${text}"` }] }],
      generationConfig: {
        responseMimeType: API_CONFIG.GEMINI.MIME_TYPE,
        responseSchema: RESPONSE_SCHEMA,
        temperature: API_CONFIG.GEMINI.TEMPERATURE,
      },
    };

    // SECURITY FIX: Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // SECURITY FIX: API key in header instead of URL parameter
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`${ERROR_MESSAGES.API_REQUEST_FAILED}: ${response.status} - ${errorBody}`);
      }

      const result: GeminiResponse = await response.json();
      try {
        return JSON.parse(result.candidates[0].content.parts[0].text);
      } catch (e) {
        throw new Error(ERROR_MESSAGES.JSON_PARSE_FAILED);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if ((error as Error).name === 'AbortError') {
        throw new Error('Request timeout: Analysis took too long. Please try with a shorter text.');
      }
      throw error;
    }
  }

  // SECURITY FIX: Added timeout handling with AbortController
  async function callMistralAPI(text: string): Promise<AnalysisResult> {
    const mistralSystemPrompt = SYSTEM_PROMPT + `\n\nYou MUST respond with ONLY the JSON object.`;

    const payload: MistralRequestPayload = {
      model: API_CONFIG.MISTRAL.MODEL,
      messages: [
        { role: 'system', content: mistralSystemPrompt },
        { role: 'user', content: `Text to Analyze: "${text}"` },
      ],
      format: 'json',
      stream: false,
    };

    // SECURITY FIX: Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT_MS);

    try {
      const response = await fetch(API_CONFIG.MISTRAL.BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Local API request failed: ${response.status}`);
      const result: MistralResponse = await response.json();
      return JSON.parse(result.message.content);
    } catch (error) {
      clearTimeout(timeoutId);
      if ((error as Error).name === 'AbortError') {
        throw new Error('Request timeout: Analysis took too long. Please try with a shorter text.');
      }
      if ((error as Error).message.includes('Failed to fetch')) {
        throw new Error(ERROR_MESSAGES.OLLAMA_CONNECTION_FAILED);
      }
      throw error;
    }
  }

  function updateUI(data: AnalysisResult): void {
    finalScoreEl.textContent = data.finalScore.toFixed(1);
    classificationEl.textContent = data.classification;

    // Reset classes
    const scoreHeader = document.getElementById('score-header') as HTMLElement;
    scoreHeader.className = 'score-header';

    let typeClass = '';
    let colorVar = '';

    switch (data.classification) {
      case 'Factual':
        typeClass = 'type-factual';
        colorVar = 'var(--green-600)';
        break;
      case 'Opinion':
        typeClass = 'type-opinion';
        colorVar = 'var(--blue-600)';
        break;
      case 'Fiction':
        typeClass = 'type-fiction';
        colorVar = 'var(--purple-600)';
        break;
    }

    scoreHeader.classList.add(typeClass);

    // Update body colors based on classification/score
    const scoreBody = document.querySelector('.score-body') as HTMLElement;
    const reliabilityLabel = document.querySelector('.reliability-label') as HTMLElement;
    const finalScoreValue = document.querySelector('.final-score-value') as HTMLElement;
    const scoreMax = document.querySelector('.score-max') as HTMLElement;

    scoreBody.style.borderColor = colorVar;
    reliabilityLabel.style.color = colorVar;
    finalScoreValue.style.color = colorVar;
    scoreMax.style.color = colorVar;

    // SECURITY FIX: Replace innerHTML with safe DOM manipulation
    assessmentList.innerHTML = '';
    if (data.rawAssessment && data.rawAssessment.length > 0) {
      data.rawAssessment.forEach((item) => {
        const itemEl = document.createElement('div');
        itemEl.className = 'assessment-item';

        const headerEl = document.createElement('div');
        headerEl.className = 'assessment-header';

        const indicatorEl = document.createElement('h4');
        indicatorEl.className = 'assessment-indicator';
        indicatorEl.textContent = item.indicator; // SECURITY FIX: Use textContent instead of innerHTML

        const scoreEl = document.createElement('span');
        scoreEl.className = `assessment-score ${getScoreColor(item.score)}`;
        scoreEl.textContent = item.score.toFixed(1);

        headerEl.appendChild(indicatorEl);
        headerEl.appendChild(scoreEl);

        const analysisEl = document.createElement('p');
        analysisEl.className = 'assessment-analysis';
        analysisEl.textContent = item.analysis; // SECURITY FIX: Use textContent instead of innerHTML

        itemEl.appendChild(headerEl);
        itemEl.appendChild(analysisEl);
        assessmentList.appendChild(itemEl);
      });
    } else {
      const noDataEl = document.createElement('p');
      noDataEl.className = 'text-gray-500';
      noDataEl.textContent = 'No detailed assessment provided.';
      assessmentList.appendChild(noDataEl);
    }

    resultsContainer.classList.remove('hidden');
  }

  function getScoreColor(score: number): string {
    if (score >= SCORE_THRESHOLDS.HIGH) return 'text-green';
    if (score >= SCORE_THRESHOLDS.MEDIUM) return 'text-yellow';
    return 'text-red';
  }

  const viewDetailsLink = document.getElementById('view-details-link') as HTMLAnchorElement;
  const rawAssessmentDetails = document.getElementById('raw-assessment-details') as HTMLElement;
  viewDetailsLink.addEventListener('click', (e) => {
    e.preventDefault();
    rawAssessmentDetails.classList.toggle('hidden');
    viewDetailsLink.textContent = rawAssessmentDetails.classList.contains('hidden')
      ? 'Review full assessment'
      : 'Hide full assessment';
  });

  openSettingsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());
});
