import { STORAGE_KEYS } from '../../constants/storageKeys.js';

export function saveAuthenticatedUser(userPayload, rememberMe) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEYS.authenticatedUser, JSON.stringify(userPayload));
}
