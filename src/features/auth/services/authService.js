import { post } from '../../../shared/api/httpClient.js';
import { API_ENDPOINTS } from '../../../shared/api/endpoints.js';
import { buildMockAuthenticatedUser, TEST_LOGIN_CREDENTIALS } from '../data/mockUsers.js';

export async function loginUser(payload) {
  const normalizedEmail = payload.email?.trim().toLowerCase();

  if (
    normalizedEmail === TEST_LOGIN_CREDENTIALS.email &&
    payload.password === TEST_LOGIN_CREDENTIALS.password
  ) {
    return Promise.resolve(buildMockAuthenticatedUser());
  }

  if (API_ENDPOINTS.auth.login) {
    return post(API_ENDPOINTS.auth.login, payload);
  }

  throw new Error('Test ucun demo login istifade et: demo@workreap.com / google');
}

export async function registerUser(payload) {
  if (!API_ENDPOINTS.auth.register) {
    throw new Error('Register endpoint teyin olunmayib.');
  }

  return post(API_ENDPOINTS.auth.register, payload);
}
