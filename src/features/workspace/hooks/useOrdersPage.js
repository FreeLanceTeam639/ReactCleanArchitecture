import { useCallback, useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { fetchOrders, updateWorkspaceOrder } from '../services/workspaceService.js';

export function useOrdersPage(navigate) {
  const [filters, setFilters] = useState({ search: '', status: 'all', role: 'all', sort: 'updated' });
  const [state, setState] = useState({ items: [], summary: null, isLoading: true, error: '' });
  const [busyAction, setBusyAction] = useState('');
  const [actionFeedback, setActionFeedback] = useState('');
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

  const runOrderAction = async (orderId, action, note = '') => {
    const busyKey = `${orderId}:${action}`;
    setBusyAction(busyKey);
    setActionFeedback('');

    try {
      const result = await updateWorkspaceOrder(orderId, action, note);
      setState((current) => ({
        ...current,
        items: current.items.map((item) => (String(item.id) === String(orderId) ? { ...item, ...result.order } : item))
      }));
      setActionFeedback(result.message || 'Order updated successfully.');
      reloadOrders();
      return result;
    } catch (error) {
      const message = error?.message || 'Order action could not be completed.';
      setActionFeedback(message);
      throw error;
    } finally {
      setBusyAction('');
    }
  };

  return { ...state, filters, busyAction, actionFeedback, setFilterValue, reloadOrders, runOrderAction };
}
