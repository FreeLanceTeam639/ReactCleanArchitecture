import { getAccessToken, getCsrfToken, clearAuthenticatedUser } from '../lib/storage/authStorage.js';
import { API_BASE_URL } from './endpoints.js';

function serializeBody(body) {
  if (body === undefined || body === null || body instanceof FormData) {
    return body;
  }

  return typeof body === 'object' ? JSON.stringify(body) : body;
}

function createHeaders(body, customHeaders = {}) {
  const accessToken = getAccessToken();
  const csrfToken = getCsrfToken();

  return {
    Accept: 'application/json',
    ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
    ...customHeaders
  };
}

function appendQuery(path, query) {
  if (!query || typeof query !== 'object' || Array.isArray(query)) {
    return path;
  }

  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== '') {
          searchParams.append(key, String(item));
        }
      });
      return;
    }

    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();

  if (!queryString) {
    return path;
  }

  return `${path}${path.includes('?') ? '&' : '?'}${queryString}`;
}

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

async function request(path, options = {}) {
  const { query, ...fetchOptions } = options;
  const finalPath = appendQuery(path, query);
  const response = await fetch(`${API_BASE_URL}${finalPath}`, {
    credentials: 'include',
    ...fetchOptions,
    headers: createHeaders(fetchOptions.body, fetchOptions.headers),
    body: serializeBody(fetchOptions.body)
  });

  const payload = await parseResponse(response);

  if (response.status === 401) {
    clearAuthenticatedUser();
  }

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
  },
  put(path, body, options) {
    return request(path, { ...options, method: 'PUT', body });
  },
  patch(path, body, options) {
    return request(path, { ...options, method: 'PATCH', body });
  },
  delete(path, options) {
    return request(path, { ...options, method: 'DELETE' });
  }
};

export async function post(endpoint, body, options = {}) {
  return httpClient.post(endpoint, body, options);
}
