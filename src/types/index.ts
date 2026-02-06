/**
 * Type definitions for the Content Reliability Assessment Browser Extension
 */

/**
 * Content classification types
 */
export type Classification = 'Factual' | 'Opinion' | 'Fiction';

/**
 * LLM model types
 */
export type ModelType = 'gemini' | 'mistral' | 'claude';

/**
 * Individual assessment criterion with scoring
 */
export interface RawAssessment {
  indicator: string;
  analysis: string;
  score: number;
}

/**
 * Complete analysis result from LLM
 */
export interface AnalysisResult {
  classification: Classification;
  finalScore: number;
  rawAssessment: RawAssessment[];
}

/**
 * Tab information
 */
export interface TabInfo {
  id: number;
  url: string;
  title: string;
}

/**
 * User settings stored in chrome.storage.sync
 */
export interface Settings {
  selectedModel: ModelType;
  geminiApiKey: string;
  claudeApiKey: string;
}

/**
 * Storage data for extracted text
 */
export interface ExtractedData {
  ra_extractedText?: string;
  ra_tabInfo?: TabInfo;
  ra_extractionError?: string;
  ra_timestamp?: number;
}

/**
 * Runtime message types
 */
export type MessageType =
  | 'ra_request_extraction'
  | 'ra_text_extracted'
  | 'ra_extraction_error';

/**
 * Base message structure
 */
export interface BaseMessage {
  type: MessageType;
}

/**
 * Request extraction message
 */
export interface RequestExtractionMessage extends BaseMessage {
  type: 'ra_request_extraction';
}

/**
 * Text extracted message
 */
export interface TextExtractedMessage extends BaseMessage {
  type: 'ra_text_extracted';
  text: string;
  tabInfo: TabInfo;
}

/**
 * Extraction error message
 */
export interface ExtractionErrorMessage extends BaseMessage {
  type: 'ra_extraction_error';
  error: string;
}

/**
 * Union type for all messages
 */
export type RuntimeMessage =
  | RequestExtractionMessage
  | TextExtractedMessage
  | ExtractionErrorMessage;

/**
 * Gemini API request payload
 */
export interface GeminiRequestPayload {
  systemInstruction: {
    parts: Array<{ text: string }>;
  };
  contents: Array<{
    parts: Array<{ text: string }>;
  }>;
  generationConfig: {
    responseMimeType: string;
    responseSchema: Record<string, unknown>;
    temperature: number;
  };
}

/**
 * Gemini API response
 */
export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

/**
 * Claude (Anthropic) API request payload
 */
export interface ClaudeRequestPayload {
  model: string;
  max_tokens: number;
  temperature: number;
  system: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

/**
 * Claude (Anthropic) API response
 */
export interface ClaudeResponse {
  content: Array<{
    type: string;
    text: string;
  }>;
}

/**
 * Mistral (Ollama) API request payload
 */
export interface MistralRequestPayload {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  format: string;
  stream: boolean;
}

/**
 * Mistral (Ollama) API response
 */
export interface MistralResponse {
  message: {
    content: string;
  };
}
