// CodeDown - Background Service Worker (MV3)
// Handles context menus and keyboard shortcuts

const DEBUG = false;

function log(...args) {
    if (DEBUG) console.log('[CodeDown BG]', ...args);
}

// Create context menu on install
chrome.runtime.onInstalled.addListener(() => {
    log('Extension installed, creating context menu');
    
    chrome.contextMenus.create({
        id: 'codedown-manager',
        title: '⬇️ Open CodeDown Manager',
        contexts: ['page'],
        documentUrlPatterns: [
            'https://copilot.microsoft.com/*',
            'https://gemini.google.com/*',
            'https://chat.mistral.ai/*',
            'https://longcat.chat/*',
            'https://www.kimi.com/*',
            'https://www.meta.ai/*',
            'https://chatgpt.com/*',
            'https://lmarena.ai/*',
            'https://chat.z.ai/*',
            'https://grok.com/*'
        ]
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'codedown-manager') {
        log('Context menu clicked, sending message to tab:', tab.id);
        chrome.tabs.sendMessage(tab.id, { action: 'toggleManager' });
    }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener((command, tab) => {
    if (command === 'open-manager') {
        log('Keyboard shortcut triggered, sending message to tab:', tab?.id);
        if (tab?.id) {
            chrome.tabs.sendMessage(tab.id, { action: 'toggleManager' });
        }
    }
});

// Handle messages from content script (if needed for future features)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    log('Message received:', message);
    
    if (message.action === 'getTabInfo') {
        sendResponse({ tabId: sender.tab?.id, url: sender.tab?.url });
        return true;
    }
    
    return false;
});

log('Background service worker loaded');
