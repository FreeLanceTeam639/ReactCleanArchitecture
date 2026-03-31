import { useEffect, useState } from 'react';
import {
  deleteAdminUser,
  fetchAdminUserById,
  fetchAdminUsers,
  updateAdminUser,
  updateAdminUserPassword,
  updateAdminUserStatus
} from '../services/adminService.js';
import { emitToastEvent } from '../../../shared/ui/toast/toastBus.js';
import { runAdminMutation } from './adminMutation.js';

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
    saveUser: async (id, values) => runAdminMutation({
      action: () => updateAdminUser(id, values),
      setError,
      setFeedback,
      successMessage: 'User məlumatları yeniləndi.',
      errorMessage: 'User məlumatlarını yeniləmək mümkün olmadı.',
      afterSuccess: refresh
    }),
    changeUserPassword: async (id, values) => {
      try {
        const response = await updateAdminUserPassword(id, values);
        setFeedback('User sifresi yenilendi.');
        emitToastEvent({
          tone: 'success',
          title: 'Sifre yenilendi',
          message: 'Secdiyiniz user ucun yeni sifre yadda saxlandi.'
        });
        return response;
      } catch (error) {
        const nextMessage = error?.message || 'User sifresini yenilemek mumkun olmadi.';
        setError(nextMessage);
        emitToastEvent({
          tone: 'error',
          title: 'Sifre yenilenmedi',
          message: nextMessage
        });
        return null;
      }
    },
    toggleUserStatus: async (item) => {
      const nextStatus = item.status === 'blocked' ? 'active' : 'blocked';

      return runAdminMutation({
        action: () => updateAdminUserStatus(item.id, nextStatus),
        setError,
        setFeedback,
        successMessage: `User status ${nextStatus} edildi.`,
        errorMessage: 'User statusunu dəyişdirmək mümkün olmadı.',
        afterSuccess: refresh
      });
    },
    deleteUser: async (id) => runAdminMutation({
      action: () => deleteAdminUser(id),
      setError,
      setFeedback,
      successMessage: 'User silindi.',
      errorMessage: 'User silmək mümkün olmadı.',
      afterSuccess: refresh
    })
  };
}
