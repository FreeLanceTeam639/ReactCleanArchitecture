import { useEffect, useState } from 'react';
import { createAdminCategory, deleteAdminCategory, fetchAdminCategories, updateAdminCategory, updateAdminCategoryStatus } from '../services/adminService.js';

export function useAdminCategoriesPage() {
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
        const response = await fetchAdminCategories({ search, status, page, pageSize: 8 });
        if (!isCancelled) {
          setItems(response.items);
          setMeta(response.meta);
        }
      } catch (nextError) {
        if (!isCancelled) {
          setError(nextError.message || 'Categories yüklənmədi.');
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
    const response = await fetchAdminCategories({ search, status, page, pageSize: 8 });
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
    page,
    setPage,
    items,
    meta,
    isLoading,
    error,
    feedback,
    setFeedback,
    refresh,
    createCategory: async (values) => {
      await createAdminCategory(values);
      setFeedback('Yeni category əlavə olundu.');
      await refresh();
    },
    saveCategory: async (id, values) => {
      await updateAdminCategory(id, values);
      setFeedback('Category yeniləndi.');
      await refresh();
    },
    toggleCategoryStatus: async (item) => {
      const nextStatus = item.status === 'active' ? 'inactive' : 'active';
      await updateAdminCategoryStatus(item.id, nextStatus);
      setFeedback(`Category ${nextStatus} edildi.`);
      await refresh();
    },
    deleteCategory: async (id) => {
      await deleteAdminCategory(id);
      setFeedback('Category silindi.');
      await refresh();
    }
  };
}
