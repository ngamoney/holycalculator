/**
 * Common retention helpers for URL query param state syncing and localStorage history management.
 */

// Helper to copy text to clipboard with fallback
export function copyToClipboard(text, successCallback, fallbackCallback) {
  if (typeof window === "undefined") return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(() => {
        if (successCallback) successCallback();
      })
      .catch(() => {
        if (fallbackCallback) fallbackCallback();
      });
  } else {
    if (fallbackCallback) fallbackCallback();
  }
}

// Helper to load history from localStorage
export function loadHistoryFromStorage(key) {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Helper to save item to history array in localStorage
export function saveHistoryToStorage(key, newItem, limit = 5, dedupeKey = null) {
  if (typeof window === "undefined") return [];
  try {
    const prev = loadHistoryFromStorage(key);
    let filtered = prev;
    if (dedupeKey && newItem[dedupeKey]) {
      filtered = prev.filter(item => item[dedupeKey] !== newItem[dedupeKey]);
    }
    const updated = [newItem, ...filtered].slice(0, limit);
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

// Helper to update URL query params silently via replaceState
export function syncParamsToUrl(paramObj) {
  if (typeof window === "undefined") return;
  try {
    const searchParams = new URLSearchParams();
    Object.entries(paramObj).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.set(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  } catch {
    // Ignore URL replace errors
  }
}
