import { useEffect, useMemo, useState } from 'react';
import { fetchAdminAuditLogs } from '../services/adminService.js';

const BASE_CATEGORY_OPTIONS = [
  { value: 'all', label: 'All sections' },
  { value: 'Autentifikasiya', label: 'Authentication' },
  { value: 'Profil', label: 'Profile' },
  { value: 'Verifikasiya', label: 'Verification' },
  { value: 'Workspace', label: 'Workspace' },
  { value: 'Media', label: 'Media' },
  { value: 'Admin / Dashboard', label: 'Admin Dashboard' },
  { value: 'Admin / İstifadəçilər', label: 'Admin Users' },
  { value: 'Admin / Kateqoriyalar', label: 'Admin Categories' },
  { value: 'Admin / Verifikasiya', label: 'Admin Verification' },
  { value: 'Audit log', label: 'Audit Log' },
  { value: 'Fallback', label: 'Fallback' },
  { value: 'Realtime', label: 'Realtime' }
];

export function useAdminAuditLogsPage() {
  const [search, setSearch] = useState('');
  const [actorType, setActorType] = useState('all');
  const [category, setCategory] = useState('all');
  const [result, setResult] = useState('all');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let isCancelled = false;

    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetchAdminAuditLogs({
          search,
          actorType,
          category,
          result,
          take: 200
        });

        if (!isCancelled) {
          setItems(response);
        }
      } catch (nextError) {
        if (!isCancelled) {
          setError(nextError?.message || 'Audit logs could not be loaded.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 200);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [search, actorType, category, result]);

  const summary = useMemo(() => ({
    total: items.length,
    successful: items.filter((item) => item.isSuccessful).length,
    failed: items.filter((item) => !item.isSuccessful).length,
    adminActions: items.filter((item) => item.actorType === 'Admin').length,
    userActions: items.filter((item) => item.actorType === 'İstifadəçi').length,
    anonymous: items.filter((item) => item.actorType === 'Anonim').length
  }), [items]);

  const categoryOptions = useMemo(() => {
    const dynamicOptions = Array.from(
      new Set(items.map((item) => item.category).filter(Boolean))
    ).map((value) => ({ value, label: value }));

    const merged = [...BASE_CATEGORY_OPTIONS];

    dynamicOptions.forEach((option) => {
      if (!merged.some((item) => item.value === option.value)) {
        merged.push(option);
      }
    });

    return merged;
  }, [items]);

  const refresh = async () => {
    const response = await fetchAdminAuditLogs({
      search,
      actorType,
      category,
      result,
      take: 200
    });
    setItems(response);
    setFeedback('Audit logs refreshed.');
  };

  return {
    search,
    setSearch,
    actorType,
    setActorType,
    category,
    setCategory,
    result,
    setResult,
    items,
    summary,
    categoryOptions,
    isLoading,
    error,
    feedback,
    setFeedback,
    refresh
  };
}
