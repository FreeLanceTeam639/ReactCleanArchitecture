import { useEffect, useMemo, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
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

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      navigate(ROUTES.login);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError('');

    fetchConversationIndex(filters)
      .then((items) => {
        if (cancelled) return;
        setConversations(items || []);
        const nextActive = items.find((item) => item.id === activeConversationId)?.id || items[0]?.id || '';
        setActiveConversationId(nextActive);
        setIsLoading(false);
      })
      .catch((nextError) => {
        if (!cancelled) {
          setConversations([]);
          setError(nextError?.message || 'Messages could not be loaded.');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [filters, navigate]);

  useEffect(() => {
    if (!activeConversationId) {
      setThread([]);
      return;
    }

    let cancelled = false;

    fetchConversationThread(activeConversationId)
      .then((items) => {
        if (!cancelled) {
          setThread(items || []);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setThread([]);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeConversationId]);

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
      const items = await fetchConversationIndex(filters);
      setConversations(items || []);
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
      setThread((current) => [...current, createdMessage]);
      const items = await fetchConversationIndex(filters);
      setConversations(items || []);
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
