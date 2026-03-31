import { useEffect, useState } from 'react';
import {
  createAdminPricing,
  deleteAdminPricing,
  fetchAdminPricing,
  getPricingSummary,
  updateAdminPricing
} from '../services/adminService.js';
import { runAdminMutation } from './adminMutation.js';

export function useAdminPricingPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 8, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let isCancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetchAdminPricing({ search, status, page, pageSize: 8 });

        if (!isCancelled) {
          setItems(getPricingSummary(response.items));
          setMeta(response.meta);
        }
      } catch (nextError) {
        if (!isCancelled) {
          setError(nextError.message || 'Pricing yüklənmədi.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 220);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [search, status, page]);

  const refresh = async () => {
    const response = await fetchAdminPricing({ search, status, page, pageSize: 8 });
    setItems(getPricingSummary(response.items));
    setMeta(response.meta);
  };

  return {
    search,
    setSearch: (value) => {
      setPage(1);
      setSearch(value);
    },
    status,
    setStatus: (value) => {
      setPage(1);
      setStatus(value);
    },
    page,
    setPage,
    items,
    meta,
    isLoading,
    error,
    feedback,
    setFeedback,
    refresh,
    createPricing: async (values) => runAdminMutation({
      action: () => createAdminPricing(values),
      setError,
      setFeedback,
      successMessage: 'Package əlavə olundu.',
      errorMessage: 'Package yaratmaq mümkün olmadı.',
      afterSuccess: refresh
    }),
    savePricing: async (id, values) => runAdminMutation({
      action: () => updateAdminPricing(id, values),
      setError,
      setFeedback,
      successMessage: 'Package yeniləndi.',
      errorMessage: 'Package yeniləmək mümkün olmadı.',
      afterSuccess: refresh
    }),
    deletePricing: async (id) => runAdminMutation({
      action: () => deleteAdminPricing(id),
      setError,
      setFeedback,
      successMessage: 'Package silindi.',
      errorMessage: 'Package silmək mümkün olmadı.',
      afterSuccess: refresh
    })
  };
}
