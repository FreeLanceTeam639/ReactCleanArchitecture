import { useEffect, useState } from 'react';
import { createAdminTalent, deleteAdminTalent, fetchAdminTalent, updateAdminTalent, updateAdminTalentFeatured, updateAdminTalentStatus } from '../services/adminService.js';

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
    isLoading,
    error,
    feedback,
    setFeedback,
    refresh,
    createTalent: async (values) => {
      await createAdminTalent(values);
      setFeedback('Talent əlavə olundu.');
      await refresh();
    },
    saveTalent: async (id, values) => {
      await updateAdminTalent(id, values);
      setFeedback('Talent yeniləndi.');
      await refresh();
    },
    toggleTalentStatus: async (item) => {
      const nextStatus = item.status === 'active' ? 'inactive' : 'active';
      await updateAdminTalentStatus(item.id, nextStatus);
      setFeedback(`Talent ${nextStatus} edildi.`);
      await refresh();
    },
    toggleTalentFeatured: async (item) => {
      await updateAdminTalentFeatured(item.id, !item.featured);
      setFeedback(item.featured ? 'Featured status çıxarıldı.' : 'Talent featured edildi.');
      await refresh();
    },
    deleteTalent: async (id) => {
      await deleteAdminTalent(id);
      setFeedback('Talent silindi.');
      await refresh();
    }
  };
}
