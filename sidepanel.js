// SYSTEM_PROMPT is loaded from prompts.js

const RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "classification": {
            "type": "STRING",
            "enum": ["Factual", "Opinion", "Fiction"]
        },
        "finalScore": { "type": "NUMBER" },
        "rawAssessment": {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "indicator": { "type": "STRING" },
                    "analysis": { "type": "STRING" },
                    "score": { "type": "NUMBER" }
                },
                "required": ["indicator", "analysis", "score"]
            }
        }
    },
    "required": ["classification", "finalScore", "rawAssessment"]
};

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('[sidepanel] received message:', message.type);

    if (message.type === 'ra_text_extracted') {
        console.log('[sidepanel] received extracted text, length:', message.text?.length);
        if (window.handleExtractedText) {
            window.handleExtractedText(message.text, message.tabInfo);
        }
        try { sendResponse({ ok: true }); } catch (e) { /* ignore */ }
    } else if (message.type === 'ra_extraction_error') {
        console.error('[sidepanel] extraction error:', message.error);
        if (window.handleExtractionError) {
            window.handleExtractionError(message.error);
        }
        try { sendResponse({ ok: true }); } catch (e) { /* ignore */ }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('[sidepanel] DOMContentLoaded - initializing');

    // UI elements
    const analyzeButton = document.getElementById('analyze-button');
    const statusArea = document.getElementById('status-area');
    const statusIcon = document.getElementById('status-icon');
    const statusMessage = document.getElementById('status-message');
    const statusDetail = document.getElementById('status-detail');
    const openSettingsBtn = document.getElementById('open-settings');
    const resultsContainer = document.getElementById('results-container');
    const scoreBox = document.getElementById('score-box');
    const classificationEl = document.getElementById('classification');
    const finalScoreEl = document.getElementById('final-score');
    const rawAssessmentDetails = document.getElementById('raw-assessment-details');
    const assessmentList = document.getElementById('assessment-list');

    let hasProcessedData = false;
    let pollingInterval = null;
    let currentTab = null;

    // Track the active tab to ensure we have the URL ready for the permission request
    // This avoids using await chrome.tabs.query() inside the click handler, which breaks the user gesture
    function updateCurrentTab() {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs[0]) {
                currentTab = tabs[0];
                console.log('[sidepanel] Current tab updated:', currentTab.url);
            }
        });
    }

    updateCurrentTab();
    chrome.tabs.onActivated.addListener(updateCurrentTab);
    chrome.tabs.onUpdated.addListener(updateCurrentTab);

    // Status display functions
    function showStatus(type, message, detail = '') {
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
                statusIcon.innerHTML = '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                break;
            case 'error':
                statusArea.classList.add('status-error');
                statusIcon.innerHTML = '<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
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

    function checkForExtractedData() {
        chrome.storage.local.get(['ra_extractedText', 'ra_tabInfo', 'ra_extractionError', 'ra_timestamp'], (res) => {
            console.log('[sidepanel] Checked storage:', {
                hasText: !!res.ra_extractedText,
                hasError: !!res.ra_extractionError,
                timestamp: res.ra_timestamp
            });

            if (hasProcessedData) {
                return;
            }

            if (res.ra_extractionError) {
                console.log('[sidepanel] Found extraction error in storage');
                handleExtractionError(res.ra_extractionError);
                hasProcessedData = true;
                stopPolling();
                chrome.storage.local.remove(['ra_extractionError', 'ra_timestamp']);
            } else if (res.ra_extractedText) {
                console.log('[sidepanel] Found extracted text in storage, length:', res.ra_extractedText.length);
                handleExtractedText(res.ra_extractedText, res.ra_tabInfo);
                hasProcessedData = true;
                stopPolling();
                chrome.storage.local.remove(['ra_extractedText', 'ra_tabInfo', 'ra_timestamp']);
            }
        });
    }

    // Button click handler - provides user gesture for permission request
    analyzeButton.addEventListener('click', async () => {
        console.log('[sidepanel] Analyze button clicked');

        if (!currentTab) {
            // Try one last time if cache is empty
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs && tabs[0]) currentTab = tabs[0];
        }

        if (!currentTab) {
            showStatus('error', 'No active tab found', 'Please make sure you have a webpage open.');
            return;
        }

        showStatus('fetching', 'Requesting permission...', 'Please grant access when prompted');

        try {
            const origin = new URL(currentTab.url).origin + '/*';
            console.log('[sidepanel] Requesting permission for:', origin);

            // Request permission IMMEDIATELY to satisfy "user gesture" requirement
            const granted = await chrome.permissions.request({
                origins: [origin]
            });

            if (!granted) {
                console.warn('[sidepanel] Permission denied');
                showStatus('error', 'Permission denied', 'Please grant access to this website to analyze its content.');
                return;
            }

            console.log('[sidepanel] Permission granted, requesting extraction');
            showStatus('fetching', 'Fetching page text...', 'Please wait while we extract text from the current page');

            // Now request extraction from background script
            chrome.runtime.sendMessage({ type: 'ra_request_extraction' }, (response) => {
                if (chrome.runtime.lastError) {
                    console.error('[sidepanel] Failed to send extraction request:', chrome.runtime.lastError);
                    showStatus('error', 'Failed to communicate with background script', chrome.runtime.lastError.message);
                } else {
                    console.log('[sidepanel] Extraction request sent');
                }
            });

            // Start polling for results
            startPolling();

        } catch (error) {
            console.error('[sidepanel] Error in analyze button handler:', error);
            showStatus('error', 'Failed to request permission', error.message);
        }
    });

    function startPolling() {
        hasProcessedData = false;
        checkForExtractedData();
        pollingInterval = setInterval(checkForExtractedData, 200);
    }

    function stopPolling() {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
    }

    // Handle text extracted by background script
    async function handleExtractedText(text, tabInfo) {
        showStatus('analyzing', 'Analyzing text...', 'Running reliability assessment');

        try {
            console.log('[sidepanel] analyzing extracted text, length:', text.length);
            const analysisResult = await performAnalysis(text);
            updateUI(analysisResult);
            showStatus('success', 'Analysis complete!', 'Results displayed below');
        } catch (error) {
            console.error('[sidepanel] Analysis error:', error);
            if (error.message.includes('API Key') || error.message.includes('Settings')) {
                showStatus('error', 'Analysis failed', 'Please check your settings and ensure your API key is configured correctly.');
            } else if (error.message.includes('Ollama')) {
                showStatus('error', 'Analysis failed', 'Cannot connect to local Ollama server. Is it running?');
            } else {
                showStatus('error', 'Analysis failed', error.message);
            }
        }
    }

    // Handle extraction error from background script
    function handleExtractionError(error) {
        showStatus('error', 'Failed to extract text', error);
    }

    // Make functions available globally for message listener
    window.handleExtractedText = handleExtractedText;
    window.handleExtractionError = handleExtractionError;

    async function performAnalysis(text) {
        const settings = await chrome.storage.sync.get(['selectedModel', 'geminiApiKey']);
        const selectedModel = settings.selectedModel || 'gemini';
        if (selectedModel === 'gemini') {
            if (!settings.geminiApiKey) {
                throw new Error('Gemini API Key is missing. Please configure it in Settings.');
            }
            return await callGeminiAPI(text, settings.geminiApiKey);
        } else if (selectedModel === 'mistral') {
            return await callMistralAPI(text);
        } else {
            throw new Error('Invalid model selected.');
        }
    }

    async function callGeminiAPI(text, apiKey) {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
        const payload = {
            "systemInstruction": { "parts": [{ "text": SYSTEM_PROMPT }] },
            "contents": [{ "parts": [{ "text": `Text to Analyze: \"${text}\"` }] }],
            "generationConfig": {
                "responseMimeType": "application/json",
                "responseSchema": RESPONSE_SCHEMA,
                "temperature": 0.1
            }
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`API request failed: ${response.status} - ${errorBody}`);
        }

        const result = await response.json();
        try {
            return JSON.parse(result.candidates[0].content.parts[0].text);
        } catch (e) {
            throw new Error('Failed to parse JSON response from API.');
        }
    }

    async function callMistralAPI(text) {
        const MISTRAL_URL = 'http://localhost:11434/api/chat';
        const mistralSystemPrompt = SYSTEM_PROMPT + `\n\nYou MUST respond with ONLY the JSON object.`;

        const payload = {
            "model": "mistral",
            "messages": [
                { "role": "system", "content": mistralSystemPrompt },
                { "role": "user", "content": `Text to Analyze: \"${text}\"` }
            ],
            "format": "json",
            "stream": false
        };

        try {
            const response = await fetch(MISTRAL_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Local API request failed: ${response.status}`);
            const result = await response.json();
            return JSON.parse(result.message.content);
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Failed to connect to local model. Is Ollama running?');
            }
            throw error;
        }
    }

    function updateUI(data) {
        finalScoreEl.textContent = data.finalScore.toFixed(1);
        classificationEl.textContent = data.classification;

        // Reset classes
        const scoreHeader = document.getElementById('score-header');
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
        const scoreBody = document.querySelector('.score-body');
        const reliabilityLabel = document.querySelector('.reliability-label');
        const finalScoreValue = document.querySelector('.final-score-value');
        const scoreMax = document.querySelector('.score-max');

        scoreBody.style.borderColor = colorVar;
        reliabilityLabel.style.color = colorVar;
        finalScoreValue.style.color = colorVar;
        scoreMax.style.color = colorVar;

        assessmentList.innerHTML = '';
        if (data.rawAssessment && data.rawAssessment.length > 0) {
            data.rawAssessment.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'assessment-item';
                itemEl.innerHTML = `
                    <div class="assessment-header">
                        <h4 class="assessment-indicator">${item.indicator}</h4>
                        <span class="assessment-score ${getScoreColor(item.score)}">${item.score.toFixed(1)}</span>
                    </div>
                    <p class="assessment-analysis">${item.analysis}</p>
                `;
                assessmentList.appendChild(itemEl);
            });
        } else {
            assessmentList.innerHTML = '<p class="text-gray-500">No detailed assessment provided.</p>';
        }

        resultsContainer.classList.remove('hidden');
    }

    function getScoreColor(score) {
        if (score >= 4.0) return 'text-green';
        if (score >= 2.5) return 'text-yellow';
        return 'text-red';
    }

    const viewDetailsLink = document.getElementById('view-details-link');
    viewDetailsLink.addEventListener('click', (e) => {
        e.preventDefault();
        rawAssessmentDetails.classList.toggle('hidden');
        viewDetailsLink.textContent = rawAssessmentDetails.classList.contains('hidden') ? 'Review full assessment' : 'Hide full assessment';
    });

    openSettingsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());
});