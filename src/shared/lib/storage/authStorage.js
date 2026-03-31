import { STORAGE_KEYS } from '../../constants/storageKeys.js';
import { clearPersistentValue, readPersistentValue, writePersistentValue } from './clientPersistence.js';

const AUTH_SESSION_CHANGE_EVENT = 'auth-session-change';

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
    expiresAt: sessionPayload.expiresAt || sessionPayload.accessTokenExpiresAt || null,
    refreshTokenExpiresAt: sessionPayload.refreshTokenExpiresAt || null,
    user: sessionPayload.user || null,
    authType: sessionPayload.authType || (sessionPayload.accessToken || sessionPayload.token ? 'token' : 'cookie'),
    rememberMe: Boolean(rememberMe)
  };
}

function notifyAuthSessionChanged() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(AUTH_SESSION_CHANGE_EVENT, {
      detail: {
        session: getAuthenticatedUser()
      }
    })
  );
}

export function saveAuthenticatedUser(sessionPayload, rememberMe) {
  const primaryStorage = rememberMe ? localStorage : sessionStorage;
  const secondaryStorage = rememberMe ? sessionStorage : localStorage;
  const sanitizedPayload = sanitizeSessionPayload(sessionPayload, rememberMe);

  primaryStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(sanitizedPayload));
  secondaryStorage.removeItem(STORAGE_KEYS.authSession);
  notifyAuthSessionChanged();

  return sanitizedPayload;
}

export function updateAuthenticatedSessionUser(nextUser) {
  const currentSession = getAuthenticatedUser();

  if (!currentSession) {
    return null;
  }

  const rememberMe = Boolean(currentSession.rememberMe);
  const mergedSession = {
    ...currentSession,
    user: {
      ...(currentSession.user || {}),
      ...(nextUser || {})
    }
  };

  return saveAuthenticatedUser(mergedSession, rememberMe);
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

export function clearAuthenticatedUser() {
  localStorage.removeItem(STORAGE_KEYS.authSession);
  sessionStorage.removeItem(STORAGE_KEYS.authSession);
  notifyAuthSessionChanged();
}

export function setPostLoginRedirect(pathname) {
  const normalizedPath = typeof pathname === 'string' ? pathname.trim() : '';

  if (!normalizedPath || !normalizedPath.startsWith('/')) {
    return;
  }

  writePersistentValue(STORAGE_KEYS.postLoginRedirect, normalizedPath, 3600);
}

export function getPostLoginRedirect() {
  const redirectPath = readPersistentValue(STORAGE_KEYS.postLoginRedirect);

  if (!redirectPath || !redirectPath.startsWith('/')) {
    return '';
  }

  return redirectPath;
}

export function consumePostLoginRedirect() {
  const redirectPath = getPostLoginRedirect();
  clearPostLoginRedirect();

  if (!redirectPath || !redirectPath.startsWith('/')) {
    return '';
  }

  return redirectPath;
}

export function clearPostLoginRedirect() {
  clearPersistentValue(STORAGE_KEYS.postLoginRedirect);
}

export function subscribeToAuthSessionChange(listener) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorageChange = () => {
    listener(getAuthenticatedUser());
  };

  const handleSessionChange = (event) => {
    listener(event.detail?.session ?? getAuthenticatedUser());
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener(AUTH_SESSION_CHANGE_EVENT, handleSessionChange);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, handleSessionChange);
  };
}
