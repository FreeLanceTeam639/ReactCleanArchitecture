import { useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useToast } from '../../../shared/hooks/useToast.js';
import { createWorkspaceNotificationSubscription } from '../../../shared/realtime/workspaceNotificationHub.js';
import {
  fetchWorkspaceNotifications,
  markAllWorkspaceNotificationsRead,
  markWorkspaceNotificationRead
} from '../services/workspaceService.js';

export function useNotificationsPage(navigate) {
  const toast = useToast();
  const [filters, setFilters] = useState({ search: '', type: 'all', state: 'all' });
  const [state, setState] = useState({ items: [], summary: null, isLoading: true, error: '', busyKey: '' });
  const [refreshKey, setRefreshKey] = useState(0);

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
  }, [filters, navigate, refreshKey]);

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      return () => {};
    }

    return createWorkspaceNotificationSubscription((event) => {
      if (event?.type && event.type !== 'notifications.changed') {
        return;
      }

      setRefreshKey((currentValue) => currentValue + 1);
    });
  }, []);

  const setFilterValue = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const markOne = async (notificationId) => {
    setState((current) => ({ ...current, busyKey: `notification:${notificationId}` }));
    try {
      await markWorkspaceNotificationRead(notificationId);
      await load();
    } catch (nextError) {
      toast.error({
        title: 'Bildiris yenilenmedi',
        message: nextError?.message || 'Bildiris statusunu yenilemek mumkun olmadi.'
      });
    } finally {
      setState((current) => ({ ...current, busyKey: '' }));
    }
  };

  const markAll = async () => {
    setState((current) => ({ ...current, busyKey: 'all' }));
    try {
      await markAllWorkspaceNotificationsRead();
      await load();
      toast.info({
        title: 'Bildirisler yenilendi',
        message: 'Butun bildirisler oxunmus kimi isaretlendi.'
      });
    } catch (nextError) {
      toast.error({
        title: 'Bildirisler yenilenmedi',
        message: nextError?.message || 'Butun bildirisleri yenilemek mumkun olmadi.'
      });
    } finally {
      setState((current) => ({ ...current, busyKey: '' }));
    }
  };

  return { filters, setFilterValue, markOne, markAll, ...state };
}
