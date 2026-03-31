const STORAGE_KEY = 'workspace_pending_conversation_id';

export function setPendingConversationFocusId(conversationId) {
  if (typeof window === 'undefined' || !conversationId) {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, String(conversationId));
}

export function consumePendingConversationFocusId() {
  if (typeof window === 'undefined') {
    return '';
  }

  const value = window.sessionStorage.getItem(STORAGE_KEY) || '';
  if (value) {
    window.sessionStorage.removeItem(STORAGE_KEY);
  }

  return value;
}
