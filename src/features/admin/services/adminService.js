import {
  API_BASE_URL,
  API_ENDPOINTS,
  buildAdminVerificationTicketEndpoint,
  buildAdminCategoryIconEndpoint,
  buildAdminCategoryStatusEndpoint,
  buildAdminFeaturedEndpoint,
  buildAdminJobMediaEndpoint,
  buildAdminJobMediaItemEndpoint,
  buildAdminJobMediaPrimaryEndpoint,
  buildAdminJobMediaReorderEndpoint,
  buildAdminJobStatusEndpoint,
  buildAdminJobVisibilityEndpoint,
  buildAdminResourceEndpoint,
  buildAdminTalentAvatarEndpoint,
  buildAdminTalentStatusEndpoint,
  buildAdminUserAvatarEndpoint,
  buildAdminUserPasswordEndpoint,
  buildAdminUserStatusEndpoint
} from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { extractCollection } from '../../../shared/lib/response/extractCollection.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';

const adminRuntimeCache = {
  categoryOptions: []
};
const supportedImageMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

const apiOrigin = (() => {
  try {
    const fallbackOrigin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
    return new URL(API_BASE_URL, fallbackOrigin).origin;
  } catch {
    return '';
  }
})();

function sanitizeUrl(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function isDataUrl(value) {
  return /^data:/i.test(sanitizeUrl(value));
}

function isAbsoluteUrl(value) {
  return /^https?:\/\//i.test(sanitizeUrl(value));
}

function resolveApiAssetUrl(value) {
  const trimmedValue = sanitizeUrl(value);

  if (!trimmedValue || isDataUrl(trimmedValue) || isAbsoluteUrl(trimmedValue)) {
    return trimmedValue;
  }

  if (trimmedValue.startsWith('/')) {
    return apiOrigin ? `${apiOrigin}${trimmedValue}` : trimmedValue;
  }

  return trimmedValue;
}

function stripApiOrigin(value) {
  const trimmedValue = sanitizeUrl(value);

  if (!trimmedValue || isDataUrl(trimmedValue) || !apiOrigin) {
    return trimmedValue;
  }

  try {
    const parsedUrl = new URL(trimmedValue);

    if (parsedUrl.origin === apiOrigin && parsedUrl.pathname.startsWith('/api/')) {
      return `${parsedUrl.pathname}${parsedUrl.search}`;
    }
  } catch {
    return trimmedValue;
  }

  return trimmedValue;
}

function getFileExtension(contentType) {
  switch (contentType.toLowerCase()) {
    case 'image/jpeg':
      return 'jpg';
    case 'image/webp':
      return 'webp';
    case 'image/png':
    default:
      return 'png';
  }
}

function dataUrlToFile(dataUrl, fileNamePrefix = 'image') {
  const trimmedValue = sanitizeUrl(dataUrl);
  const [metadata, encodedData] = trimmedValue.split(',');

  if (!metadata || !encodedData) {
    throw new Error('Image preview data is invalid.');
  }

  const mimeType = metadata.match(/data:(.*?);base64/i)?.[1] || 'image/png';

  if (!supportedImageMimeTypes.has(mimeType.toLowerCase())) {
    throw new Error('Only JPG, PNG and WEBP images can be uploaded.');
  }

  const binary = window.atob(encodedData);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new File([bytes], `${fileNamePrefix}.${getFileExtension(mimeType)}`, { type: mimeType });
}

async function uploadAdminImage(dataUrl, fileNamePrefix = 'image') {
  const formData = new FormData();
  formData.append('file', dataUrlToFile(dataUrl, fileNamePrefix));

  const payload = await httpClient.post(API_ENDPOINTS.media.uploadImage, formData);
  const entity = extractEntity(payload, ['data', 'item', 'result']) || payload;

  return sanitizeUrl(pickFirst(entity.url, entity.path, entity.imageUrl, ''));
}

function createAssetResolver() {
  const cache = new Map();

  return async (value, fileNamePrefix = 'image') => {
    const trimmedValue = sanitizeUrl(value);

    if (!trimmedValue) {
      return '';
    }

    if (cache.has(trimmedValue)) {
      return cache.get(trimmedValue);
    }

    const resolvedValue = isDataUrl(trimmedValue)
      ? await uploadAdminImage(trimmedValue, fileNamePrefix)
      : stripApiOrigin(trimmedValue);

    cache.set(trimmedValue, resolvedValue);
    return resolvedValue;
  };
}

async function prepareMediaItems(items = [], fileNamePrefix, resolveAssetValue) {
  if (!Array.isArray(items)) {
    return [];
  }

  const preparedItems = await Promise.all(
    items.map(async (item, index) => ({
      ...item,
      url: await resolveAssetValue(item?.url, `${fileNamePrefix}-${index + 1}`)
    }))
  );

  return preparedItems.filter((item) => item.url);
}

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
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

function normalizeMeta(meta = {}, fallbackLength = 0, page = 1, pageSize = 10) {
  const total = Number(meta.total ?? fallbackLength);
  const safePageSize = Number(meta.pageSize ?? pageSize) || 10;
  const safePage = Number(meta.page ?? page) || 1;

  return {
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages: Math.max(1, Number(meta.totalPages ?? Math.ceil(total / safePageSize)) || 1)
  };
}

function normalizePositiveInteger(value, fallbackValue, maximumValue = Number.MAX_SAFE_INTEGER) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return fallbackValue;
  }

  return Math.min(Math.trunc(numericValue), maximumValue);
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

function formatCurrency(amount) {
  return `$${Number(amount || 0).toLocaleString()}`;
}

function createId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function buildInitials(value = '') {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0])
    .join('')
    .toUpperCase();
}

function normalizeMediaItem(item = {}, fallbackSortOrder = 1) {
  const url = resolveApiAssetUrl(pickFirst(item.url, item.imageUrl, item.src, ''));

  return {
    id: pickFirst(item.id, item._id, createId('med')),
    url,
    type: pickFirst(item.type, 'image'),
    isPrimary: Boolean(pickFirst(item.isPrimary, item.primary, false)),
    sortOrder: Number(pickFirst(item.sortOrder, fallbackSortOrder)) || fallbackSortOrder
  };
}

function normalizeMediaList(items = [], coverImageUrl = '') {
  const baseItems = Array.isArray(items) ? items : [];
  let result = baseItems.map((item, index) => normalizeMediaItem(item, index + 1)).filter((item) => item.url);

  if (!result.length && coverImageUrl) {
    result = [{ id: createId('med'), url: coverImageUrl, type: 'image', isPrimary: true, sortOrder: 1 }];
  }

  if (result.length && !result.some((item) => item.isPrimary)) {
    result[0] = { ...result[0], isPrimary: true };
  }

  return result
    .sort((left, right) => Number(left.sortOrder || 0) - Number(right.sortOrder || 0))
    .map((item, index) => ({ ...item, sortOrder: index + 1 }));
}

function getPrimaryMediaUrl(media = [], fallbackCover = '') {
  const primary = media.find((item) => item.isPrimary) || media[0];
  return primary?.url || fallbackCover || '';
}

function normalizeUser(item = {}) {
  const fullName = pickFirst(item.fullName, item.name, `${item.firstName || ''} ${item.lastName || ''}`.trim(), 'Unknown user');
  const resolvedRole = toLower(pickFirst(item.role, item.primaryRole, 'client'));
  const normalizedRole = resolvedRole === 'member' ? 'client' : resolvedRole;

  return {
    id: pickFirst(item.id, item._id, createId('usr')),
    fullName,
    email: pickFirst(item.email, 'unknown@example.com'),
    username: pickFirst(item.username, item.userName, fullName.toLowerCase().replace(/[^a-z0-9]+/g, ''), ''),
    role: normalizedRole,
    status: toLower(pickFirst(item.status, 'active')),
    phone: pickFirst(item.phone, item.phoneNumber, ''),
    country: pickFirst(item.country, item.location, ''),
    bio: pickFirst(item.bio, item.description, ''),
    avatarUrl: resolveApiAssetUrl(pickFirst(item.avatarUrl, item.avatar, item.imageUrl, '')),
    initials: pickFirst(item.initials, buildInitials(fullName), 'US'),
    registeredAt: pickFirst(item.registeredAt, item.createdAt, new Date().toISOString()),
    isVerified: Boolean(pickFirst(item.isVerified, false)),
    verificationStatus: toLower(pickFirst(item.verificationStatus, item.verification, item.isVerified ? 'verified' : 'unverified'))
  };
}

function normalizeUserTaskStats(item = {}) {
  return {
    total: Number(pickFirst(item.total, 0)) || 0,
    active: Number(pickFirst(item.active, 0)) || 0,
    pending: Number(pickFirst(item.pending, 0)) || 0,
    closed: Number(pickFirst(item.closed, 0)) || 0
  };
}

function normalizeUserTask(item = {}) {
  return {
    id: pickFirst(item.id, item._id, createId('task')),
    title: pickFirst(item.title, 'Untitled task'),
    description: pickFirst(item.description, ''),
    categoryName: pickFirst(item.categoryName, item.category, 'General'),
    budget: Number(pickFirst(item.budget, item.amount, 0)) || 0,
    status: toLower(pickFirst(item.status, 'pending')),
    visibility: toLower(pickFirst(item.visibility, 'visible')),
    coverImageUrl: resolveApiAssetUrl(pickFirst(item.coverImageUrl, item.cover, item.imageUrl, '')),
    createdAt: pickFirst(item.createdAt, new Date().toISOString()),
    updatedAt: pickFirst(item.updatedAt, '')
  };
}

function normalizeAdminUserDetail(item = {}) {
  const base = normalizeUser(item);

  return {
    ...base,
    hasAdminAccess: Boolean(pickFirst(item.hasAdminAccess, base.role === 'admin')),
    canPostJobs: Boolean(pickFirst(item.canPostJobs, item.isVerified, false)),
    updatedAt: pickFirst(item.updatedAt, ''),
    verificationRequestedAt: pickFirst(item.verificationRequestedAt, ''),
    verificationReviewedAt: pickFirst(item.verificationReviewedAt, ''),
    verificationNote: pickFirst(item.verificationNote, ''),
    taskStats: normalizeUserTaskStats(item.taskStats || {}),
    tasks: resolveCollection(item.tasks || []).map(normalizeUserTask)
  };
}

function normalizeCategory(item = {}) {
  return {
    id: pickFirst(item.id, item._id, createId('cat')),
    name: pickFirst(item.name, item.title, 'Category'),
    slug: pickFirst(item.slug, item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'category'),
    status: toLower(pickFirst(item.status, 'active')),
    iconUrl: resolveApiAssetUrl(pickFirst(item.iconUrl, item.imageUrl, item.image, ''))
  };
}

function normalizeJob(item = {}) {
  const media = normalizeMediaList(item.media, pickFirst(item.coverImageUrl, item.cover, item.imageUrl, ''));
  const coverImageUrl = resolveApiAssetUrl(pickFirst(item.coverImageUrl, item.cover, getPrimaryMediaUrl(media, item.imageUrl), ''));

  return {
    id: pickFirst(item.id, item._id, createId('job')),
    title: pickFirst(item.title, item.name, 'Untitled job'),
    categoryId: pickFirst(item.categoryId, item.category?.id, ''),
    categoryName: pickFirst(item.categoryName, item.category?.name, item.category, 'General'),
    budget: Number(pickFirst(item.budget, item.amount, 0)) || 0,
    ownerId: pickFirst(item.ownerId, item.userId, ''),
    ownerName: pickFirst(item.ownerName, item.owner?.name, item.owner, 'Client'),
    status: toLower(pickFirst(item.status, 'pending')),
    visibility: toLower(pickFirst(item.visibility, 'visible')),
    description: pickFirst(item.description, item.summary, ''),
    coverImageUrl,
    media,
    tags: Array.isArray(item.tags) ? item.tags : [],
    createdAt: pickFirst(item.createdAt, item.publishedAt, new Date().toISOString())
  };
}

function normalizeTalent(item = {}) {
  return {
    id: pickFirst(item.id, item._id, createId('tal')),
    name: pickFirst(item.name, 'Talent'),
    title: pickFirst(item.title, item.professionalTitle, 'Professional'),
    skill: pickFirst(item.skill, item.primarySkill, 'General'),
    categoryId: pickFirst(item.categoryId, ''),
    categoryName: pickFirst(item.categoryName, item.category, ''),
    rating: Number(pickFirst(item.rating, 0)) || 0,
    imageUrl: resolveApiAssetUrl(pickFirst(item.imageUrl, item.avatar, '')),
    status: toLower(pickFirst(item.status, 'active')),
    featured: Boolean(pickFirst(item.featured, false)),
    bio: pickFirst(item.bio, item.description, '')
  };
}

function normalizePricing(item = {}) {
  return {
    id: pickFirst(item.id, item._id, createId('pkg')),
    name: pickFirst(item.name, 'Package'),
    price: Number(pickFirst(item.price, 0)) || 0,
    features: Array.isArray(item.features) ? item.features.filter(Boolean) : [],
    status: toLower(pickFirst(item.status, 'active')),
    badge: pickFirst(item.badge, '')
  };
}

function normalizeVerificationTicket(item = {}) {
  return {
    id: pickFirst(item.id, item._id, createId('ver')),
    userId: pickFirst(item.userId, ''),
    fullName: pickFirst(item.fullName, item.name, 'Unknown user'),
    email: pickFirst(item.email, 'unknown@example.com'),
    subject: pickFirst(item.subject, 'Verification request'),
    message: pickFirst(item.message, ''),
    portfolioUrl: pickFirst(item.portfolioUrl, ''),
    status: toLower(pickFirst(item.status, 'pending')),
    createdAt: pickFirst(item.createdAt, new Date().toISOString()),
    reviewedAt: pickFirst(item.reviewedAt, ''),
    adminNote: pickFirst(item.adminNote, '')
  };
}

function normalizeAuditLog(item = {}) {
  const detailsJson = pickFirst(item.detailsJson, item.details, item.payload, '');
  const rawSuccess = pickFirst(item.isSuccessful, item.success, item.isSuccess, false);

  return {
    id: pickFirst(item.id, item._id, createId('audit')),
    userId: pickFirst(item.userId, ''),
    actorType: pickFirst(item.actorType, 'Anonim'),
    actorName: pickFirst(item.actorName, item.fullName, item.name, 'Unknown actor'),
    actorEmail: pickFirst(item.actorEmail, item.email, ''),
    actorRoles: pickFirst(item.actorRoles, ''),
    category: pickFirst(item.category, 'API'),
    actionName: pickFirst(item.actionName, item.action, 'Request'),
    messageAz: pickFirst(item.messageAz, item.message, 'No message'),
    detailsJson: typeof detailsJson === 'string' ? detailsJson : JSON.stringify(detailsJson),
    httpMethod: pickFirst(item.httpMethod, item.method, 'GET'),
    path: pickFirst(item.path, item.url, ''),
    queryString: pickFirst(item.queryString, ''),
    ipAddress: pickFirst(item.ipAddress, ''),
    userAgent: pickFirst(item.userAgent, ''),
    traceId: pickFirst(item.traceId, ''),
    source: pickFirst(item.source, 'HTTP'),
    statusCode: Number(pickFirst(item.statusCode, 0)) || 0,
    isSuccessful: Boolean(rawSuccess),
    occurredAt: pickFirst(item.occurredAt, item.createdAt, new Date().toISOString())
  };
}

function normalizeOverviewResponse(payload) {
  const root = extractEntity(payload, ['data', 'result', 'payload']) || {};
  const totals = root.totals || {};

  return {
    totals: {
      users: Number(pickFirst(totals.users, root.totalUsers, 0)),
      verifiedUsers: Number(pickFirst(totals.verifiedUsers, root.totalVerifiedUsers, totals.freelancers, root.totalFreelancers, 0)),
      pendingVerification: Number(pickFirst(totals.pendingVerification, root.pendingVerification, 0)),
      jobs: Number(pickFirst(totals.jobs, root.totalJobs, 0)),
      activeCategories: Number(pickFirst(totals.activeCategories, root.activeCategories, 0)),
      featuredTalent: Number(pickFirst(totals.featuredTalent, root.featuredTalent, 0)),
      activePackages: Number(pickFirst(totals.activePackages, root.activePackages, 0)),
      mediaItems: Number(pickFirst(totals.mediaItems, root.mediaItems, 0))
    },
    recentJobs: resolveCollection(root.recentJobs || []).map(normalizeJob),
    recentUsers: resolveCollection(root.recentUsers || []).map(normalizeUser)
  };
}

function normalizeListPayload(payload, mapper, params = {}) {
  const root = extractEntity(payload, ['data', 'result', 'payload']) || payload || {};
  const items = resolveCollection(extractEntity(root, ['items', 'data']) || root).map(mapper);
  const meta = normalizeMeta(extractEntity(root, ['meta', 'pagination']) || root.meta || {}, items.length, params.page, params.pageSize);

  return {
    items,
    meta
  };
}

function syncCategoryOptions(items = []) {
  adminRuntimeCache.categoryOptions = items.filter((item) => item.status === 'active');
}

export function getAdminCategoryOptions() {
  return adminRuntimeCache.categoryOptions;
}

export function getPricingSummary(items = []) {
  return items.map((item) => ({ ...item, formattedPrice: formatCurrency(item.price) }));
}

export async function fetchAdminOverview() {
  const payload = await httpClient.get(API_ENDPOINTS.admin.dashboardOverview);
  return normalizeOverviewResponse(payload);
}

export async function fetchAdminUsers(params = {}) {
  const payload = await httpClient.get(API_ENDPOINTS.admin.users, { query: params });
  return normalizeListPayload(payload, normalizeUser, params);
}

export async function fetchAdminUserById(id) {
  const payload = await httpClient.get(buildAdminResourceEndpoint(API_ENDPOINTS.admin.users, id));
  return normalizeAdminUserDetail(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminUser(id, values) {
  const resolveAssetValue = createAssetResolver();
  const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.users, id), {
    ...values,
    avatarUrl: await resolveAssetValue(values?.avatarUrl, `user-${id}-avatar`)
  });
  return normalizeUser(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminUserAvatar(id, avatarUrl) {
  const resolveAssetValue = createAssetResolver();
  const payload = await httpClient.patch(buildAdminUserAvatarEndpoint(id), {
    avatarUrl: await resolveAssetValue(avatarUrl, `user-${id}-avatar`)
  });
  return normalizeUser(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminUserStatus(id, status) {
  const payload = await httpClient.patch(buildAdminUserStatusEndpoint(id), { status });
  return normalizeUser(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminUserPassword(id, values) {
  return httpClient.patch(buildAdminUserPasswordEndpoint(id), values);
}

export async function deleteAdminUser(id) {
  await httpClient.delete(buildAdminResourceEndpoint(API_ENDPOINTS.admin.users, id));
  return { success: true, id };
}

export async function fetchAdminVerificationTickets(params = {}) {
  const payload = await httpClient.get(API_ENDPOINTS.admin.verificationTickets, { query: params });
  return resolveCollection(extractEntity(payload, ['data', 'items', 'result']) || payload).map(normalizeVerificationTicket);
}

export async function reviewAdminVerificationTicket(ticketId, values) {
  const payload = await httpClient.patch(buildAdminVerificationTicketEndpoint(ticketId), values);
  return normalizeVerificationTicket(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function fetchAdminAuditLogs(params = {}) {
  const query = {
    ...params,
    actorType: params.actorType === 'all' ? undefined : params.actorType,
    category: params.category === 'all' ? undefined : params.category,
    isSuccessful:
      params.result === 'all' || params.result === undefined
        ? undefined
        : params.result === 'success'
          ? true
          : false
  };

  delete query.result;

  const payload = await httpClient.get(API_ENDPOINTS.admin.auditLogs, { query });
  return resolveCollection(extractEntity(payload, ['data', 'items', 'result']) || payload).map(normalizeAuditLog);
}

export async function fetchAdminJobs(params = {}) {
  const query = {
    ...params,
    search: normalizeTextFilter(params.search),
    categoryId: normalizeSelectFilter(params.categoryId),
    status: params.status || undefined,
    page: normalizePositiveInteger(params.page, 1),
    pageSize: normalizePositiveInteger(params.pageSize, 10, 100)
  };
  const payload = await httpClient.get(API_ENDPOINTS.admin.jobs, { query });
  return normalizeListPayload(payload, normalizeJob, query);
}

export async function fetchAdminJobById(id) {
  const payload = await httpClient.get(buildAdminResourceEndpoint(API_ENDPOINTS.admin.jobs, id));
  return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminJob(id, values) {
  const resolveAssetValue = createAssetResolver();
  const media = await prepareMediaItems(values?.media, `job-${id}-media`, resolveAssetValue);
  const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.jobs, id), {
    ...values,
    coverImageUrl: await resolveAssetValue(values?.coverImageUrl || media[0]?.url, `job-${id}-cover`),
    media
  });
  return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminJobStatus(id, status) {
  const payload = await httpClient.patch(buildAdminJobStatusEndpoint(id), { status });
  return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminJobVisibility(id, visibility) {
  const payload = await httpClient.patch(buildAdminJobVisibilityEndpoint(id), { visibility });
  return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function addAdminJobMedia(id, mediaItem) {
  const resolveAssetValue = createAssetResolver();
  const payload = await httpClient.post(buildAdminJobMediaEndpoint(id), {
    ...mediaItem,
    url: await resolveAssetValue(mediaItem?.url, `job-${id}-media`)
  });
  return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function removeAdminJobMedia(id, mediaId) {
  await httpClient.delete(buildAdminJobMediaItemEndpoint(id, mediaId));
  return { success: true, id, mediaId };
}

export async function setAdminJobPrimaryMedia(id, mediaId) {
  const payload = await httpClient.patch(buildAdminJobMediaPrimaryEndpoint(id, mediaId), { mediaId });
  return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function reorderAdminJobMedia(id, mediaIds = []) {
  const payload = await httpClient.patch(buildAdminJobMediaReorderEndpoint(id), { mediaIds });
  return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function deleteAdminJob(id) {
  await httpClient.delete(buildAdminResourceEndpoint(API_ENDPOINTS.admin.jobs, id));
  return { success: true, id };
}

export async function fetchAdminCategories(params = {}) {
  const query = {
    ...params,
    search: normalizeTextFilter(params.search),
    status: params.status || undefined,
    page: normalizePositiveInteger(params.page, 1),
    pageSize: normalizePositiveInteger(params.pageSize, 10, 100)
  };
  const payload = await httpClient.get(API_ENDPOINTS.admin.categories, { query });
  const response = normalizeListPayload(payload, normalizeCategory, query);
  syncCategoryOptions(response.items);
  return response;
}

export async function createAdminCategory(values) {
  const resolveAssetValue = createAssetResolver();
  const payload = await httpClient.post(API_ENDPOINTS.admin.categories, {
    ...values,
    iconUrl: await resolveAssetValue(values?.iconUrl, 'category-icon')
  });
  const category = normalizeCategory(extractEntity(payload, ['data', 'item', 'result']) || payload);
  syncCategoryOptions([...adminRuntimeCache.categoryOptions.filter((item) => item.id !== category.id), category]);
  return category;
}

export async function updateAdminCategory(id, values) {
  const resolveAssetValue = createAssetResolver();
  const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.categories, id), {
    ...values,
    iconUrl: await resolveAssetValue(values?.iconUrl, `category-${id}-icon`)
  });
  const category = normalizeCategory(extractEntity(payload, ['data', 'item', 'result']) || payload);
  syncCategoryOptions([...adminRuntimeCache.categoryOptions.filter((item) => item.id !== category.id), category]);
  return category;
}

export async function updateAdminCategoryIcon(id, iconUrl) {
  const resolveAssetValue = createAssetResolver();
  const payload = await httpClient.patch(buildAdminCategoryIconEndpoint(id), {
    iconUrl: await resolveAssetValue(iconUrl, `category-${id}-icon`)
  });
  const category = normalizeCategory(extractEntity(payload, ['data', 'item', 'result']) || payload);
  syncCategoryOptions([...adminRuntimeCache.categoryOptions.filter((item) => item.id !== category.id), category]);
  return category;
}

export async function updateAdminCategoryStatus(id, status) {
  const payload = await httpClient.patch(buildAdminCategoryStatusEndpoint(id), { status });
  const category = normalizeCategory(extractEntity(payload, ['data', 'item', 'result']) || payload);
  syncCategoryOptions([...adminRuntimeCache.categoryOptions.filter((item) => item.id !== category.id), category]);
  return category;
}

export async function deleteAdminCategory(id) {
  await httpClient.delete(buildAdminResourceEndpoint(API_ENDPOINTS.admin.categories, id));
  syncCategoryOptions(adminRuntimeCache.categoryOptions.filter((item) => item.id !== id));
  return { success: true, id };
}

export async function fetchAdminTalent(params = {}) {
  const payload = await httpClient.get(API_ENDPOINTS.admin.talent, { query: params });
  return normalizeListPayload(payload, normalizeTalent, params);
}

export async function createAdminTalent(values) {
  const resolveAssetValue = createAssetResolver();
  const payload = await httpClient.post(API_ENDPOINTS.admin.talent, {
    ...values,
    imageUrl: await resolveAssetValue(values?.imageUrl, 'talent-avatar')
  });
  return normalizeTalent(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminTalent(id, values) {
  const resolveAssetValue = createAssetResolver();
  const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.talent, id), {
    ...values,
    imageUrl: await resolveAssetValue(values?.imageUrl, `talent-${id}-avatar`)
  });
  return normalizeTalent(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminTalentStatus(id, status) {
  const payload = await httpClient.patch(buildAdminTalentStatusEndpoint(id), { status });
  return normalizeTalent(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminTalentFeatured(id, featured) {
  const payload = await httpClient.patch(buildAdminFeaturedEndpoint(id), { featured });
  return normalizeTalent(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminTalentAvatar(id, imageUrl) {
  const resolveAssetValue = createAssetResolver();
  const payload = await httpClient.patch(buildAdminTalentAvatarEndpoint(id), {
    imageUrl: await resolveAssetValue(imageUrl, `talent-${id}-avatar`)
  });
  return normalizeTalent(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function deleteAdminTalent(id) {
  await httpClient.delete(buildAdminResourceEndpoint(API_ENDPOINTS.admin.talent, id));
  return { success: true, id };
}

export async function fetchAdminPricing(params = {}) {
  const payload = await httpClient.get(API_ENDPOINTS.admin.pricing, { query: params });
  return normalizeListPayload(payload, normalizePricing, params);
}

export async function createAdminPricing(values) {
  const payload = await httpClient.post(API_ENDPOINTS.admin.pricing, values);
  return normalizePricing(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function updateAdminPricing(id, values) {
  const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.pricing, id), values);
  return normalizePricing(extractEntity(payload, ['data', 'item', 'result']) || payload);
}

export async function deleteAdminPricing(id) {
  await httpClient.delete(buildAdminResourceEndpoint(API_ENDPOINTS.admin.pricing, id));
  return { success: true, id };
}
