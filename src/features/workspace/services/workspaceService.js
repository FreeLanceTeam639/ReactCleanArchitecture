import {
  API_ENDPOINTS,
  buildWorkspaceConversationEndpoint,
  buildWorkspaceConversationReadEndpoint,
  buildWorkspaceNotificationEndpoint,
  buildWorkspaceReviewFeatureEndpoint,
  buildWorkspaceSessionEndpoint
} from '../../../shared/api/endpoints.js';
import { ensureUploadedImage } from '../../../shared/api/mediaAssets.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { extractCollection } from '../../../shared/lib/response/extractCollection.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function normalizeTextFilter(value) {
  const trimmedValue = typeof value === 'string' ? value.trim() : value;
  return trimmedValue === '' ? undefined : trimmedValue;
}

function normalizeSelectFilter(value) {
  const normalizedValue = String(value || '').trim();

  if (!normalizedValue || normalizedValue.toLowerCase() === 'all') {
    return undefined;
  }

  return normalizedValue;
}

function toLower(value) {
  return String(value || '').trim().toLowerCase();
}

function resolveCollection(payload, preferredKeys = []) {
  const entity = extractEntity(payload, preferredKeys);

  if (Array.isArray(entity)) {
    return entity;
  }

  return extractCollection(entity || payload);
}

function normalizeOrder(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.slug, item.title),
    conversationId: pickFirst(item.conversationId, item.conversationID, ''),
    detailSlug: pickFirst(item.detailSlug, item.slug, ''),
    title: pickFirst(item.title, item.name, 'Untitled order'),
    client: pickFirst(item.client, item.clientName, 'You'),
    freelancer: pickFirst(item.freelancer, item.freelancerName, 'Collaboration'),
    status: toLower(pickFirst(item.status, 'active')),
    role: toLower(pickFirst(item.role, 'owner')),
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
    role: toLower(pickFirst(item.role, 'member')),
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
    role: toLower(pickFirst(item.role, 'received')),
    rating: Number(pickFirst(item.rating, 0)) || 0,
    status: toLower(pickFirst(item.status, 'visible')),
    createdAt: pickFirst(item.createdAt, item.timeAgo, ''),
    comment: pickFirst(item.comment, item.text, '')
  };
}

function normalizeSubscriptionPlan(item = {}) {
  return {
    key: String(pickFirst(item.key, item.Key, 'free')).toLowerCase(),
    name: pickFirst(item.name, item.Name, 'Free'),
    monthlyPrice: Number(pickFirst(item.monthlyPrice, item.monthly, item.MonthlyPrice, item.Monthly, 0)) || 0,
    yearlyPrice: Number(pickFirst(item.yearlyPrice, item.yearly, item.YearlyPrice, item.Yearly, 0)) || 0,
    maxActivePublishedJobs: pickFirst(item.maxActivePublishedJobs, item.MaxActivePublishedJobs, item.maxJobs, null),
    jobDurationDays: pickFirst(item.jobDurationDays, item.JobDurationDays, item.durationDays, null),
    isCurrent: Boolean(pickFirst(item.isCurrent, item.IsCurrent, false))
  };
}

function normalizeSubscriptionOverview(payload = {}) {
  const entity = extractEntity(payload, ['overview', 'subscription', 'data']) || payload;
  const plans = resolveCollection(entity?.plans || payload?.plans || []).map(normalizeSubscriptionPlan);

  return {
    currentPlanKey: String(pickFirst(entity.currentPlanKey, entity.CurrentPlanKey, 'free')).toLowerCase(),
    currentPlanName: pickFirst(entity.currentPlanName, entity.CurrentPlanName, 'Free'),
    currentBillingPeriod: String(pickFirst(entity.currentBillingPeriod, entity.CurrentBillingPeriod, 'monthly')).toLowerCase(),
    activePublishedJobs: Number(pickFirst(entity.activePublishedJobs, entity.ActivePublishedJobs, 0)) || 0,
    maxActivePublishedJobs: pickFirst(entity.maxActivePublishedJobs, entity.MaxActivePublishedJobs, null),
    remainingPublishedJobs: Number(pickFirst(entity.remainingPublishedJobs, entity.RemainingPublishedJobs, 0)) || 0,
    isUnlimited: Boolean(pickFirst(entity.isUnlimited, entity.IsUnlimited, false)),
    canPublishMore: Boolean(pickFirst(entity.canPublishMore, entity.CanPublishMore, true)),
    plans
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
  const sessions = resolveCollection(extractEntity(payload, ['sessions', 'data']) || payload.sessions || []);

  return {
    settings: {
      twoFactorEnabled: Boolean(pickFirst(entity.twoFactorEnabled, entity.twoFactor, false)),
      loginAlerts: Boolean(pickFirst(entity.loginAlerts, entity.loginNotifications, false)),
      sessionLock: Boolean(pickFirst(entity.sessionLock, entity.deviceApproval, false))
    },
    sessions: sessions.map(normalizeSession)
  };
}

function normalizeOrdersPayload(payload) {
  const items = resolveCollection(extractEntity(payload, ['items', 'orders', 'data']) || payload).map(normalizeOrder);
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
  const items = resolveCollection(extractEntity(payload, ['items', 'notifications', 'data']) || payload).map(normalizeNotification);
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
  const items = resolveCollection(extractEntity(payload, ['items', 'reviews', 'data']) || payload).map(normalizeReview);
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
  const payload = await httpClient.get(API_ENDPOINTS.workspace.orders, {
    query: {
      ...query,
      search: normalizeTextFilter(query.search),
      status: normalizeSelectFilter(query.status),
      role: normalizeSelectFilter(query.role),
      sort: normalizeSelectFilter(query.sort)
    }
  });
  return normalizeOrdersPayload(payload);
}

export async function fetchConversationIndex(query = {}) {
  const payload = await httpClient.get(API_ENDPOINTS.workspace.messages, {
    query: {
      ...query,
      search: normalizeTextFilter(query.search),
      status: normalizeSelectFilter(query.status)
    }
  });
  return resolveCollection(extractEntity(payload, ['items', 'conversations', 'data']) || payload).map(normalizeConversation);
}

export async function fetchConversationThread(conversationId) {
  const payload = await httpClient.get(buildWorkspaceConversationEndpoint(conversationId));
  return resolveCollection(extractEntity(payload, ['messages', 'items', 'data']) || payload).map(normalizeConversationMessage);
}

export async function markConversationRead(conversationId) {
  return httpClient.patch(buildWorkspaceConversationReadEndpoint(conversationId), {});
}

export async function sendConversationReply(conversationId, text) {
  const response = await httpClient.post(buildWorkspaceConversationEndpoint(conversationId), { text });
  return normalizeConversationMessage(extractEntity(response, ['message', 'data']) || response);
}

export async function fetchWorkspaceNotifications(query = {}) {
  const payload = await httpClient.get(API_ENDPOINTS.workspace.notifications, {
    query: {
      ...query,
      search: normalizeTextFilter(query.search),
      type: normalizeSelectFilter(query.type),
      state: normalizeSelectFilter(query.state)
    }
  });
  return normalizeNotificationsPayload(payload);
}

export async function markWorkspaceNotificationRead(notificationId) {
  const payload = await httpClient.patch(buildWorkspaceNotificationEndpoint(notificationId), {});
  return extractEntity(payload, ['data', 'item', 'result']) || { id: notificationId, isRead: true };
}

export async function markAllWorkspaceNotificationsRead() {
  return httpClient.patch(`${API_ENDPOINTS.workspace.notifications}/read-all`, {});
}

export async function fetchWalletSummary(query = {}) {
  const payload = await httpClient.get(API_ENDPOINTS.workspace.walletSummary, { query });
  return extractEntity(payload, ['summary', 'wallet', 'data']) || payload;
}

export async function fetchTransactions(query = {}) {
  const payload = await httpClient.get(API_ENDPOINTS.workspace.transactions, {
    query: {
      ...query,
      type: normalizeSelectFilter(query.type),
      status: normalizeSelectFilter(query.status)
    }
  });
  return resolveCollection(extractEntity(payload, ['items', 'transactions', 'data']) || payload).map(normalizeTransaction);
}

export async function requestWithdrawal(amount) {
  const numericAmount = Number(String(amount || '').replace(/[^\d.]/g, ''));
  const payload = await httpClient.post(API_ENDPOINTS.workspace.withdrawals, { amount: numericAmount });
  return normalizeTransaction(extractEntity(payload, ['transaction', 'data']) || payload);
}

export async function fetchWorkspaceReviews(query = {}) {
  const payload = await httpClient.get(API_ENDPOINTS.workspace.reviews, { query });
  return normalizeReviewsPayload(payload);
}

export async function toggleReviewFeatured(reviewId) {
  const payload = await httpClient.patch(buildWorkspaceReviewFeatureEndpoint(reviewId), {});
  return normalizeReview(extractEntity(payload, ['review', 'data']) || payload || { id: reviewId });
}

export async function fetchSecurityOverview() {
  const settingsPayload = await httpClient.get(API_ENDPOINTS.workspace.security);
  const sessionsPayload = await httpClient.get(API_ENDPOINTS.workspace.sessions);

  return normalizeSecurity({
    data: extractEntity(settingsPayload, ['data', 'security', 'settings']) || settingsPayload,
    sessions: resolveCollection(extractEntity(sessionsPayload, ['items', 'sessions', 'data']) || sessionsPayload)
  });
}

export async function updateSecurityOverview(payload) {
  const response = await httpClient.patch(API_ENDPOINTS.workspace.security, payload);
  return extractEntity(response, ['settings', 'security', 'data']) || payload;
}

export async function revokeSession(sessionId) {
  await httpClient.delete(buildWorkspaceSessionEndpoint(sessionId));
  return { id: sessionId };
}

export async function updatePassword(payload) {
  return httpClient.post(`${API_ENDPOINTS.workspace.security}/password`, payload);
}

export async function fetchPostTaskMeta() {
  const payload = await httpClient.get(API_ENDPOINTS.workspace.postTaskMeta);
  return extractEntity(payload, ['meta', 'data']) || payload;
}

async function normalizeTaskImageUrls(values = []) {
  const safeValues = Array.isArray(values)
    ? values.filter((item) => typeof item === 'string' && item.trim())
    : [];

  if (!safeValues.length) {
    return [];
  }

  const uploadedImages = await Promise.all(
    safeValues.slice(0, 6).map((item, index) => ensureUploadedImage(item, `workspace-task-${index + 1}`))
  );

  return uploadedImages.filter(Boolean);
}

export async function submitTask(payload, mode = 'publish') {
  const imageUrls = await normalizeTaskImageUrls(payload?.imageUrls);
  const normalizedPayload = {
    ...payload,
    imageUrls,
    mode
  };

  const response = await httpClient.post(API_ENDPOINTS.workspace.postTask, normalizedPayload);
  return extractEntity(response, ['task', 'data']) || normalizedPayload;
}

export async function fetchWorkspaceSubscriptionOverview() {
  const payload = await httpClient.get(API_ENDPOINTS.workspace.subscription);
  return normalizeSubscriptionOverview(payload);
}

export async function checkoutWorkspaceSubscription(request) {
  const payload = await httpClient.post(API_ENDPOINTS.workspace.subscriptionCheckout, request);
  const entity = extractEntity(payload, ['data']) || payload || {};

  return {
    message: pickFirst(entity.message, payload?.message, 'Subscription updated successfully.'),
    activatedPlanKey: String(pickFirst(entity.activatedPlanKey, request?.planKey, 'free')).toLowerCase(),
    activatedPlanName: pickFirst(entity.activatedPlanName, request?.planKey, 'Free'),
    billingPeriod: String(pickFirst(entity.billingPeriod, request?.billingPeriod, 'monthly')).toLowerCase(),
    amountPaid: Number(pickFirst(entity.amountPaid, entity.AmountPaid, 0)) || 0,
    currency: pickFirst(entity.currency, entity.Currency, 'USD'),
    paymentMethod: pickFirst(entity.paymentMethod, entity.PaymentMethod, ''),
    receiptNumber: pickFirst(entity.receiptNumber, entity.ReceiptNumber, ''),
    processedAt: pickFirst(entity.processedAtUtc, entity.ProcessedAtUtc, ''),
    overview: normalizeSubscriptionOverview(entity.overview || entity.Overview || entity)
  };
}
