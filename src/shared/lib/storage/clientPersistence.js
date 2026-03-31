function isBrowserReady() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function getCookieName(key) {
  return `fa_${String(key || '').trim()}`;
}

function readStorageValue(storage, key) {
  try {
    return storage.getItem(key) || '';
  } catch {
    return '';
  }
}

function writeStorageValue(storage, key, value) {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage quota/privacy mode issues and keep other persistence channels working.
  }
}

function removeStorageValue(storage, key) {
  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage cleanup issues.
  }
}

function readCookieValue(key) {
  if (!isBrowserReady()) {
    return '';
  }

  const cookieName = `${getCookieName(key)}=`;
  const cookieParts = document.cookie.split(';');

  for (const cookiePart of cookieParts) {
    const normalizedPart = cookiePart.trim();

    if (normalizedPart.startsWith(cookieName)) {
      return decodeURIComponent(normalizedPart.slice(cookieName.length));
    }
  }

  return '';
}

function writeCookieValue(key, value, maxAgeSeconds = 7200) {
  if (!isBrowserReady()) {
    return;
  }

  document.cookie = [
    `${getCookieName(key)}=${encodeURIComponent(String(value || ''))}`,
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${Math.max(60, Number(maxAgeSeconds) || 7200)}`
  ].join('; ');
}

function removeCookieValue(key) {
  if (!isBrowserReady()) {
    return;
  }

  document.cookie = [
    `${getCookieName(key)}=`,
    'Path=/',
    'SameSite=Lax',
    'Max-Age=0'
  ].join('; ');
}

export function readPersistentValue(key) {
  if (!isBrowserReady()) {
    return '';
  }

  return (
    readStorageValue(sessionStorage, key) ||
    readStorageValue(localStorage, key) ||
    readCookieValue(key)
  );
}

export function writePersistentValue(key, value, maxAgeSeconds) {
  if (!isBrowserReady()) {
    return;
  }

  const normalizedValue = String(value || '');

  writeStorageValue(sessionStorage, key, normalizedValue);
  writeStorageValue(localStorage, key, normalizedValue);
  writeCookieValue(key, normalizedValue, maxAgeSeconds);
}

export function clearPersistentValue(key) {
  if (!isBrowserReady()) {
    return;
  }

  removeStorageValue(sessionStorage, key);
  removeStorageValue(localStorage, key);
  removeCookieValue(key);
}
