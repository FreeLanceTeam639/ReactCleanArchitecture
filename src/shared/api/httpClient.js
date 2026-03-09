import { API_BASE_URL } from './endpoints.js';

function serializeBody(body) {
  if (body === undefined || body === null || body instanceof FormData) {
    return body;
  }

  return typeof body === 'object' ? JSON.stringify(body) : body;
}

// TODO: token tələb olunarsa Authorization header burada mərkəzləşdirilməlidir
function createHeaders(body, customHeaders = {}) {
  return {
    Accept: 'application/json',
    ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...customHeaders
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: createHeaders(options.body, options.headers),
    body: serializeBody(options.body)
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof payload === 'string'
        ? payload
        : payload?.message || payload?.error || `HTTP ${response.status}`
    );
  }

  return payload;
}

export const httpClient = {
  get(path, options) {
    return request(path, { ...options, method: 'GET' });
  },
  post(path, body, options) {
    return request(path, { ...options, method: 'POST', body });
  }
};
