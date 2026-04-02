import { getAccessToken, getCsrfToken } from '../lib/storage/authStorage.js';

export function serializeBody(body) {
  if (body === undefined || body === null || body instanceof FormData) {
    return body;
  }

  return typeof body === 'object' ? JSON.stringify(body) : body;
}

export function createHeaders(body, customHeaders = {}) {
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

export function appendQuery(path, query) {
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

export async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}
