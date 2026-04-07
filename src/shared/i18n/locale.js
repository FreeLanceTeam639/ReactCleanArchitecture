import { STORAGE_KEYS } from '../constants/storageKeys.js';

export const DEFAULT_LANGUAGE = 'en';

export const DEFAULT_LANGUAGE_OPTIONS = [
  { value: 'az', label: 'AZ', nativeLabel: 'Azərbaycan dili', locale: 'az-AZ' },
  { value: 'ru', label: 'RU', nativeLabel: 'Русский', locale: 'ru-RU' },
  { value: 'en', label: 'EN', nativeLabel: 'English', locale: 'en-US' }
];

export const SUPPORTED_LANGUAGES = DEFAULT_LANGUAGE_OPTIONS.map((item) => item.value);

export const LANGUAGE_TO_LOCALE = DEFAULT_LANGUAGE_OPTIONS.reduce((result, item) => {
  result[item.value] = item.locale;
  return result;
}, {});

export function sanitizeLanguage(value, supportedLanguages = SUPPORTED_LANGUAGES) {
  return supportedLanguages.includes(value) ? value : DEFAULT_LANGUAGE;
}

export function getLocaleFromLanguage(language = DEFAULT_LANGUAGE) {
  return LANGUAGE_TO_LOCALE[sanitizeLanguage(language)] || LANGUAGE_TO_LOCALE[DEFAULT_LANGUAGE];
}

export function getStoredLanguage() {
  if (typeof window === 'undefined') {
    return DEFAULT_LANGUAGE;
  }

  try {
    return sanitizeLanguage(window.localStorage.getItem(STORAGE_KEYS.language));
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

export function setStoredLanguage(language) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEYS.language, sanitizeLanguage(language));
  } catch {
    // ignore storage errors
  }
}

export function getCurrentLocale() {
  return getLocaleFromLanguage(getStoredLanguage());
}
