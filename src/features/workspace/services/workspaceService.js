import {
  API_ENDPOINTS,
  buildWorkspaceConversationEndpoint,
  buildWorkspaceConversationReadEndpoint,
  buildWorkspaceNotificationEndpoint,
  buildWorkspaceReviewFeatureEndpoint,
  buildWorkspaceSessionEndpoint
} from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { isDemoAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { extractCollection } from '../../../shared/lib/response/extractCollection.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';
import { fallbackWorkspaceContent } from '../data/fallbackWorkspaceContent.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const workspaceStore = {
  orders: clone(fallbackWorkspaceContent.orders),
  conversations: clone(fallbackWorkspaceContent.conversations),
  messagesByConversation: clone(fallbackWorkspaceContent.messagesByConversation),
  notifications: clone(fallbackWorkspaceContent.notifications),
  walletSummary: clone(fallbackWorkspaceContent.walletSummary),
  transactions: clone(fallbackWorkspaceContent.transactions),
  reviews: clone(fallbackWorkspaceContent.reviews),
  security: clone(fallbackWorkspaceContent.security),
  postTaskMeta: clone(fallbackWorkspaceContent.postTaskMeta),
  createdTasks: []
};

function shouldUseFallback() {
  return isDemoAuthenticatedSession();
}

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function safeArray(value) {
  return Array.isArray(value) ? value : [];
}

function toLower(value) {
  return String(value || '').trim().toLowerCase();
}

function getUnreadConversationCount(conversationId) {
  return safeArray(workspaceStore.messagesByConversation[conversationId]).filter((item) => !item.isRead && item.direction === 'inbound').length;
}

function recalculateConversationState(conversationId) {
  const messages = safeArray(workspaceStore.messagesByConversation[conversationId]);
  const targetConversation = workspaceStore.conversations.find((item) => item.id === conversationId);

  if (!targetConversation) {
    return;
  }

  const lastMessage = messages[messages.length - 1];
  targetConversation.unreadCount = getUnreadConversationCount(conversationId);
  targetConversation.lastMessage = lastMessage?.text || targetConversation.lastMessage;
  targetConversation.updatedAt = lastMessage?.sentAt || targetConversation.updatedAt;
}

function normalizeOrder(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.slug, item.title),
    title: pickFirst(item.title, item.name, 'Untitled order'),
    client: pickFirst(item.client, item.clientName, 'Client'),
    freelancer: pickFirst(item.freelancer, item.freelancerName, 'Freelancer'),
    status: toLower(pickFirst(item.status, 'active')),
    role: toLower(pickFirst(item.role, 'freelancer')),
    stage: toLower(pickFirst(item.stage, 'in-progress')),
    budget: pickFirst(item.budget, item.amount, '$0'),
    progress: Number(pickFirst(item.progress, 0)) || 0,
    dueDate: pickFirst(item.dueDate, item.deadline, ''),
    priority: toLower(pickFirst(item.priority, 'medium')),
    category: pickFirst(item.category, item.type, 'General'),
    lastUpdate: pickFirst(item.lastUpdate, item.summary, '')
  };
}

function normalizeConversation(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.slug, item.title),
    title: pickFirst(item.title, item.subject, 'Conversation'),
    participant: pickFirst(item.participant, item.sender, item.clientName, 'User'),
    role: toLower(pickFirst(item.role, 'client')),
    unreadCount: Number(pickFirst(item.unreadCount, item.unread, 0)) || 0,
    lastMessage: pickFirst(item.lastMessage, item.preview, ''),
    updatedAt: pickFirst(item.updatedAt, item.lastSeen, ''),
    status: toLower(pickFirst(item.status, 'active'))
  };
}

function normalizeConversationMessage(item = {}) {
  return {
    id: pickFirst(item.id, item._id, `${item.sender}-${item.sentAt}`),
    sender: pickFirst(item.sender, item.author, 'User'),
    direction: toLower(pickFirst(item.direction, item.type, 'inbound')),
    text: pickFirst(item.text, item.message, ''),
    sentAt: pickFirst(item.sentAt, item.createdAt, ''),
    isRead: Boolean(pickFirst(item.isRead, item.read, false))
  };
}

function normalizeNotification(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.title),
    type: toLower(pickFirst(item.type, 'general')),
    title: pickFirst(item.title, 'Notification'),
    message: pickFirst(item.message, item.text, ''),
    isRead: Boolean(pickFirst(item.isRead, item.read, false)),
    createdAt: pickFirst(item.createdAt, item.timeAgo, '')
  };
}

function normalizeTransaction(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.title),
    type: toLower(pickFirst(item.type, 'income')),
    title: pickFirst(item.title, item.description, 'Transaction'),
    amount: pickFirst(item.amount, '$0'),
    status: toLower(pickFirst(item.status, 'completed')),
    method: pickFirst(item.method, item.channel, ''),
    createdAt: pickFirst(item.createdAt, item.date, '')
  };
}

function normalizeReview(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.project),
    author: pickFirst(item.author, item.name, 'Reviewer'),
    project: pickFirst(item.project, item.title, 'Project'),
    role: toLower(pickFirst(item.role, 'client')),
    rating: Number(pickFirst(item.rating, 0)) || 0,
    status: toLower(pickFirst(item.status, 'visible')),
    createdAt: pickFirst(item.createdAt, item.timeAgo, ''),
    comment: pickFirst(item.comment, item.text, '')
  };
}

function normalizeSession(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.device),
    device: pickFirst(item.device, 'Unknown device'),
    location: pickFirst(item.location, 'Unknown location'),
    lastActive: pickFirst(item.lastActive, item.updatedAt, ''),
    isCurrent: Boolean(pickFirst(item.isCurrent, false))
  };
}

function normalizeSecurity(payload = {}) {
  const entity = extractEntity(payload, ['data', 'security', 'settings']) || payload;
  const sessions = extractCollection(extractEntity(payload, ['sessions', 'data']) || payload.sessions || []);

  return {
    settings: {
      twoFactorEnabled: Boolean(pickFirst(entity.twoFactorEnabled, entity.twoFactor, false)),
      loginAlerts: Boolean(pickFirst(entity.loginAlerts, entity.loginNotifications, false)),
      sessionLock: Boolean(pickFirst(entity.sessionLock, entity.deviceApproval, false))
    },
    sessions: sessions.map(normalizeSession)
  };
}

function filterOrders(params = {}) {
  const search = toLower(params.search);
  const status = toLower(params.status || 'all');
  const role = toLower(params.role || 'all');
  const sort = toLower(params.sort || 'updated');

  let items = workspaceStore.orders.map(normalizeOrder);

  if (status && status != 'all') {
    items = items.filter((item) => item.status === status || item.stage === status);
  }

  if (role && role !== 'all') {
    items = items.filter((item) => item.role === role);
  }

  if (search) {
    items = items.filter((item) => `${item.title} ${item.client} ${item.freelancer} ${item.category}`.toLowerCase().includes(search));
  }

  const sorters = {
    updated: (left, right) => String(right.dueDate).localeCompare(String(left.dueDate)),
    deadline: (left, right) => String(left.dueDate).localeCompare(String(right.dueDate)),
    budget: (left, right) => Number(String(right.budget).replace(/[^\d.]/g, '')) - Number(String(left.budget).replace(/[^\d.]/g, '')),
    progress: (left, right) => right.progress - left.progress
  };

  items = [...items].sort(sorters[sort] || sorters.updated);

  return {
    items,
    summary: {
      active: items.filter((item) => item.status === 'active').length,
      review: items.filter((item) => item.status === 'review').length,
      completed: items.filter((item) => item.status === 'completed').length,
      totalValue: `$${items.reduce((sum, item) => sum + Number(String(item.budget).replace(/[^\d.]/g, '')), 0).toLocaleString()}`
    }
  };
}

function filterConversations(params = {}) {
  const search = toLower(params.search);
  const status = toLower(params.status || 'all');

  let items = workspaceStore.conversations.map((item) => ({ ...normalizeConversation(item), unreadCount: getUnreadConversationCount(item.id) }));

  if (status === 'unread') {
    items = items.filter((item) => item.unreadCount > 0);
  } else if (status !== 'all') {
    items = items.filter((item) => item.status === status);
  }

  if (search) {
    items = items.filter((item) => `${item.title} ${item.participant} ${item.lastMessage}`.toLowerCase().includes(search));
  }

  return items;
}

function filterNotifications(params = {}) {
  const search = toLower(params.search);
  const type = toLower(params.type || 'all');
  const state = toLower(params.state || 'all');

  let items = workspaceStore.notifications.map(normalizeNotification);

  if (type !== 'all') {
    items = items.filter((item) => item.type === type);
  }

  if (state === 'unread') {
    items = items.filter((item) => !item.isRead);
  }

  if (search) {
    items = items.filter((item) => `${item.title} ${item.message} ${item.type}`.toLowerCase().includes(search));
  }

  return {
    items,
    summary: {
      unread: items.filter((item) => !item.isRead).length,
      payments: items.filter((item) => item.type === 'payment').length,
      security: items.filter((item) => item.type === 'security').length
    }
  };
}

function filterTransactions(params = {}) {
  const type = toLower(params.type || 'all');
  const status = toLower(params.status || 'all');

  let items = workspaceStore.transactions.map(normalizeTransaction);

  if (type !== 'all') {
    items = items.filter((item) => item.type === type);
  }

  if (status !== 'all') {
    items = items.filter((item) => item.status === status);
  }

  return items;
}

function filterReviews(params = {}) {
  const role = toLower(params.role || 'all');
  const rating = String(params.rating || 'all');

  let items = workspaceStore.reviews.map(normalizeReview);

  if (role !== 'all') {
    items = items.filter((item) => item.role === role);
  }

  if (rating !== 'all') {
    items = items.filter((item) => item.rating === Number(rating));
  }

  return {
    items,
    summary: {
      averageRating: (items.reduce((sum, item) => sum + item.rating, 0) / (items.length || 1)).toFixed(1),
      total: items.length,
      featured: items.filter((item) => item.status === 'featured').length,
      fiveStar: items.filter((item) => item.rating === 5).length
    }
  };
}

function normalizeOrdersPayload(payload) {
  const items = extractCollection(extractEntity(payload, ['items', 'orders', 'data']) || payload).map(normalizeOrder);
  const meta = extractEntity(payload, ['summary', 'stats']) || {};

  return {
    items,
    summary: {
      active: Number(pickFirst(meta.active, items.filter((item) => item.status === 'active').length)),
      review: Number(pickFirst(meta.review, items.filter((item) => item.status === 'review').length)),
      completed: Number(pickFirst(meta.completed, items.filter((item) => item.status === 'completed').length)),
      totalValue: pickFirst(meta.totalValue, '$0')
    }
  };
}

function normalizeNotificationsPayload(payload) {
  const items = extractCollection(extractEntity(payload, ['items', 'notifications', 'data']) || payload).map(normalizeNotification);
  const summary = extractEntity(payload, ['summary', 'stats']) || {};

  return {
    items,
    summary: {
      unread: Number(pickFirst(summary.unread, items.filter((item) => !item.isRead).length)),
      payments: Number(pickFirst(summary.payments, items.filter((item) => item.type === 'payment').length)),
      security: Number(pickFirst(summary.security, items.filter((item) => item.type === 'security').length))
    }
  };
}

function normalizeReviewsPayload(payload) {
  const items = extractCollection(extractEntity(payload, ['items', 'reviews', 'data']) || payload).map(normalizeReview);
  const summary = extractEntity(payload, ['summary', 'stats']) || {};

  return {
    items,
    summary: {
      averageRating: pickFirst(summary.averageRating, '0.0'),
      total: Number(pickFirst(summary.total, items.length)),
      featured: Number(pickFirst(summary.featured, items.filter((item) => item.status === 'featured').length)),
      fiveStar: Number(pickFirst(summary.fiveStar, items.filter((item) => item.rating === 5).length))
    }
  };
}

export async function fetchOrders(query = {}) {
  if (shouldUseFallback()) return filterOrders(query);

  try {
    const payload = await httpClient.get(API_ENDPOINTS.workspace.orders, { query });
    return normalizeOrdersPayload(payload);
  } catch {
    return filterOrders(query);
  }
}

export async function fetchConversationIndex(query = {}) {
  if (shouldUseFallback()) return filterConversations(query);

  try {
    const payload = await httpClient.get(API_ENDPOINTS.workspace.messages, { query });
    return extractCollection(extractEntity(payload, ['items', 'conversations', 'data']) || payload).map(normalizeConversation);
  } catch {
    return filterConversations(query);
  }
}

export async function fetchConversationThread(conversationId) {
  if (shouldUseFallback()) {
    return safeArray(workspaceStore.messagesByConversation[conversationId]).map(normalizeConversationMessage);
  }

  try {
    const payload = await httpClient.get(buildWorkspaceConversationEndpoint(conversationId));
    return extractCollection(extractEntity(payload, ['messages', 'items', 'data']) || payload).map(normalizeConversationMessage);
  } catch {
    return safeArray(workspaceStore.messagesByConversation[conversationId]).map(normalizeConversationMessage);
  }
}

export async function markConversationRead(conversationId) {
  if (shouldUseFallback()) {
    workspaceStore.messagesByConversation[conversationId] = safeArray(workspaceStore.messagesByConversation[conversationId]).map((item) => (
      item.direction === 'inbound' ? { ...item, isRead: true } : item
    ));
    recalculateConversationState(conversationId);
    return { id: conversationId, unreadCount: 0 };
  }

  try {
    return await httpClient.patch(buildWorkspaceConversationReadEndpoint(conversationId), {});
  } catch {
    workspaceStore.messagesByConversation[conversationId] = safeArray(workspaceStore.messagesByConversation[conversationId]).map((item) => (
      item.direction === 'inbound' ? { ...item, isRead: true } : item
    ));
    recalculateConversationState(conversationId);
    return { id: conversationId, unreadCount: 0 };
  }
}

export async function sendConversationReply(conversationId, text) {
  const payload = { text };

  if (shouldUseFallback()) {
    const nextMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      direction: 'outbound',
      text,
      sentAt: 'Now',
      isRead: true
    };

    workspaceStore.messagesByConversation[conversationId] = [
      ...safeArray(workspaceStore.messagesByConversation[conversationId]),
      nextMessage
    ];
    recalculateConversationState(conversationId);
    return normalizeConversationMessage(nextMessage);
  }

  try {
    const response = await httpClient.post(buildWorkspaceConversationEndpoint(conversationId), payload);
    return normalizeConversationMessage(extractEntity(response, ['message', 'data']) || response);
  } catch {
    const nextMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      direction: 'outbound',
      text,
      sentAt: 'Now',
      isRead: true
    };

    workspaceStore.messagesByConversation[conversationId] = [
      ...safeArray(workspaceStore.messagesByConversation[conversationId]),
      nextMessage
    ];
    recalculateConversationState(conversationId);
    return normalizeConversationMessage(nextMessage);
  }
}

export async function fetchWorkspaceNotifications(query = {}) {
  if (shouldUseFallback()) return filterNotifications(query);

  try {
    const payload = await httpClient.get(API_ENDPOINTS.workspace.notifications, { query });
    return normalizeNotificationsPayload(payload);
  } catch {
    return filterNotifications(query);
  }
}

export async function markWorkspaceNotificationRead(notificationId) {
  if (shouldUseFallback()) {
    workspaceStore.notifications = workspaceStore.notifications.map((item) => (
      item.id === notificationId ? { ...item, isRead: true } : item
    ));
    return { id: notificationId, isRead: true };
  }

  try {
    return await httpClient.patch(buildWorkspaceNotificationEndpoint(notificationId), {});
  } catch {
    workspaceStore.notifications = workspaceStore.notifications.map((item) => (
      item.id === notificationId ? { ...item, isRead: true } : item
    ));
    return { id: notificationId, isRead: true };
  }
}

export async function markAllWorkspaceNotificationsRead() {
  if (shouldUseFallback()) {
    workspaceStore.notifications = workspaceStore.notifications.map((item) => ({ ...item, isRead: true }));
    return { success: true };
  }

  try {
    return await httpClient.patch(`${API_ENDPOINTS.workspace.notifications}/read-all`, {});
  } catch {
    workspaceStore.notifications = workspaceStore.notifications.map((item) => ({ ...item, isRead: true }));
    return { success: true };
  }
}

export async function fetchWalletSummary(query = {}) {
  if (shouldUseFallback()) return clone(workspaceStore.walletSummary);

  try {
    const payload = await httpClient.get(API_ENDPOINTS.workspace.walletSummary, { query });
    return extractEntity(payload, ['summary', 'wallet', 'data']) || clone(workspaceStore.walletSummary);
  } catch {
    return clone(workspaceStore.walletSummary);
  }
}

export async function fetchTransactions(query = {}) {
  if (shouldUseFallback()) return filterTransactions(query);

  try {
    const payload = await httpClient.get(API_ENDPOINTS.workspace.transactions, { query });
    return extractCollection(extractEntity(payload, ['items', 'transactions', 'data']) || payload).map(normalizeTransaction);
  } catch {
    return filterTransactions(query);
  }
}

export async function requestWithdrawal(amount) {
  const numericAmount = Number(String(amount || '').replace(/[^\d.]/g, ''));

  if (shouldUseFallback()) {
    const transaction = {
      id: `txn-${Date.now()}`,
      type: 'withdrawal',
      title: 'Manual withdrawal request',
      amount: `-$${numericAmount || 0}`,
      status: 'processing',
      method: 'Bank transfer',
      createdAt: 'Today'
    };
    workspaceStore.transactions.unshift(transaction);
    return normalizeTransaction(transaction);
  }

  try {
    const payload = await httpClient.post(API_ENDPOINTS.workspace.withdrawals, { amount: numericAmount });
    return normalizeTransaction(extractEntity(payload, ['transaction', 'data']) || payload);
  } catch {
    const transaction = {
      id: `txn-${Date.now()}`,
      type: 'withdrawal',
      title: 'Manual withdrawal request',
      amount: `-$${numericAmount || 0}`,
      status: 'processing',
      method: 'Bank transfer',
      createdAt: 'Today'
    };
    workspaceStore.transactions.unshift(transaction);
    return normalizeTransaction(transaction);
  }
}

export async function fetchWorkspaceReviews(query = {}) {
  if (shouldUseFallback()) return filterReviews(query);

  try {
    const payload = await httpClient.get(API_ENDPOINTS.workspace.reviews, { query });
    return normalizeReviewsPayload(payload);
  } catch {
    return filterReviews(query);
  }
}

export async function toggleReviewFeatured(reviewId) {
  const target = workspaceStore.reviews.find((item) => item.id === reviewId);
  const nextStatus = target?.status === 'featured' ? 'visible' : 'featured';

  if (shouldUseFallback()) {
    workspaceStore.reviews = workspaceStore.reviews.map((item) => (
      item.id === reviewId ? { ...item, status: nextStatus } : item
    ));
    return { id: reviewId, status: nextStatus };
  }

  try {
    const payload = await httpClient.patch(buildWorkspaceReviewFeatureEndpoint(reviewId), { status: nextStatus });
    return normalizeReview(extractEntity(payload, ['review', 'data']) || payload);
  } catch {
    workspaceStore.reviews = workspaceStore.reviews.map((item) => (
      item.id === reviewId ? { ...item, status: nextStatus } : item
    ));
    return { id: reviewId, status: nextStatus };
  }
}

export async function fetchSecurityOverview() {
  if (shouldUseFallback()) return clone(workspaceStore.security);

  try {
    const settingsPayload = await httpClient.get(API_ENDPOINTS.workspace.security);
    const sessionsPayload = await httpClient.get(API_ENDPOINTS.workspace.sessions);
    return normalizeSecurity({
      data: extractEntity(settingsPayload, ['data', 'security', 'settings']) || settingsPayload,
      sessions: extractCollection(extractEntity(sessionsPayload, ['items', 'sessions', 'data']) || sessionsPayload)
    });
  } catch {
    return clone(workspaceStore.security);
  }
}

export async function updateSecurityOverview(payload) {
  if (shouldUseFallback()) {
    workspaceStore.security.settings = {
      ...workspaceStore.security.settings,
      ...payload
    };
    return clone(workspaceStore.security.settings);
  }

  try {
    const response = await httpClient.patch(API_ENDPOINTS.workspace.security, payload);
    return extractEntity(response, ['settings', 'security', 'data']) || payload;
  } catch {
    workspaceStore.security.settings = {
      ...workspaceStore.security.settings,
      ...payload
    };
    return clone(workspaceStore.security.settings);
  }
}

export async function revokeSession(sessionId) {
  if (shouldUseFallback()) {
    workspaceStore.security.sessions = workspaceStore.security.sessions.filter((item) => item.id !== sessionId || item.isCurrent);
    return { id: sessionId };
  }

  try {
    await httpClient.delete(buildWorkspaceSessionEndpoint(sessionId));
    return { id: sessionId };
  } catch {
    workspaceStore.security.sessions = workspaceStore.security.sessions.filter((item) => item.id !== sessionId || item.isCurrent);
    return { id: sessionId };
  }
}

export async function updatePassword(payload) {
  if (shouldUseFallback()) {
    return { success: true, updatedAt: 'Now', ...payload };
  }

  try {
    return await httpClient.post(`${API_ENDPOINTS.workspace.security}/password`, payload);
  } catch {
    return { success: true, updatedAt: 'Now', ...payload };
  }
}

export async function fetchPostTaskMeta() {
  if (shouldUseFallback()) return clone(workspaceStore.postTaskMeta);

  try {
    const payload = await httpClient.get(API_ENDPOINTS.workspace.postTaskMeta);
    return extractEntity(payload, ['meta', 'data']) || clone(workspaceStore.postTaskMeta);
  } catch {
    return clone(workspaceStore.postTaskMeta);
  }
}

export async function submitTask(payload, mode = 'publish') {
  const normalizedPayload = {
    ...payload,
    mode
  };

  if (shouldUseFallback()) {
    const item = {
      id: `task-${Date.now()}`,
      ...normalizedPayload,
      createdAt: 'Now'
    };
    workspaceStore.createdTasks.unshift(item);
    return item;
  }

  try {
    const response = await httpClient.post(API_ENDPOINTS.workspace.postTask, normalizedPayload);
    return extractEntity(response, ['task', 'data']) || normalizedPayload;
  } catch {
    const item = {
      id: `task-${Date.now()}`,
      ...normalizedPayload,
      createdAt: 'Now'
    };
    workspaceStore.createdTasks.unshift(item);
    return item;
  }
}
