import { useEffect, useMemo, useState } from 'react';
import { fetchCountryCatalog, getFallbackCountries } from '../api/referenceService.js';
import { getDefaultCountry } from '../lib/forms/countryPhone.js';

export function useCountryDirectory() {
  const [countries, setCountries] = useState(getFallbackCountries);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    fetchCountryCatalog()
      .then((items) => {
        if (!isCancelled && Array.isArray(items) && items.length) {
          setCountries(items);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  const defaultCountry = useMemo(() => getDefaultCountry(countries), [countries]);

  return {
    countries,
    isLoading,
    defaultCountry
  };
}
