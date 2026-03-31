const DEFAULT_COUNTRY_NAME = 'Azerbaijan';
const DEFAULT_DIAL_CODE = '+994';

function digitsOnly(value = '') {
  return String(value).replace(/\D/g, '');
}

function sortByDialCodeLength(countries = []) {
  return [...countries].sort(
    (left, right) => digitsOnly(right.dialCode).length - digitsOnly(left.dialCode).length
  );
}

export function findCountryByName(countries = [], countryName = '') {
  const normalizedCountryName = String(countryName || '').trim().toLowerCase();

  if (!normalizedCountryName) {
    return null;
  }

  return (
    countries.find((country) => country.name.toLowerCase() === normalizedCountryName) ||
    countries.find((country) => country.iso2.toLowerCase() === normalizedCountryName) ||
    null
  );
}

export function getDefaultCountry(countries = []) {
  return (
    findCountryByName(countries, DEFAULT_COUNTRY_NAME) ||
    countries[0] ||
    { iso2: 'AZ', name: DEFAULT_COUNTRY_NAME, dialCode: DEFAULT_DIAL_CODE }
  );
}

export function getCountryDialCode(countries = [], countryName = '') {
  return findCountryByName(countries, countryName)?.dialCode || getDefaultCountry(countries).dialCode;
}

export function detectCountryByPhoneValue(countries = [], phoneNumber = '') {
  const digits = digitsOnly(phoneNumber);

  if (!digits) {
    return null;
  }

  return (
    sortByDialCodeLength(countries).find((country) => digits.startsWith(digitsOnly(country.dialCode))) ||
    null
  );
}

export function extractLocalPhoneNumber(phoneNumber = '', countryName = '', countries = []) {
  const digits = digitsOnly(phoneNumber);

  if (!digits) {
    return '';
  }

  const resolvedCountry = findCountryByName(countries, countryName) || detectCountryByPhoneValue(countries, phoneNumber);

  if (!resolvedCountry) {
    return digits.replace(/^0+/, '');
  }

  const dialDigits = digitsOnly(resolvedCountry.dialCode);
  const localDigits = digits.startsWith(dialDigits) ? digits.slice(dialDigits.length) : digits;

  return localDigits.replace(/^0+/, '');
}

export function buildPhoneNumberValue(countryName = '', localPhoneNumber = '', countries = []) {
  const localDigits = digitsOnly(localPhoneNumber).replace(/^0+/, '');

  if (!localDigits) {
    return '';
  }

  const dialCode = getCountryDialCode(countries, countryName);
  return `${dialCode} ${localDigits}`;
}

export function syncPhoneNumberToCountry(phoneNumber = '', currentCountry = '', nextCountry = '', countries = []) {
  const localDigits = extractLocalPhoneNumber(phoneNumber, currentCountry, countries);
  return buildPhoneNumberValue(nextCountry, localDigits, countries);
}
