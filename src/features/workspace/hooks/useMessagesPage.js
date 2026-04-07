import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useToast } from '../../../shared/hooks/useToast.js';
import { consumePendingConversationFocusId } from '../../../shared/lib/storage/workspaceConversationState.js';
import { createWorkspaceSocketSubscription } from '../../../shared/realtime/workspaceSocket.js';
import {
  fetchConversationIndex,
  fetchConversationThread,
  markConversationRead,
  sendConversationReply
} from '../services/workspaceService.js';

export function useMessagesPage(navigate) {
  const toast = useToast();
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [conversations, setConversations] = useState([]);
  const [thread, setThread] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState('');
  const [draftMessage, setDraftMessage] = useState('');
  const [isParticipantTyping, setIsParticipantTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyKey, setBusyKey] = useState('');
  const activeConversationIdRef = useRef('');
  const socketSendRef = useRef(() => false);
  const typingDebounceTimeoutRef = useRef(0);
  const typingVisibilityTimeoutRef = useRef(0);

  useEffect(() => {
    activeConversationIdRef.current = activeConversationId;
  }, [activeConversationId]);

  const emitTypingState = useCallback((isTyping, conversationId = activeConversationIdRef.current) => {
    if (!conversationId) {
      return;
    }

    socketSendRef.current?.({
      type: 'conversation.typing',
      conversationId,
      isTyping
    });
  }, []);

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

    const preferredConversationId = consumePendingConversationFocusId();

    loadConversations(preferredConversationId)
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
      setIsParticipantTyping(false);
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
    if (!hasAuthenticatedSession()) {
      return () => {};
    }

    return createWorkspaceSocketSubscription(
      async (event) => {
        if (event?.type === 'conversation.typing') {
          if (!event.conversationId || event.conversationId !== activeConversationIdRef.current) {
            return;
          }

          window.clearTimeout(typingVisibilityTimeoutRef.current);
          setIsParticipantTyping(Boolean(event.isTyping));

          if (event.isTyping) {
            typingVisibilityTimeoutRef.current = window.setTimeout(() => {
              setIsParticipantTyping(false);
            }, 2200);
          }

          return;
        }

        if (event?.type !== 'conversation.updated') {
          return;
        }

        const targetConversationId = event.conversationId || activeConversationIdRef.current;
        const result = await loadConversations(targetConversationId);
        const resolvedConversationId = result.activeConversationId || targetConversationId;

        if (resolvedConversationId) {
          await loadThread(resolvedConversationId);
        }
      },
      {
        onReady({ sendJson }) {
          socketSendRef.current = sendJson;
        }
      }
    );
  }, [loadConversations, loadThread]);

  useEffect(() => () => {
    window.clearTimeout(typingDebounceTimeoutRef.current);
    window.clearTimeout(typingVisibilityTimeoutRef.current);
  }, []);

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeConversationId) || null,
    [activeConversationId, conversations]
  );

  const setFilterValue = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const openConversation = async (conversationId) => {
    emitTypingState(false);
    window.clearTimeout(typingDebounceTimeoutRef.current);
    window.clearTimeout(typingVisibilityTimeoutRef.current);
    setIsParticipantTyping(false);
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

  const handleDraftMessageChange = (value) => {
    setDraftMessage(value);

    if (!activeConversationIdRef.current) {
      return;
    }

    window.clearTimeout(typingDebounceTimeoutRef.current);

    if (value.trim()) {
      emitTypingState(true);
      typingDebounceTimeoutRef.current = window.setTimeout(() => {
        emitTypingState(false);
      }, 1100);
    } else {
      emitTypingState(false);
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
      emitTypingState(false, activeConversationId);
      window.clearTimeout(typingDebounceTimeoutRef.current);
    } catch (nextError) {
      toast.error({
        title: 'Mesaj gonderilmedi',
        message: nextError?.message || 'Mesaji gondermek mumkun olmadi.'
      });
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
    isParticipantTyping,
    isLoading,
    error,
    busyKey,
    setDraftMessage: handleDraftMessageChange,
    setFilterValue,
    openConversation,
    submitReply
  };
}
