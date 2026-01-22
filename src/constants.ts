/**
 * Application constants
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  GEMINI: {
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
    MODEL: 'gemini-2.5-flash-preview-09-2025',
    TEMPERATURE: 0.1,
    MIME_TYPE: 'application/json',
  },
  MISTRAL: {
    BASE_URL: 'http://localhost:11434/api/chat',
    MODEL: 'mistral',
  },
  TIMEOUT_MS: 30000, // 30 seconds
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  EXTRACTED_TEXT: 'ra_extractedText',
  TAB_INFO: 'ra_tabInfo',
  EXTRACTION_ERROR: 'ra_extractionError',
  TIMESTAMP: 'ra_timestamp',
  SELECTED_MODEL: 'selectedModel',
  GEMINI_API_KEY: 'geminiApiKey',
} as const;

/**
 * Message types
 */
export const MESSAGE_TYPES = {
  REQUEST_EXTRACTION: 'ra_request_extraction',
  TEXT_EXTRACTED: 'ra_text_extracted',
  EXTRACTION_ERROR: 'ra_extraction_error',
} as const;

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  POLLING_INTERVAL_MS: 200,
  STATUS_MESSAGE_DURATION_MS: 2000,
  MAX_TEXT_LENGTH: 50000, // 50k characters
} as const;

/**
 * Score thresholds for color coding
 */
export const SCORE_THRESHOLDS = {
  HIGH: 4.0,
  MEDIUM: 2.5,
} as const;

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NO_ACTIVE_TAB: 'No active tab found. Please make sure you have a webpage open.',
  INVALID_URL: 'Cannot extract text from this page. Please navigate to a regular webpage (http:// or https://).',
  EXTRACTION_FAILED: 'Failed to extract text from the page.',
  PERMISSION_DENIED: 'Permission denied. Please grant access to this website to analyze its content.',
  API_KEY_MISSING: 'API Key is missing. Please configure it in Settings.',
  INVALID_MODEL: 'Invalid model selected.',
  OLLAMA_CONNECTION_FAILED: 'Failed to connect to local model. Is Ollama running?',
  API_REQUEST_FAILED: 'API request failed',
  JSON_PARSE_FAILED: 'Failed to parse JSON response from API.',
  TEXT_TOO_LONG: 'Text is too long. Maximum length is 50,000 characters.',
} as const;
