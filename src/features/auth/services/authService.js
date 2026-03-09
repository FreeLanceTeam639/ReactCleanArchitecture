import { authEndpoints } from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';

/*
  NOTE: bu fetch hissəsi backend endpoint tələb edir
  TODO: API inteqrasiyası tamamlanmalıdır
  NOTE: login request body hazırda { email, password, rememberMe } formatını gözləyir
*/

export function loginUser(credentials) {
  return httpClient.post(authEndpoints.login, credentials);
}
