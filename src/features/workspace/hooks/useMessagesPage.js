import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hasAuthenticatedSession, isDemoAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { createWorkspaceSocketSubscription } from '../../../shared/realtime/workspaceSocket.js';
import {
  fetchConversationIndex,
  fetchConversationThread,
  markConversationRead,
  sendConversationReply
} from '../services/workspaceService.js';

export function useMessagesPage(navigate) {
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [conversations, setConversations] = useState([]);
  const [thread, setThread] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyKey, setBusyKey] = useState('');
  const activeConversationIdRef = useRef('');

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  const loadConversations = useCallback(async (preferredConversationId = '') => {
    const items = await fetchConversationIndex(filters);
    const nextItems = items || [];

    setConversations(nextItems);

    const nextActiveConversationId =
      nextItems.find((item) => item.id === preferredConversationId)?.id ||
      nextItems.find((item) => item.id === activeConversationIdRef.current)?.id ||
      nextItems[0]?.id ||
      '';

    setActiveConversationId(nextActiveConversationId);

    return {
      items: nextItems,
      activeConversationId: nextActiveConversationId
    };
  }, [filters]);

  const loadThread = useCallback(async (conversationId) => {
    if (!conversationId) {
      setThread([]);
      return [];
    }

    const items = await fetchConversationThread(conversationId);
    const nextThread = items || [];
    setThread(nextThread);
    return nextThread;
  }, []);

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      navigate(ROUTES.login);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError('');

    loadConversations()
      .then(({ activeConversationId: nextActiveConversationId }) => {
        if (cancelled) {
          return;
        }

        setIsLoading(false);

        if (nextActiveConversationId) {
          loadThread(nextActiveConversationId).catch(() => {
            if (!cancelled) {
              setThread([]);
            }
          });
        } else {
          setThread([]);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setConversations([]);
          setThread([]);
          setError(nextError?.message || 'Messages could not be loaded.');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filters, loadConversations, loadThread, navigate]);

  useEffect(() => {
    if (!activeConversationId) {
      setThread([]);
      return;
    }

    let cancelled = false;

    loadThread(activeConversationId).catch(() => {
      if (!cancelled) {
        setThread([]);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeConversationId, loadThread]);

  useEffect(() => {
    if (!hasAuthenticatedSession() || isDemoAuthenticatedSession()) {
      return () => {};
    }

    return createWorkspaceSocketSubscription(async (event) => {
      if (event?.type !== 'conversation.updated') {
        return;
      }

      const targetConversationId = event.conversationId || activeConversationId;
      const result = await loadConversations(targetConversationId);
      const resolvedConversationId = result.activeConversationId || targetConversationId;

      if (resolvedConversationId) {
        await loadThread(resolvedConversationId);
      }
    });
  }, [activeConversationId, loadConversations, loadThread]);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeConversationId) || null,
    [activeConversationId, conversations]
  );

  const setFilterValue = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const openConversation = async (conversationId) => {
    setActiveConversationId(conversationId);
    setBusyKey(`read:${conversationId}`);

    try {
      await markConversationRead(conversationId);
      await loadConversations(conversationId);
      await loadThread(conversationId);
    } finally {
      setBusyKey('');
    }
  };

  const submitReply = async (event) => {
    event.preventDefault();
    if (!draftMessage.trim() || !activeConversationId) {
      return;
    }

    setBusyKey('reply');

    try {
      const createdMessage = await sendConversationReply(activeConversationId, draftMessage.trim());
      setThread((current) => {
        if (current.some((item) => item.id === createdMessage.id)) {
          return current;
        }

        return [...current, createdMessage];
      });

      await loadConversations(activeConversationId);
      setDraftMessage('');
    } finally {
      setBusyKey('');
    }
  };

  return {
    filters,
    conversations,
    thread,
    activeConversation,
    draftMessage,
    isLoading,
    error,
    busyKey,
    setDraftMessage,
    setFilterValue,
    openConversation,
    submitReply
  };
}
