import { useEffect, useState } from 'react';
import { deleteAdminJob, fetchAdminJobById, fetchAdminJobs, getAdminCategoryOptions, updateAdminJob, updateAdminJobVisibility } from '../services/adminService.js';

export function useAdminJobsPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 8, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const categoryOptions = getAdminCategoryOptions();

  useEffect(() => {
    let isCancelled = false;
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetchAdminJobs({ search, categoryId, status, page, pageSize: 8 });
        if (!isCancelled) {
          setItems(response.items);
          setMeta(response.meta);
        }
      } catch (nextError) {
        if (!isCancelled) {
          setError(nextError.message || 'Jobs yüklənmədi.');
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
  }, [search, categoryId, status, page]);

  const refresh = async () => {
    const response = await fetchAdminJobs({ search, categoryId, status, page, pageSize: 8 });
    setItems(response.items);
    setMeta(response.meta);
  };

  return {
    search,
    setSearch: (value) => {
      setPage(1);
      setSearch(value);
    },
    categoryId,
    setCategoryId: (value) => {
      setPage(1);
      setCategoryId(value);
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
    categoryOptions,
    refresh,
    getJobById: fetchAdminJobById,
    saveJob: async (id, values) => {
      await updateAdminJob(id, values);
      setFeedback('Job yeniləndi.');
      await refresh();
    },
    toggleVisibility: async (item) => {
      const nextVisibility = item.visibility === 'hidden' ? 'visible' : 'hidden';
      await updateAdminJobVisibility(item.id, nextVisibility);
      setFeedback(`Job ${nextVisibility} edildi.`);
      await refresh();
    },
    deleteJob: async (id) => {
      await deleteAdminJob(id);
      setFeedback('Job silindi.');
      await refresh();
    }
  };
}
