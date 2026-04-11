import { useCallback, useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { fetchOrders } from '../services/workspaceService.js';

export function useOrdersPage(navigate) {
  const [filters, setFilters] = useState({ search: '', status: 'all', role: 'all', sort: 'updated' });
  const [state, setState] = useState({ items: [], summary: null, isLoading: true, error: '' });
  const [reloadKey, setReloadKey] = useState(0);

  const reloadOrders = useCallback(() => {
    setReloadKey((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      navigate(ROUTES.login);
      return;
    }

    let cancelled = false;
    let refreshTimer;

    const loadOrders = async (silent = false) => {
      if (!silent) {
        setState((current) => ({ ...current, isLoading: true, error: '' }));
      }

      try {
        const payload = await fetchOrders(filters);

        if (cancelled) {
          return;
        }

        const items = payload.items || [];
        setState({
          items,
          summary: payload.summary || null,
          isLoading: false,
          error: ''
        });
      } catch (error) {
        if (!cancelled) {
          setState((current) => ({
            items: silent ? current.items : [],
            summary: silent ? current.summary : null,
            isLoading: false,
            error: error?.message || 'Orders could not be loaded.'
          }));
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
      if (refreshTimer) {
        window.clearTimeout(refreshTimer);
      }
    };
  }, [filters, navigate, reloadKey]);

  const setFilterValue = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return { ...state, filters, setFilterValue, reloadOrders };
}
