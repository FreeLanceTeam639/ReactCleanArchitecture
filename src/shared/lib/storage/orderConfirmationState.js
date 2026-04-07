const STORAGE_KEY = 'freelanceaze.order-confirmation';

function canUseStorage() {
  return typeof window !== 'undefined' && window.sessionStorage;
}

export function setPendingOrderConfirmation(payload) {
  if (!canUseStorage()) {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload || {}));
}

export function consumePendingOrderConfirmation() {
  if (!canUseStorage()) {
    return null;
  }

  const rawValue = window.sessionStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);

  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}
