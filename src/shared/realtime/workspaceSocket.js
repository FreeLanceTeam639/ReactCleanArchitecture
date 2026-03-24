import { API_BASE_URL } from '../api/endpoints.js';
import { getAccessToken, isDemoAuthenticatedSession } from '../lib/storage/authStorage.js';

function buildWorkspaceSocketUrl() {
  const configuredUrl = import.meta.env.VITE_WORKSPACE_SOCKET_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  const apiUrl = new URL(API_BASE_URL);
  const protocol = apiUrl.protocol === 'https:' ? 'wss:' : 'ws:';

  return `${protocol}//${apiUrl.host}/ws/chat`;
}

export function createWorkspaceSocketSubscription(onEvent) {
  if (typeof window === 'undefined' || typeof onEvent !== 'function' || isDemoAuthenticatedSession()) {
    return () => {};
  }

  let socket = null;
  let reconnectTimeoutId = 0;
  let disposed = false;

  const connect = () => {
    const accessToken = getAccessToken();

    if (!accessToken || disposed) {
      return;
    }

    const socketUrl = new URL(buildWorkspaceSocketUrl());
    socketUrl.searchParams.set('access_token', accessToken);

    socket = new WebSocket(socketUrl.toString());

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        onEvent(payload);
      } catch {
        // Ignore malformed realtime payloads.
      }
    };

    socket.onclose = () => {
      if (disposed) {
        return;
      }

      reconnectTimeoutId = window.setTimeout(() => {
        connect();
      }, 1500);
    };
  };

  connect();

  return () => {
    disposed = true;
    window.clearTimeout(reconnectTimeoutId);

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  };
}
