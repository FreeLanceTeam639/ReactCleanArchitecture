import { API_ENDPOINTS } from './endpoints.js';
import { httpClient } from './httpClient.js';
import { extractCollection } from '../lib/response/extractCollection.js';
import { extractEntity } from '../lib/response/extractEntity.js';

const fallbackCountries = [
  { iso2: 'AZ', name: 'Azerbaijan', dialCode: '+994' },
  { iso2: 'TR', name: 'Turkey', dialCode: '+90' },
  { iso2: 'GE', name: 'Georgia', dialCode: '+995' },
  { iso2: 'RU', name: 'Russia', dialCode: '+7' },
  { iso2: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { iso2: 'US', name: 'United States', dialCode: '+1' }
];

let countriesCache = null;
let countriesPromise = null;

function normalizeCountry(item = {}) {
  const iso2 = String(item.iso2 || item.code || '').trim().toUpperCase();
  const name = String(item.name || item.label || '').trim();
  const dialCode = String(item.dialCode || item.phoneCode || '').trim();

  if (!iso2 || !name || !dialCode) {
    return null;
  }

  return {
    iso2,
    name,
    dialCode
  };
}

export function getFallbackCountries() {
  return fallbackCountries;
}

export async function fetchCountryCatalog() {
  if (Array.isArray(countriesCache) && countriesCache.length) {
    return countriesCache;
  }

  if (countriesPromise) {
    return countriesPromise;
  }

  countriesPromise = httpClient
    .get(API_ENDPOINTS.reference.countries)
    .then((payload) => {
      const entity = extractEntity(payload, ['data', 'result', 'payload']) || payload;
      const items = extractCollection(extractEntity(entity, ['countries', 'items', 'data']) || entity)
        .map(normalizeCountry)
        .filter(Boolean)
        .sort((left, right) => left.name.localeCompare(right.name));

      countriesCache = items.length ? items : fallbackCountries;
      return countriesCache;
    })
    .catch(() => {
      countriesCache = fallbackCountries;
      return countriesCache;
    })
    .finally(() => {
      countriesPromise = null;
    });

  return countriesPromise;
}
