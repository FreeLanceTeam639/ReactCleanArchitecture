import { HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { API_BASE_URL } from '../api/endpoints.js';
import { getRuntimeConfigValue } from '../api/runtimeConfig.js';
import { getAccessToken } from '../lib/storage/authStorage.js';

function buildWorkspaceNotificationHubUrl() {
  const configuredUrl =
    getRuntimeConfigValue('WORKSPACE_NOTIFICATIONS_HUB_URL') ||
    import.meta.env.VITE_WORKSPACE_NOTIFICATIONS_HUB_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  const apiUrl = new URL(API_BASE_URL);
  return `${apiUrl.protocol}//${apiUrl.host}/hubs/workspace-notifications`;
}

const notificationListeners = new Set();
let sharedConnection = null;
let sharedConnectionStartPromise = null;

function emitNotificationsChanged(payload) {
  const eventPayload = payload || { type: 'notifications.changed' };

  notificationListeners.forEach((listener) => {
    try {
      listener(eventPayload);
    } catch {
      // Ignore subscriber errors to keep the realtime bridge healthy.
    }
  });
}

function ensureSharedConnection() {
  if (sharedConnection) {
    return sharedConnection;
  }

  sharedConnection = new HubConnectionBuilder()
    .withUrl(buildWorkspaceNotificationHubUrl(), {
      accessTokenFactory: () => getAccessToken() || ''
    })
    .withAutomaticReconnect()
    .build();

  sharedConnection.on('notifications.changed', emitNotificationsChanged);

  return sharedConnection;
}

async function startSharedConnection() {
  const connection = ensureSharedConnection();

  if (connection.state === HubConnectionState.Connected || connection.state === HubConnectionState.Connecting) {
    return;
  }

  if (sharedConnectionStartPromise) {
    return sharedConnectionStartPromise;
  }

  sharedConnectionStartPromise = connection.start().catch(() => {}).finally(() => {
    sharedConnectionStartPromise = null;
  });

  return sharedConnectionStartPromise;
}

async function stopSharedConnectionIfIdle(connection) {
  if (!connection) {
    return;
  }

  if (sharedConnectionStartPromise) {
    try {
      await sharedConnectionStartPromise;
    } catch {
      // Connection start errors are intentionally swallowed here.
    }
  }

  if (notificationListeners.size > 0 || sharedConnection !== connection) {
    return;
  }

  connection.off('notifications.changed', emitNotificationsChanged);

  if (connection.state !== HubConnectionState.Disconnected) {
    await connection.stop().catch(() => {});
  }

  if (sharedConnection === connection) {
    sharedConnection = null;
  }
}

export function createWorkspaceNotificationSubscription(onEvent) {
  if (typeof window === 'undefined' || typeof onEvent !== 'function') {
    return () => {};
  }

  notificationListeners.add(onEvent);
  const connection = ensureSharedConnection();
  void startSharedConnection();

  return () => {
    notificationListeners.delete(onEvent);
    void stopSharedConnectionIfIdle(connection);
  };
}
