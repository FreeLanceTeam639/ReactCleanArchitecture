import { useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import {
  fetchWorkspaceNotifications,
  markAllWorkspaceNotificationsRead,
  markWorkspaceNotificationRead
} from '../services/workspaceService.js';

export function useNotificationsPage(navigate) {
  const [filters, setFilters] = useState({ search: '', type: 'all', state: 'all' });
  const [state, setState] = useState({ items: [], summary: null, isLoading: true, error: '', busyKey: '' });

  const load = async () => {
    setState((current) => ({ ...current, isLoading: true, error: '' }));
    try {
      const payload = await fetchWorkspaceNotifications(filters);
      setState((current) => ({ ...current, items: payload.items || [], summary: payload.summary || null, isLoading: false }));
    } catch (error) {
      setState((current) => ({ ...current, items: [], summary: null, isLoading: false, error: error?.message || 'Notifications could not be loaded.' }));
    }
  };

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      navigate(ROUTES.login);
      return;
    }

    load();
  }, [filters, navigate]);

  const setFilterValue = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const markOne = async (notificationId) => {
    setState((current) => ({ ...current, busyKey: `notification:${notificationId}` }));
    await markWorkspaceNotificationRead(notificationId);
    await load();
    setState((current) => ({ ...current, busyKey: '' }));
  };

  const markAll = async () => {
    setState((current) => ({ ...current, busyKey: 'all' }));
    await markAllWorkspaceNotificationsRead();
    await load();
    setState((current) => ({ ...current, busyKey: '' }));
  };

  return { filters, setFilterValue, markOne, markAll, ...state };
}
