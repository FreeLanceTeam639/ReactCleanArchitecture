import { AnimatePresence } from 'framer-motion';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { fetchConversationIndex, fetchWorkspaceNotifications } from '../../../features/workspace/services/workspaceService.js';
import { useAuthSessionState } from '../../hooks/useAuthSessionState.js';
import { createWorkspaceNotificationSubscription } from '../../realtime/workspaceNotificationHub.js';
import { createWorkspaceSocketSubscription } from '../../realtime/workspaceSocket.js';
import FloatingToast from '../FloatingToast.jsx';
import { subscribeToToastEvents } from './toastBus.js';

const ToastContext = createContext({
  showToast: () => '',
  success: () => '',
  error: () => '',
  info: () => ''
});

let toastSequence = 0;

function createToastItem(payload = {}) {
  return {
    id: payload.id || `toast-${Date.now()}-${toastSequence += 1}`,
    tone: payload.tone === 'success' || payload.tone === 'info' ? payload.tone : 'error',
    title: String(payload.title || '').trim(),
    message: String(payload.message || '').trim(),
    duration: Number(payload.duration) > 0 ? Number(payload.duration) : 3600
  };
}

function mapConversationSnapshot(items = []) {
  return new Map(
    items.map((item) => [
      String(item.id || ''),
      {
        unreadCount: Number(item.unreadCount || 0),
        participant: String(item.participant || '').trim(),
        title: String(item.title || '').trim(),
        lastMessage: String(item.lastMessage || '').trim()
      }
    ])
  );
}

async function loadConversationSnapshot() {
  try {
    const items = await fetchConversationIndex({});
    return mapConversationSnapshot(items || []);
  } catch {
    return null;
  }
}

async function loadUnreadNotificationCount() {
  try {
    const payload = await fetchWorkspaceNotifications({ state: 'unread' });
    const summaryUnread = Number(payload?.summary?.unread);

    if (Number.isFinite(summaryUnread)) {
      return summaryUnread;
    }

    return Array.isArray(payload?.items) ? payload.items.filter((item) => !item.isRead).length : 0;
  } catch {
    return null;
  }
}

function WorkspaceRealtimeToastBridge({ showToast }) {
  const authSession = useAuthSessionState();
  const conversationSnapshotRef = useRef(new Map());
  const unreadNotificationCountRef = useRef(0);

  useEffect(() => {
    let cancelled = false;

    async function primeSnapshots() {
      if (!authSession) {
        conversationSnapshotRef.current = new Map();
        unreadNotificationCountRef.current = 0;
        return;
      }

      const [conversationSnapshot, unreadNotificationCount] = await Promise.all([
        loadConversationSnapshot(),
        loadUnreadNotificationCount()
      ]);

      if (cancelled) {
        return;
      }

      if (conversationSnapshot) {
        conversationSnapshotRef.current = conversationSnapshot;
      }

      if (typeof unreadNotificationCount === 'number') {
        unreadNotificationCountRef.current = unreadNotificationCount;
      }
    }

    primeSnapshots();

    return () => {
      cancelled = true;
    };
  }, [authSession]);

  useEffect(() => {
    if (!authSession) {
      return () => {};
    }

    return createWorkspaceSocketSubscription(async (event) => {
      if (event?.type !== 'conversation.updated') {
        return;
      }

      const nextSnapshot = await loadConversationSnapshot();

      if (!nextSnapshot) {
        return;
      }

      const conversationId = String(event.conversationId || '');
      const previousConversation = conversationSnapshotRef.current.get(conversationId);
      const nextConversation = nextSnapshot.get(conversationId);

      conversationSnapshotRef.current = nextSnapshot;

      if (!nextConversation) {
        return;
      }

      const previousUnreadCount = Number(previousConversation?.unreadCount || 0);
      const nextUnreadCount = Number(nextConversation.unreadCount || 0);

      if (nextUnreadCount <= previousUnreadCount) {
        return;
      }

      showToast({
        tone: 'info',
        title: 'Yeni mesaj geldi',
        message: nextConversation.participant
          ? `${nextConversation.participant} size mesaj gonderdi.`
          : 'Inbox bolmenizde yeni mesaj var.'
      });
    });
  }, [authSession, showToast]);

  useEffect(() => {
    if (!authSession) {
      return () => {};
    }

    return createWorkspaceNotificationSubscription(async (event) => {
      if (event?.type && event.type !== 'notifications.changed') {
        return;
      }

      const nextUnreadNotificationCount = await loadUnreadNotificationCount();

      if (typeof nextUnreadNotificationCount !== 'number') {
        return;
      }

      const previousUnreadNotificationCount = unreadNotificationCountRef.current;
      unreadNotificationCountRef.current = nextUnreadNotificationCount;

      if (nextUnreadNotificationCount <= previousUnreadNotificationCount) {
        return;
      }

      showToast({
        tone: 'info',
        title: 'Yeni bildiris geldi',
        message: 'Hesabiniz ucun yeni bildiris var.'
      });
    });
  }, [authSession, showToast]);

  return null;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timeoutIdsRef = useRef(new Map());

  const dismissToast = useCallback((toastId) => {
    setToasts((currentToasts) => currentToasts.filter((item) => item.id !== toastId));

    if (timeoutIdsRef.current.has(toastId)) {
      window.clearTimeout(timeoutIdsRef.current.get(toastId));
      timeoutIdsRef.current.delete(toastId);
    }
  }, []);

  const showToast = useCallback((payload) => {
    const nextToast = createToastItem(payload);

    if (!nextToast.message) {
      return '';
    }

    setToasts((currentToasts) => {
      const dedupedToasts = currentToasts.filter(
        (item) =>
          !(
            item.tone === nextToast.tone &&
            item.title === nextToast.title &&
            item.message === nextToast.message
          )
      );

      return [...dedupedToasts.slice(-2), nextToast];
    });

    const timeoutId = window.setTimeout(() => {
      dismissToast(nextToast.id);
    }, nextToast.duration);

    timeoutIdsRef.current.set(nextToast.id, timeoutId);

    return nextToast.id;
  }, [dismissToast]);

  useEffect(() => {
    return subscribeToToastEvents((payload) => {
      showToast(payload);
    });
  }, [showToast]);

  useEffect(() => () => {
    timeoutIdsRef.current.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
    timeoutIdsRef.current.clear();
  }, []);

  const contextValue = useMemo(() => ({
    showToast,
    success(payload) {
      return showToast({
        tone: 'success',
        ...payload
      });
    },
    error(payload) {
      return showToast({
        tone: 'error',
        ...payload
      });
    },
    info(payload) {
      return showToast({
        tone: 'info',
        ...payload
      });
    }
  }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      <WorkspaceRealtimeToastBridge showToast={showToast} />
      {children}

      <div className="floatingToastStack" aria-live="polite" aria-atomic="true">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => (
            <FloatingToast key={toast.id} toast={toast} onClose={() => dismissToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
