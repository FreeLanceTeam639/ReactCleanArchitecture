import { API_BASE_URL, mediaEndpoints } from './endpoints.js';
import { httpClient } from './httpClient.js';
import { extractEntity } from '../lib/response/extractEntity.js';

const supportedImageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const apiOrigin = (() => {
  try {
    const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    return new URL(API_BASE_URL, fallbackOrigin).origin;
  } catch {
    return '';
  }
})();

function sanitizeUrl(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function isAbsoluteUrl(value) {
  return /^https?:\/\//i.test(sanitizeUrl(value));
}

export function isDataUrl(value) {
  return /^data:/i.test(sanitizeUrl(value));
}

export function resolveApiAssetUrl(value) {
  const trimmedValue = sanitizeUrl(value);

  if (!trimmedValue || isAbsoluteUrl(trimmedValue) || isDataUrl(trimmedValue)) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith('/')) {
    return apiOrigin ? `${apiOrigin}${trimmedValue}` : trimmedValue;
  }

  return trimmedValue;
}

export function stripApiOriginFromAssetUrl(value) {
  const trimmedValue = sanitizeUrl(value);

  if (!trimmedValue || isDataUrl(trimmedValue) || !apiOrigin) {
    return trimmedValue;
  }

  try {
    const parsedUrl = new URL(trimmedValue);

    if (parsedUrl.origin === apiOrigin && parsedUrl.pathname.startsWith('/api/')) {
      return `${parsedUrl.pathname}${parsedUrl.search}`;
    }
  } catch {
    return trimmedValue;
  }

  return trimmedValue;
}

function getFileExtension(contentType) {
  switch ((contentType || '').toLowerCase()) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'image/png':
    default:
      return 'png';
  }
}

function dataUrlToFile(dataUrl, fileNamePrefix = 'image') {
  const trimmedValue = sanitizeUrl(dataUrl);
  const [metadata, encodedData] = trimmedValue.split(',');

  if (!metadata || !encodedData) {
    throw new Error('Image preview data is invalid.');
  }

  const mimeType = metadata.match(/data:(.*?);base64/i)?.[1] || 'image/png';

  if (!supportedImageMimeTypes.has(mimeType.toLowerCase())) {
    throw new Error('Only JPG, PNG and WEBP images can be uploaded.');
  }

  const binary = window.atob(encodedData);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], `${fileNamePrefix}.${getFileExtension(mimeType)}`, { type: mimeType });
}

export async function uploadImageDataUrl(dataUrl, fileNamePrefix = 'image') {
  const formData = new FormData();
  formData.append('file', dataUrlToFile(dataUrl, fileNamePrefix));

  const payload = await httpClient.post(mediaEndpoints.uploadImage, formData);
  const entity = extractEntity(payload, ['data', 'item', 'result']) || payload;

  return sanitizeUrl(entity.url || entity.path || entity.imageUrl || '');
}

export async function ensureUploadedImage(value, fileNamePrefix = 'image') {
  const trimmedValue = sanitizeUrl(value);

  if (!trimmedValue) {
    return '';
  }

  if (isDataUrl(trimmedValue)) {
    return uploadImageDataUrl(trimmedValue, fileNamePrefix);
  }

  return trimmedValue;
}
