import {
  API_ENDPOINTS,
  buildProfileListingStatusEndpoint,
  buildProfileMessageReadEndpoint,
  buildProfileNotificationReadEndpoint,
  buildProfileProposalStatusEndpoint,
  buildProfileSavedItemEndpoint
} from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { ensureUploadedImage, resolveApiAssetUrl, stripApiOriginFromAssetUrl } from '../../../shared/api/mediaAssets.js';
import { extractCollection } from '../../../shared/lib/response/extractCollection.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function deriveInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0])
    .join('')
    .toUpperCase();
}

function toStringArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export function normalizeProfile(payload) {
  const entity = extractEntity(payload, ['profile', 'user', 'data']) || {};
  const fullName = pickFirst(entity.fullName, entity.name, `${entity.firstName || ''} ${entity.lastName || ''}`.trim(), 'Account');
  const verificationStatus = String(pickFirst(entity.verificationStatus, 'Unverified'));
  const isVerified = Boolean(pickFirst(entity.isVerified, false));
  const canPostJobs = Boolean(pickFirst(entity.canPostJobs, isVerified));
  const rawLocation = pickFirst(entity.location, '');
  const country = pickFirst(entity.country, rawLocation === 'Location not specified' ? '' : rawLocation, '');

  return {
    id: pickFirst(entity.id, entity._id, entity.userId, ''),
    firstName: pickFirst(entity.firstName, fullName.split(' ')[0], ''),
    fullName,
    email: pickFirst(entity.email, ''),
    profession: pickFirst(entity.profession, entity.title, entity.role, 'Member'),
    headline: pickFirst(entity.headline, entity.profession, entity.title, ''),
    country,
    location: pickFirst(entity.location, country, 'Location not specified'),
    phoneNumber: pickFirst(entity.phoneNumber, entity.phone, ''),
    memberSince: pickFirst(entity.memberSince, entity.createdAt?.slice?.(0, 4), '-'),
    badge: pickFirst(entity.badge, entity.level, isVerified ? 'Verified Member' : 'Member'),
    bio: pickFirst(entity.bio, entity.description, ''),
    availability: pickFirst(entity.availability, entity.status, 'Available'),
    hourlyRate: pickFirst(entity.hourlyRate, entity.rate, entity.pricePerHour, ''),
    avatarInitials: pickFirst(entity.avatarInitials, deriveInitials(fullName), 'AC'),
    avatarUrl: resolveApiAssetUrl(pickFirst(entity.avatarUrl, entity.avatar, entity.imageUrl, '')),
    bannerUrl: resolveApiAssetUrl(pickFirst(entity.bannerUrl, entity.banner, '')),
    completionRate: Number(pickFirst(entity.completionRate, entity.responseRate, 0)) || 0,
    responseTime: pickFirst(entity.responseTime, entity.avgResponseTime, '-'),
    skills: toStringArray(entity.skills),
    isVerified,
    canPostJobs,
    verificationStatus,
    verificationNote: pickFirst(entity.verificationNote, '')
  };
}

export function normalizeSummary(payload) {
  const entity = extractEntity(payload, ['summary', 'stats', 'dashboard', 'data']) || {};

  return {
    monthlyEarnings: pickFirst(entity.monthlyEarnings, entity.thisMonthEarnings, entity.currentMonthEarnings, '$0'),
    tasksCompleted: pickFirst(entity.tasksCompleted, entity.completedTasks, 0),
    responseRate: pickFirst(entity.responseRate, entity.completionRate, '0%'),
    rating: pickFirst(entity.rating, entity.averageRating, '0.0'),
    reviewsCount: pickFirst(entity.reviewsCount, entity.totalReviews, 0),
    earnings: pickFirst(entity.earnings, entity.totalEarnings, '$0'),
    availableBalance: pickFirst(entity.availableBalance, entity.balance, '$0'),
    activeTasks: pickFirst(entity.activeTasks, entity.ongoingTasks, 0),
    pendingRequests: pickFirst(entity.pendingRequests, entity.pendingProposals, 0),
    savedItems: pickFirst(entity.savedItems, entity.savedCount, 0),
    unreadMessages: pickFirst(entity.unreadMessages, entity.newMessages, 0),
    completionRate: pickFirst(entity.completionRate, entity.responseRate, '0%'),
    responseTime: pickFirst(entity.responseTime, entity.avgResponseTime, '-')
  };
}

export function normalizeTask(task = {}) {
  return {
    id: pickFirst(task.id, task._id, task.slug, task.title),
    title: pickFirst(task.title, task.name, 'Untitled task'),
    status: pickFirst(task.status, 'Pending'),
    budget: pickFirst(task.budget, task.price, '$0')
  };
}

export function normalizeListing(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.slug, item.title),
    title: pickFirst(item.title, item.name, 'Untitled listing'),
    status: String(pickFirst(item.status, 'draft')).toLowerCase(),
    category: pickFirst(item.category, item.type, 'General'),
    budget: pickFirst(item.budget, item.price, '$0'),
    updatedAt: pickFirst(item.updatedAt, item.modifiedAt, item.createdAt, '')
  };
}

export function normalizeProposal(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.jobId, item.title),
    jobTitle: pickFirst(item.jobTitle, item.title, 'Untitled proposal'),
    status: String(pickFirst(item.status, 'pending')).toLowerCase(),
    amount: pickFirst(item.amount, item.bidAmount, '$0'),
    submittedAt: pickFirst(item.submittedAt, item.createdAt, ''),
    clientName: pickFirst(item.clientName, item.client, 'Client')
  };
}

export function normalizeReview(item = {}) {
  return {
    id: pickFirst(item.id, item._id, `${item.author || 'review'}-${item.createdAt || ''}`),
    author: pickFirst(item.author, item.clientName, 'Anonymous client'),
    rating: Number(pickFirst(item.rating, item.score, 0)) || 0,
    comment: pickFirst(item.comment, item.text, ''),
    timeAgo: pickFirst(item.timeAgo, item.createdAt, '')
  };
}

export function normalizeSavedItem(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.slug, item.title),
    title: pickFirst(item.title, item.name, 'Saved item'),
    type: pickFirst(item.type, item.category, 'Listing'),
    meta: pickFirst(item.meta, item.location, item.price, '')
  };
}

export function normalizeNotification(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.title, item.message),
    title: pickFirst(item.title, 'Update'),
    message: pickFirst(item.message, item.text, ''),
    isRead: Boolean(pickFirst(item.isRead, item.read, false))
  };
}

export function normalizeMessage(item = {}) {
  return {
    id: pickFirst(item.id, item._id, item.sender, item.text),
    sender: pickFirst(item.sender, item.author, 'User'),
    text: pickFirst(item.text, item.message, ''),
    isRead: Boolean(pickFirst(item.isRead, item.read, false)),
    timeAgo: pickFirst(item.timeAgo, item.createdAt, '')
  };
}

function getCollection(payload, preferredKeys = []) {
  const entity = extractEntity(payload, preferredKeys);

  if (Array.isArray(entity)) {
    return entity;
  }

  return extractCollection(entity || payload);
}

export async function fetchCurrentUserProfile() {
  return normalizeProfile(await httpClient.get(API_ENDPOINTS.profile.me));
}

export async function updateCurrentUserProfile(payload) {
  const uploadedAvatarUrl = await ensureUploadedImage(payload?.avatarUrl, 'profile-avatar');
  const uploadedBannerUrl = await ensureUploadedImage(payload?.bannerUrl, 'profile-banner');
  const nextPayload = {
    ...payload,
    avatarUrl: stripApiOriginFromAssetUrl(uploadedAvatarUrl),
    bannerUrl: stripApiOriginFromAssetUrl(uploadedBannerUrl)
  };

  return normalizeProfile(await httpClient.patch(API_ENDPOINTS.profile.update, nextPayload));
}

export async function fetchProfileSummary() {
  return normalizeSummary(await httpClient.get(API_ENDPOINTS.profile.summary));
}

export async function fetchProfileTasks() {
  return getCollection(await httpClient.get(API_ENDPOINTS.profile.tasks), ['tasks', 'items']).map(normalizeTask);
}

export async function fetchProfileListings() {
  return getCollection(await httpClient.get(API_ENDPOINTS.profile.listings), ['listings', 'items']).map(normalizeListing);
}

export async function updateProfileListingStatus(listingId, status) {
  const payload = await httpClient.patch(buildProfileListingStatusEndpoint(listingId), { status });
  return normalizeListing(extractEntity(payload, ['data', 'item', 'result']) || { id: listingId, status });
}

export async function fetchProfileProposals() {
  return getCollection(await httpClient.get(API_ENDPOINTS.profile.proposals), ['proposals', 'items']).map(normalizeProposal);
}

export async function updateProfileProposalStatus(proposalId, status) {
  const payload = await httpClient.patch(buildProfileProposalStatusEndpoint(proposalId), { status });
  return normalizeProposal(extractEntity(payload, ['data', 'item', 'result']) || { id: proposalId, status });
}

export async function fetchProfileReviews() {
  return getCollection(await httpClient.get(API_ENDPOINTS.profile.reviews), ['reviews', 'items']).map(normalizeReview);
}

export async function fetchSavedItems() {
  return getCollection(await httpClient.get(API_ENDPOINTS.profile.saved), ['saved', 'savedItems', 'items']).map(normalizeSavedItem);
}

export async function removeSavedItem(savedItemId) {
  await httpClient.delete(buildProfileSavedItemEndpoint(savedItemId));
  return savedItemId;
}

export async function fetchNotifications() {
  return getCollection(await httpClient.get(API_ENDPOINTS.profile.notifications), ['notifications', 'items']).map(normalizeNotification);
}

export async function markNotificationAsRead(notificationId) {
  const payload = await httpClient.patch(buildProfileNotificationReadEndpoint(notificationId), { isRead: true });
  return normalizeNotification(extractEntity(payload, ['data', 'item', 'result']) || { id: notificationId, isRead: true });
}

export async function fetchMessages() {
  return getCollection(await httpClient.get(API_ENDPOINTS.profile.messages), ['messages', 'items']).map(normalizeMessage);
}

export async function markMessageAsRead(messageId) {
  const payload = await httpClient.patch(buildProfileMessageReadEndpoint(messageId), { isRead: true });
  return normalizeMessage(extractEntity(payload, ['data', 'item', 'result']) || { id: messageId, isRead: true });
}
