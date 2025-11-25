document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('settings-form');
    const modelSelect = document.getElementById('model-select');
    const geminiConfig = document.getElementById('gemini-config');
    const mistralConfig = document.getElementById('mistral-config');
    const geminiApiKeyInput = document.getElementById('gemini-api-key');
    const statusMessage = document.getElementById('status-message');

    // Load saved settings
    chrome.storage.sync.get(['selectedModel', 'geminiApiKey'], (items) => {
        if (items.selectedModel) {
            modelSelect.value = items.selectedModel;
        }
        if (items.geminiApiKey) {
            geminiApiKeyInput.value = items.geminiApiKey;
        }
        toggleConfigVisibility();
    });

    // Toggle visibility based on selection
    modelSelect.addEventListener('change', toggleConfigVisibility);

    function toggleConfigVisibility() {
        if (modelSelect.value === 'gemini') {
            geminiConfig.classList.remove('hidden');
            mistralConfig.classList.add('hidden');
        } else {
            geminiConfig.classList.add('hidden');
            mistralConfig.classList.remove('hidden');
        }
    }

    // Save settings
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedModel = modelSelect.value;
        const geminiApiKey = geminiApiKeyInput.value.trim();

        chrome.storage.sync.set({
            selectedModel: selectedModel,
            geminiApiKey: geminiApiKey
        }, () => {
            // Show success message
            statusMessage.classList.remove('opacity-0');
            setTimeout(() => {
                statusMessage.classList.add('opacity-0');
            }, 2000);
        });
    });
});
