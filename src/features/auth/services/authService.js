import { httpClient } from '../../../shared/api/httpClient.js';
import { API_ENDPOINTS } from '../../../shared/api/endpoints.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';
import { getRefreshToken } from '../../../shared/lib/storage/authStorage.js';

function normalizeAuthSession(payload, rememberMe) {
  const root = extractEntity(payload, ['data', 'result', 'payload']) || {};
  const sessionSource = extractEntity(root, ['session', 'auth', 'tokens']) || root;

  return {
    accessToken:
      sessionSource.accessToken ||
      sessionSource.token ||
      sessionSource.access_token ||
      root.accessToken ||
      root.token ||
      root.access_token ||
      null,
    refreshToken:
      sessionSource.refreshToken ||
      sessionSource.refresh_token ||
      root.refreshToken ||
      root.refresh_token ||
      null,
    csrfToken: sessionSource.csrfToken || root.csrfToken || null,
    expiresAt:
      sessionSource.expiresAt ||
      sessionSource.accessTokenExpiresAt ||
      root.expiresAt ||
      root.accessTokenExpiresAt ||
      null,
    refreshTokenExpiresAt:
      sessionSource.refreshTokenExpiresAt || root.refreshTokenExpiresAt || null,
    authType:
      sessionSource.authType || root.authType || (sessionSource.accessToken || sessionSource.token ? 'token' : 'cookie'),
    rememberMe: Boolean(rememberMe),
    user: extractEntity(root, ['user', 'profile']) || null
  };
}

export async function loginUser(payload) {
  const response = await httpClient.post(API_ENDPOINTS.auth.login, payload);

  return normalizeAuthSession(response, payload.rememberMe);
}

export async function registerUser(payload) {
  return httpClient.post(API_ENDPOINTS.auth.register, payload);
}

export async function logoutUser(refreshToken = getRefreshToken()) {
  return httpClient.post(API_ENDPOINTS.auth.logout, { refreshToken });
}
