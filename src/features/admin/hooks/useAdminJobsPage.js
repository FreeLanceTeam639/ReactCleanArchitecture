import { useEffect, useState } from 'react';
import {
  deleteAdminJob,
  fetchAdminCategories,
  fetchAdminJobById,
  fetchAdminJobs,
  updateAdminJob,
  updateAdminJobVisibility
} from '../services/adminService.js';
import { runAdminMutation } from './adminMutation.js';

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
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    fetchAdminCategories({ status: 'active', page: 1, pageSize: 100 })
      .then((response) => {
        if (!isCancelled) {
          setCategoryOptions(response.items || []);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setCategoryOptions([]);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

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
    saveJob: async (id, values) => runAdminMutation({
      action: () => updateAdminJob(id, values),
      setError,
      setFeedback,
      successMessage: 'Job yeniləndi.',
      errorMessage: 'Job yeniləmək mümkün olmadı.',
      afterSuccess: refresh
    }),
    toggleVisibility: async (item) => {
      const nextVisibility = item.visibility === 'hidden' ? 'visible' : 'hidden';

      return runAdminMutation({
        action: () => updateAdminJobVisibility(item.id, nextVisibility),
        setError,
        setFeedback,
        successMessage: `Job ${nextVisibility} edildi.`,
        errorMessage: 'Job görünürlüğünü dəyişdirmək mümkün olmadı.',
        afterSuccess: refresh
      });
    },
    deleteJob: async (id) => runAdminMutation({
      action: () => deleteAdminJob(id),
      setError,
      setFeedback,
      successMessage: 'Job silindi.',
      errorMessage: 'Job silmək mümkün olmadı.',
      afterSuccess: refresh
    })
  };
}
