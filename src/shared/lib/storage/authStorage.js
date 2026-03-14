import { STORAGE_KEYS } from '../../constants/storageKeys.js';

function readStorage(storage) {
  try {
    const rawValue = storage.getItem(STORAGE_KEYS.authSession);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

function sanitizeSessionPayload(sessionPayload = {}, rememberMe = false) {
  return {
    accessToken: sessionPayload.accessToken || sessionPayload.token || null,
    refreshToken: sessionPayload.refreshToken || null,
    csrfToken: sessionPayload.csrfToken || null,
    expiresAt: sessionPayload.expiresAt || null,
    authType: sessionPayload.authType || (sessionPayload.accessToken || sessionPayload.token ? 'token' : 'cookie'),
    rememberMe: Boolean(rememberMe)
  };
}

export function saveAuthenticatedUser(sessionPayload, rememberMe) {
  const primaryStorage = rememberMe ? localStorage : sessionStorage;
  const secondaryStorage = rememberMe ? sessionStorage : localStorage;
  const sanitizedPayload = sanitizeSessionPayload(sessionPayload, rememberMe);

  primaryStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(sanitizedPayload));
  secondaryStorage.removeItem(STORAGE_KEYS.authSession);

  return sanitizedPayload;
}

export function getAuthenticatedUser() {
  return readStorage(localStorage) || readStorage(sessionStorage);
}

export function getAccessToken() {
  return getAuthenticatedUser()?.accessToken || null;
}

export function getRefreshToken() {
  return getAuthenticatedUser()?.refreshToken || null;
}

export function getCsrfToken() {
  return getAuthenticatedUser()?.csrfToken || null;
}

export function hasAuthenticatedSession() {
  return Boolean(getAuthenticatedUser());
}

export function isDemoAuthenticatedSession() {
  return getAuthenticatedUser()?.authType === 'demo';
}

export function clearAuthenticatedUser() {
  localStorage.removeItem(STORAGE_KEYS.authSession);
  sessionStorage.removeItem(STORAGE_KEYS.authSession);
}
