import { post } from '../../../shared/api/httpClient.js';
import { API_ENDPOINTS } from '../../../shared/api/endpoints.js';

export async function loginUser(payload) {
  // NOTE: bu fetch hissəsi backend endpoint tələb edir
  // TODO: API inteqrasiyası tamamlanmalıdır
  return post(API_ENDPOINTS.auth.login, payload);
}

export async function registerUser(payload) {
  // NOTE: bu fetch hissəsi backend endpoint tələb edir
  // TODO: real endpoint əlavə olunmalıdır
  // TODO: API inteqrasiyası tamamlanmalıdır
  return post(API_ENDPOINTS.auth.register, payload);
}