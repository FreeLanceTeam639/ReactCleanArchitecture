import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { fetchExploreMembers } from '../services/exploreService.js';

const initialFilters = {
  keyword: '',
  seller: '',
  category: 'all',
  duration: 'all',
  minBudget: '',
  maxBudget: '',
  sort: 'recent'
};

export function useExploreMembersPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({
    totalMembers: 0,
    totalTasks: 0,
    categories: [],
    durations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const deferredKeyword = useDeferredValue(filters.keyword);
  const deferredSeller = useDeferredValue(filters.seller);

  const query = useMemo(
    () => ({
      search: deferredKeyword || undefined,
      seller: deferredSeller || undefined,
      category: filters.category !== 'all' ? filters.category : undefined,
      duration: filters.duration !== 'all' ? filters.duration : undefined,
      minBudget: filters.minBudget !== '' ? Number(filters.minBudget) : undefined,
      maxBudget: filters.maxBudget !== '' ? Number(filters.maxBudget) : undefined,
      sort: filters.sort
    }),
    [deferredKeyword, deferredSeller, filters.category, filters.duration, filters.maxBudget, filters.minBudget, filters.sort]
  );

  useEffect(() => {
    let isCancelled = false;

    async function load() {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetchExploreMembers(query);

        if (isCancelled) {
          return;
        }

        setItems(response.items);
        setMeta({
          totalMembers: response.totalMembers,
          totalTasks: response.totalTasks,
          categories: response.categories,
          durations: response.durations
        });
      } catch (nextError) {
        if (!isCancelled) {
          setItems([]);
          setMeta({
            totalMembers: 0,
            totalTasks: 0,
            categories: [],
            durations: []
          });
          setError(nextError?.message || 'Explore members could not be loaded right now.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isCancelled = true;
    };
  }, [query]);

  return {
    filters,
    items,
    meta,
    isLoading,
    error,
    setFilterValue: (field, value) => {
      setFilters((currentState) => ({
        ...currentState,
        [field]: value
      }));
    },
    resetFilters: () => {
      setFilters(initialFilters);
    }
  };
}
