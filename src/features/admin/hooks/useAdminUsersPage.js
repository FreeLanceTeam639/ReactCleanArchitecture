import { useEffect, useState } from 'react';
import { deleteAdminUser, fetchAdminUserById, fetchAdminUsers, updateAdminUser, updateAdminUserStatus } from '../services/adminService.js';

export function useAdminUsersPage() {
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [verificationStatus, setVerificationStatus] = useState('all');
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
        const response = await fetchAdminUsers({ search, role, status, verificationStatus, page, pageSize: 8 });
        if (!isCancelled) {
          setItems(response.items);
          setMeta(response.meta);
        }
      } catch (nextError) {
        if (!isCancelled) {
          setError(nextError.message || 'Users yüklənmədi.');
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
  }, [search, role, status, verificationStatus, page]);

  const refresh = async () => {
    const response = await fetchAdminUsers({ search, role, status, verificationStatus, page, pageSize: 8 });
    setItems(response.items);
    setMeta(response.meta);
  };

  return {
    search,
    setSearch: (value) => {
      setPage(1);
      setSearch(value);
    },
    role,
    setRole: (value) => {
      setPage(1);
      setRole(value);
    },
    status,
    setStatus: (value) => {
      setPage(1);
      setStatus(value);
    },
    verificationStatus,
    setVerificationStatus: (value) => {
      setPage(1);
      setVerificationStatus(value);
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
    getUserById: fetchAdminUserById,
    saveUser: async (id, values) => {
      await updateAdminUser(id, values);
      setFeedback('User məlumatları yeniləndi.');
      await refresh();
    },
    toggleUserStatus: async (item) => {
      const nextStatus = item.status === 'blocked' ? 'active' : 'blocked';
      await updateAdminUserStatus(item.id, nextStatus);
      setFeedback(`User status ${nextStatus} edildi.`);
      await refresh();
    },
    deleteUser: async (id) => {
      await deleteAdminUser(id);
      setFeedback('User silindi.');
      await refresh();
    }
  };
}
