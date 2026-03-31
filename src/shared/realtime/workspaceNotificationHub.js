import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { API_BASE_URL } from '../api/endpoints.js';
import { getAccessToken } from '../lib/storage/authStorage.js';

function buildWorkspaceNotificationHubUrl() {
  const configuredUrl = import.meta.env.VITE_WORKSPACE_NOTIFICATIONS_HUB_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  const apiUrl = new URL(API_BASE_URL);
  return `${apiUrl.protocol}//${apiUrl.host}/hubs/workspace-notifications`;
}

export function createWorkspaceNotificationSubscription(onEvent) {
  if (typeof window === 'undefined' || typeof onEvent !== 'function') {
    return () => {};
  }

  const connection = new HubConnectionBuilder()
    .withUrl(buildWorkspaceNotificationHubUrl(), {
      accessTokenFactory: () => getAccessToken() || ''
    })
    .withAutomaticReconnect()
    .build();

  const handleNotificationsChanged = (payload) => {
    onEvent(payload || { type: 'notifications.changed' });
  };

  connection.on('notifications.changed', handleNotificationsChanged);
  connection.start().catch(() => {});

  return () => {
    connection.off('notifications.changed', handleNotificationsChanged);

    if (connection.state !== HubConnectionState.Disconnected) {
      connection.stop().catch(() => {});
    }
  };
}
