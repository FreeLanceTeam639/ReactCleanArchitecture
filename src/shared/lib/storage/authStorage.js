import { STORAGE_KEYS } from '../../constants/storageKeys.js';

function readStorage(storage) {
  try {
    const rawValue = storage.getItem(STORAGE_KEYS.authenticatedUser);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

export function saveAuthenticatedUser(userPayload, rememberMe) {
  const primaryStorage = rememberMe ? localStorage : sessionStorage;
  const secondaryStorage = rememberMe ? sessionStorage : localStorage;

  primaryStorage.setItem(STORAGE_KEYS.authenticatedUser, JSON.stringify(userPayload));
  secondaryStorage.removeItem(STORAGE_KEYS.authenticatedUser);
}

export function getAuthenticatedUser() {
  return readStorage(localStorage) || readStorage(sessionStorage);
}

export function clearAuthenticatedUser() {
  localStorage.removeItem(STORAGE_KEYS.authenticatedUser);
  sessionStorage.removeItem(STORAGE_KEYS.authenticatedUser);
}
