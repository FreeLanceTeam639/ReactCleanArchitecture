import { useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { fetchOrders } from '../services/workspaceService.js';

export function useOrdersPage(navigate) {
  const [filters, setFilters] = useState({ search: '', status: 'all', role: 'all', sort: 'updated' });
  const [state, setState] = useState({ items: [], summary: null, isLoading: true, error: '' });

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      navigate(ROUTES.login);
      return;
    }

    let cancelled = false;
    setState((current) => ({ ...current, isLoading: true, error: '' }));

    fetchOrders(filters)
      .then((payload) => {
        if (!cancelled) {
          setState({ items: payload.items || [], summary: payload.summary || null, isLoading: false, error: '' });
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setState({ items: [], summary: null, isLoading: false, error: error?.message || 'Orders could not be loaded.' });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filters, navigate]);

  const setFilterValue = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return { ...state, filters, setFilterValue };
}
