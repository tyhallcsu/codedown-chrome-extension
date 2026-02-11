// CodeDown Extension - Popup Script

const SUPPORTED_SITES = [
    { pattern: /chatgpt\.com/, name: 'ChatGPT' },
    { pattern: /chat\.z\.ai/, name: 'Z.AI' },
    { pattern: /gemini\.google\.com/, name: 'Gemini' },
    { pattern: /lmarena\.ai/, name: 'LMArena' },
    { pattern: /kimi\.com/, name: 'Kimi' },
    { pattern: /chat\.mistral\.ai/, name: 'Le Chat' },
    { pattern: /meta\.ai/, name: 'Meta AI' },
    { pattern: /copilot\.microsoft\.com/, name: 'Copilot' },
    { pattern: /grok\.com/, name: 'Grok' },
    { pattern: /longcat\.chat/, name: 'LongCat' }
];

document.addEventListener('DOMContentLoaded', async () => {
    const siteStatus = document.getElementById('site-status');
    const openManagerBtn = document.getElementById('open-manager-btn');
    const btnText = document.getElementById('btn-text');
    const errorMessage = document.getElementById('error-message');

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.add('visible');
    }

    function hideError() {
        errorMessage.classList.remove('visible');
    }

    try {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.url) {
            siteStatus.textContent = 'Unknown';
            siteStatus.classList.add('inactive');
            showError('Cannot access current tab');
            return;
        }

        // Check if current site is supported
        const url = new URL(tab.url);
        const supportedSite = SUPPORTED_SITES.find(site => site.pattern.test(url.hostname));

        if (supportedSite) {
            siteStatus.textContent = supportedSite.name;
            siteStatus.classList.remove('inactive');
            siteStatus.classList.add('active');
            openManagerBtn.disabled = false;
            btnText.textContent = 'Open Manager';
        } else {
            siteStatus.textContent = 'Not supported';
            siteStatus.classList.add('inactive');
            openManagerBtn.disabled = true;
            btnText.textContent = 'Site not supported';
        }

        // Button click handler
        openManagerBtn.addEventListener('click', async () => {
            if (openManagerBtn.disabled) return;

            hideError();
            btnText.textContent = 'Opening...';
            openManagerBtn.disabled = true;

            try {
                await chrome.tabs.sendMessage(tab.id, { action: 'toggleManager' });
                // Close popup after triggering
                setTimeout(() => window.close(), 200);
            } catch (err) {
                console.error('Failed to send message:', err);
                showError('Failed to communicate with page. Try refreshing.');
                btnText.textContent = 'Open Manager';
                openManagerBtn.disabled = false;
            }
        });

    } catch (err) {
        console.error('Popup initialization error:', err);
        showError('Failed to initialize. Please try again.');
    }
});
