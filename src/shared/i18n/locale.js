import { STORAGE_KEYS } from '../constants/storageKeys.js';

export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = ['az', 'ru', 'en'];

export const LANGUAGE_TO_LOCALE = {
  az: 'az-AZ',
  ru: 'ru-RU',
  en: 'en-US'
};

export function sanitizeLanguage(value) {
  return SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;
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
