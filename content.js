let isLocked = false;
let pushInterval = null;

const pushState = () => {
  // Fill the history stack significantly to make manual clicking futile
  // Browsers usually limit the stack but we can push many states.
  for (let i = 0; i < 50; i++) {
    history.pushState({ locked: true, index: i }, document.title, location.href);
  }
};

const popStateListener = (event) => {
  // Aggressively push back on any attempt
  pushState();
};

const hashChangeListener = () => {
  pushState();
};

const beforeUnloadListener = (e) => {
  const message = "Back button is locked. Are you sure you want to leave?";
  e.returnValue = message;
  return message;
};

const keyboardListener = (e) => {
  // Comprehensive shortcut blocking
  const forbiddenKeys = [
    (e.altKey && e.key === 'ArrowLeft'),    // Alt + Left
    (e.altKey && e.key === 'ArrowRight'),   // Alt + Right
    (e.ctrlKey && e.key === '['),          // Ctrl + [
    (e.ctrlKey && e.key === ']'),          // Ctrl + ]
    (e.key === 'Backspace' && !['INPUT', 'TEXTAREA'].includes(e.target.tagName) && !e.target.isContentEditable)
  ];

  if (forbiddenKeys.some(k => k)) {
    console.log("Navigation shortcut blocked:", e.key);
    e.preventDefault();
    e.stopPropagation();
    pushState();
  }
};

const mouseListener = (e) => {
  // Button 3 is Back, Button 4 is Forward on many mice
  if (e.button === 3 || e.button === 4) {
    console.log("Mouse navigation button blocked.");
    e.preventDefault();
    e.stopPropagation();
    pushState();
  }
};

function activateLock() {
  if (isLocked) return;

  pushState();
  window.addEventListener('popstate', popStateListener, true);
  window.addEventListener('hashchange', hashChangeListener, true);
  window.addEventListener('beforeunload', beforeUnloadListener, true);
  window.addEventListener('keydown', keyboardListener, true);
  window.addEventListener('mousedown', mouseListener, true); // Catch before mouseup
  window.addEventListener('mouseup', mouseListener, true);

  pushInterval = setInterval(() => {
    // Keep the stack deep
    if (history.length < 20) {
      pushState();
    }
  }, 500);

  isLocked = true;
  console.log("Back button lock ACTIVATED (ULTRA MODE).");
}

function deactivateLock() {
  if (!isLocked) return;

  window.removeEventListener('popstate', popStateListener, true);
  window.removeEventListener('hashchange', hashChangeListener, true);
  window.removeEventListener('beforeunload', beforeUnloadListener, true);
  window.removeEventListener('keydown', keyboardListener, true);
  window.removeEventListener('mousedown', mouseListener, true);
  window.removeEventListener('mouseup', mouseListener, true);

  if (pushInterval) clearInterval(pushInterval);

  isLocked = false;
  console.log("Back button lock DEACTIVATED.");

  if (confirm("잠금 기능이 꺼졌습니다. 이전의 히스토리 내역을 복구하려면 페이지를 새로고침하시겠습니까?")) {
    location.reload();
  }
}

// Initial state check
chrome.storage.local.get(['isEnabled'], (result) => {
  if (result.isEnabled !== false) { // Default to true
    setTimeout(activateLock, 100);
  }
});

// React to toggle changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.isEnabled) {
    if (changes.isEnabled.newValue) {
      activateLock();
    } else {
      deactivateLock();
    }
  }
});
