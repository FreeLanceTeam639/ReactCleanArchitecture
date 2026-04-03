import { clearAuthenticatedUser } from '../lib/storage/authStorage.js';
import { API_BASE_URL } from './endpoints.js';
import { extractErrorMessage } from './errorMessages.js';
import { appendQuery, createHeaders, extractFileName, parseResponse, serializeBody } from './requestHelpers.js';

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
    throw new Error(extractErrorMessage(payload, response.status));
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
  },
  async download(path, options = {}) {
    const { query, ...fetchOptions } = options;
    const finalPath = appendQuery(path, query);
    const response = await fetch(`${API_BASE_URL}${finalPath}`, {
      credentials: 'include',
      ...fetchOptions,
      headers: createHeaders(undefined, fetchOptions.headers)
    });

    if (response.status === 401) {
      clearAuthenticatedUser();
    }

    if (!response.ok) {
      const payload = await parseResponse(response);
      throw new Error(extractErrorMessage(payload, response.status));
    }

    return {
      blob: await response.blob(),
      fileName: extractFileName(response.headers.get('content-disposition')),
      contentType: response.headers.get('content-type') || 'application/octet-stream'
    };
  }
};

export async function post(endpoint, body, options = {}) {
  return httpClient.post(endpoint, body, options);
}
