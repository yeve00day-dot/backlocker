const toggleSwitch = document.getElementById('toggleSwitch');
const statusLabel = document.getElementById('statusLabel');

// Load current state
chrome.storage.local.get(['isEnabled'], (result) => {
    const isEnabled = result.isEnabled ?? true; // Default to true
    toggleSwitch.checked = isEnabled;
    updateLabel(isEnabled);
});

// Watch for changes
toggleSwitch.addEventListener('change', () => {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.local.set({ isEnabled: isEnabled });
    updateLabel(isEnabled);
});

function updateLabel(isEnabled) {
    statusLabel.textContent = isEnabled ? 'Enabled' : 'Disabled';
    statusLabel.style.color = isEnabled ? '#2196F3' : '#555';
}
