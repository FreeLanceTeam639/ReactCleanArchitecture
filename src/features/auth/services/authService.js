import { httpClient } from '../../../shared/api/httpClient.js';
import { API_ENDPOINTS } from '../../../shared/api/endpoints.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';
import { buildDemoSession, buildMockProfile, TEST_LOGIN_CREDENTIALS } from '../data/mockUsers.js';

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
    expiresAt: sessionSource.expiresAt || root.expiresAt || null,
    authType:
      sessionSource.authType || root.authType || (sessionSource.accessToken || sessionSource.token ? 'token' : 'cookie'),
    rememberMe: Boolean(rememberMe)
  };
}

export async function loginUser(payload) {
  const normalizedEmail = payload.email?.trim().toLowerCase();

  if (
    normalizedEmail === TEST_LOGIN_CREDENTIALS.email &&
    payload.password === TEST_LOGIN_CREDENTIALS.password
  ) {
    return {
      session: buildDemoSession(payload.rememberMe),
      profile: buildMockProfile()
    };
  }

  const response = await httpClient.post(API_ENDPOINTS.auth.login, payload);

  return {
    session: normalizeAuthSession(response, payload.rememberMe),
    profile: extractEntity(response, ['user', 'profile']) || null
  };
}

export async function registerUser(payload) {
  return httpClient.post(API_ENDPOINTS.auth.register, payload);
}

export async function logoutUser() {
  return httpClient.post(API_ENDPOINTS.auth.logout, {});
}
