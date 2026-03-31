import { useEffect, useState } from 'react';
import {
  createAdminTalent,
  deleteAdminTalent,
  fetchAdminCategories,
  fetchAdminTalent,
  updateAdminTalent,
  updateAdminTalentFeatured,
  updateAdminTalentStatus
} from '../services/adminService.js';
import { runAdminMutation } from './adminMutation.js';

export function useAdminTalentPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [featured, setFeatured] = useState('all');
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
        const response = await fetchAdminTalent({ search, status, featured, page, pageSize: 8 });

        if (!isCancelled) {
          setItems(response.items);
          setMeta(response.meta);
        }
      } catch (nextError) {
        if (!isCancelled) {
          setError(nextError.message || 'Talent yüklənmədi.');
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
  }, [search, status, featured, page]);

  const refresh = async () => {
    const response = await fetchAdminTalent({ search, status, featured, page, pageSize: 8 });
    setItems(response.items);
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
    featured,
    setFeatured: (value) => {
      setPage(1);
      setFeatured(value);
    },
    page,
    setPage,
    items,
    meta,
    categoryOptions,
    isLoading,
    error,
    feedback,
    setFeedback,
    refresh,
    createTalent: async (values) => runAdminMutation({
      action: () => createAdminTalent(values),
      setError,
      setFeedback,
      successMessage: 'Talent əlavə olundu.',
      errorMessage: 'Talent yaratmaq mümkün olmadı.',
      afterSuccess: refresh
    }),
    saveTalent: async (id, values) => runAdminMutation({
      action: () => updateAdminTalent(id, values),
      setError,
      setFeedback,
      successMessage: 'Talent yeniləndi.',
      errorMessage: 'Talent yeniləmək mümkün olmadı.',
      afterSuccess: refresh
    }),
    toggleTalentStatus: async (item) => {
      const nextStatus = item.status === 'active' ? 'inactive' : 'active';

      return runAdminMutation({
        action: () => updateAdminTalentStatus(item.id, nextStatus),
        setError,
        setFeedback,
        successMessage: `Talent ${nextStatus} edildi.`,
        errorMessage: 'Talent statusunu dəyişdirmək mümkün olmadı.',
        afterSuccess: refresh
      });
    },
    toggleTalentFeatured: async (item) => runAdminMutation({
      action: () => updateAdminTalentFeatured(item.id, !item.featured),
      setError,
      setFeedback,
      successMessage: item.featured ? 'Featured status çıxarıldı.' : 'Talent featured edildi.',
      errorMessage: 'Talent featured statusunu dəyişdirmək mümkün olmadı.',
      afterSuccess: refresh
    }),
    deleteTalent: async (id) => runAdminMutation({
      action: () => deleteAdminTalent(id),
      setError,
      setFeedback,
      successMessage: 'Talent silindi.',
      errorMessage: 'Talent silmək mümkün olmadı.',
      afterSuccess: refresh
    })
  };
}
