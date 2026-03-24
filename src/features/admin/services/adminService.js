import {
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
  buildAdminUserStatusEndpoint
} from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';
import { STORAGE_KEYS } from '../../../shared/constants/storageKeys.js';
import { fallbackAdminContent } from '../data/fallbackAdminContent.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeStorageGet(key) {
  try {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeStorageSet(key, value) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // ignore storage errors in demo mode
  }
}

function createDefaultStore() {
  return {
    users: clone(fallbackAdminContent.users),
    verificationTickets: clone(fallbackAdminContent.verificationTickets || []),
    categories: clone(fallbackAdminContent.categories),
    jobs: clone(fallbackAdminContent.jobs),
    talent: clone(fallbackAdminContent.talent),
    pricing: clone(fallbackAdminContent.pricing)
  };
}

function loadPersistedStore() {
  const rawValue = safeStorageGet(STORAGE_KEYS.adminContent);

  if (!rawValue) {
    return createDefaultStore();
  }

  try {
    const parsed = JSON.parse(rawValue);
    return {
      ...createDefaultStore(),
      ...parsed,
      users: Array.isArray(parsed?.users) ? parsed.users : clone(fallbackAdminContent.users),
      verificationTickets: Array.isArray(parsed?.verificationTickets)
        ? parsed.verificationTickets
        : clone(fallbackAdminContent.verificationTickets || []),
      categories: Array.isArray(parsed?.categories) ? parsed.categories : clone(fallbackAdminContent.categories),
      jobs: Array.isArray(parsed?.jobs) ? parsed.jobs : clone(fallbackAdminContent.jobs),
      talent: Array.isArray(parsed?.talent) ? parsed.talent : clone(fallbackAdminContent.talent),
      pricing: Array.isArray(parsed?.pricing) ? parsed.pricing : clone(fallbackAdminContent.pricing)
    };
  } catch {
    return createDefaultStore();
  }
}

const adminStore = loadPersistedStore();

function persistStore() {
  safeStorageSet(STORAGE_KEYS.adminContent, JSON.stringify(adminStore));
}

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function toLower(value) {
  return String(value || '').trim().toLowerCase();
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

function buildListResponse(items, params = {}) {
  const page = Math.max(1, Number(params.page || 1));
  const pageSize = Math.max(1, Number(params.pageSize || 10));
  const start = (page - 1) * pageSize;
  const pagedItems = items.slice(start, start + pageSize);

  return {
    items: pagedItems,
    meta: {
      page,
      pageSize,
      total: items.length,
      totalPages: Math.max(1, Math.ceil(items.length / pageSize))
    }
  };
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
  const url = pickFirst(item.url, item.imageUrl, item.src, '');

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
    .map((item, index) => ({ ...item, sortOrder: index + 1, isPrimary: index === 0 ? Boolean(item.isPrimary) : Boolean(item.isPrimary) }));
}

function getPrimaryMediaUrl(media = [], fallbackCover = '') {
  const primary = media.find((item) => item.isPrimary) || media[0];
  return primary?.url || fallbackCover || '';
}

function normalizeUser(item = {}) {
  const fullName = pickFirst(item.fullName, item.name, `${item.firstName || ''} ${item.lastName || ''}`.trim(), 'Unknown user');

  return {
    id: pickFirst(item.id, item._id, createId('usr')),
    fullName,
    email: pickFirst(item.email, 'unknown@example.com'),
    username: pickFirst(item.username, item.userName, fullName.toLowerCase().replace(/[^a-z0-9]+/g, ''), ''),
    role: toLower(pickFirst(item.role, 'member')),
    status: toLower(pickFirst(item.status, 'active')),
    phone: pickFirst(item.phone, item.phoneNumber, ''),
    country: pickFirst(item.country, item.location, ''),
    bio: pickFirst(item.bio, item.description, ''),
    avatarUrl: pickFirst(item.avatarUrl, item.avatar, item.imageUrl, ''),
    initials: pickFirst(item.initials, buildInitials(fullName), 'US'),
    registeredAt: pickFirst(item.registeredAt, item.createdAt, new Date().toISOString()),
    isVerified: Boolean(pickFirst(item.isVerified, false)),
    verificationStatus: toLower(pickFirst(item.verificationStatus, item.verification, item.isVerified ? 'verified' : 'unverified'))
  };
}

function normalizeCategory(item = {}) {
  return {
    id: pickFirst(item.id, item._id, createId('cat')),
    name: pickFirst(item.name, item.title, 'Category'),
    slug: pickFirst(item.slug, item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'category'),
    status: toLower(pickFirst(item.status, 'active')),
    iconUrl: pickFirst(item.iconUrl, item.imageUrl, item.image, '')
  };
}

function normalizeJob(item = {}) {
  const media = normalizeMediaList(item.media, pickFirst(item.coverImageUrl, item.cover, item.imageUrl, ''));
  const coverImageUrl = pickFirst(item.coverImageUrl, item.cover, getPrimaryMediaUrl(media, item.imageUrl), '');

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
    imageUrl: pickFirst(item.imageUrl, item.avatar, ''),
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
    recentJobs: Array.isArray(root.recentJobs) ? root.recentJobs.map(normalizeJob) : [],
    recentUsers: Array.isArray(root.recentUsers) ? root.recentUsers.map(normalizeUser) : []
  };
}

function normalizeListPayload(payload, mapper, params) {
  const root = extractEntity(payload, ['data', 'result', 'payload']) || payload || {};
  const items = Array.isArray(root) ? root : Array.isArray(root.data) ? root.data : Array.isArray(root.items) ? root.items : [];
  const meta = normalizeMeta(root.meta || {}, items.length, params.page, params.pageSize);

  return {
    items: items.map(mapper),
    meta
  };
}

function filterCollection(items, params = {}, searchKeys = []) {
  const search = toLower(params.search);
  let result = [...items];

  if (search) {
    result = result.filter((item) => searchKeys.some((key) => String(item[key] || '').toLowerCase().includes(search)));
  }

  return result;
}

function sortByDateDesc(left, right, key) {
  return new Date(right[key]).getTime() - new Date(left[key]).getTime();
}

function buildFallbackOverview() {
  const users = adminStore.users.map(normalizeUser);
  const jobs = adminStore.jobs.map(normalizeJob);
  const categories = adminStore.categories.map(normalizeCategory);
  const talent = adminStore.talent.map(normalizeTalent);
  const pricing = adminStore.pricing.map(normalizePricing);
  const mediaItems = jobs.reduce((sum, item) => sum + item.media.length, 0);

  return {
    totals: {
      users: users.length,
      verifiedUsers: users.filter((item) => item.isVerified).length,
      pendingVerification: users.filter((item) => item.verificationStatus === 'pending').length,
      jobs: jobs.length,
      activeCategories: categories.filter((item) => item.status === 'active').length,
      featuredTalent: talent.filter((item) => item.featured).length,
      activePackages: pricing.filter((item) => item.status === 'active').length,
      mediaItems
    },
    recentJobs: [...jobs].sort((a, b) => sortByDateDesc(a, b, 'createdAt')).slice(0, 5),
    recentUsers: [...users].sort((a, b) => sortByDateDesc(a, b, 'registeredAt')).slice(0, 5)
  };
}

function fallbackUsers(params = {}) {
  let items = adminStore.users.map(normalizeUser);
  items = filterCollection(items, params, ['fullName', 'email', 'username', 'country']);

  const role = toLower(params.role || 'all');
  const status = toLower(params.status || 'all');
  const verificationStatus = toLower(params.verificationStatus || 'all');

  if (role !== 'all') {
    items = items.filter((item) => item.role === role);
  }

  if (status !== 'all') {
    items = items.filter((item) => item.status === status);
  }

  if (verificationStatus !== 'all') {
    items = items.filter((item) => item.verificationStatus === verificationStatus);
  }

  items = [...items].sort((a, b) => sortByDateDesc(a, b, 'registeredAt'));
  return buildListResponse(items, params);
}

function fallbackJobs(params = {}) {
  let items = adminStore.jobs.map(normalizeJob);
  items = filterCollection(items, params, ['title', 'categoryName', 'ownerName', 'description']);

  const categoryId = toLower(params.categoryId || 'all');
  const status = toLower(params.status || 'all');
  const visibility = toLower(params.visibility || 'all');

  if (categoryId !== 'all') {
    items = items.filter((item) => toLower(item.categoryId) === categoryId || toLower(item.categoryName) === categoryId);
  }

  if (status !== 'all') {
    items = items.filter((item) => item.status === status);
  }

  if (visibility !== 'all') {
    items = items.filter((item) => item.visibility === visibility);
  }

  items = [...items].sort((a, b) => sortByDateDesc(a, b, 'createdAt'));
  return buildListResponse(items, params);
}

function fallbackCategories(params = {}) {
  let items = adminStore.categories.map(normalizeCategory);
  items = filterCollection(items, params, ['name', 'slug']);

  const status = toLower(params.status || 'all');
  if (status !== 'all') {
    items = items.filter((item) => item.status === status);
  }

  items = [...items].sort((left, right) => left.name.localeCompare(right.name));
  return buildListResponse(items, params);
}

function fallbackTalent(params = {}) {
  let items = adminStore.talent.map(normalizeTalent);
  items = filterCollection(items, params, ['name', 'title', 'skill', 'categoryName']);

  const status = toLower(params.status || 'all');
  const featured = toLower(params.featured || 'all');

  if (status !== 'all') {
    items = items.filter((item) => item.status === status);
  }

  if (featured !== 'all') {
    const isFeatured = featured === 'featured';
    items = items.filter((item) => item.featured === isFeatured);
  }

  items = [...items].sort((left, right) => right.rating - left.rating);
  return buildListResponse(items, params);
}

function fallbackPricing(params = {}) {
  let items = adminStore.pricing.map(normalizePricing);
  items = filterCollection(items, params, ['name', 'badge']);

  const status = toLower(params.status || 'all');
  if (status !== 'all') {
    items = items.filter((item) => item.status === status);
  }

  items = [...items].sort((left, right) => left.price - right.price);
  return buildListResponse(items, params);
}

function fallbackVerificationTickets(params = {}) {
  let items = (adminStore.verificationTickets || []).map(normalizeVerificationTicket);
  const search = toLower(params.search);
  const status = toLower(params.status || 'all');

  if (search) {
    items = items.filter((item) => `${item.fullName} ${item.email} ${item.subject} ${item.message}`.toLowerCase().includes(search));
  }

  if (status !== 'all') {
    items = items.filter((item) => item.status === status);
  }

  return [...items].sort((left, right) => sortByDateDesc(left, right, 'createdAt'));
}

function upsertById(collection, item, mapper) {
  const normalized = mapper(item);
  const index = collection.findIndex((entry) => entry.id === normalized.id);

  if (index >= 0) {
    collection[index] = { ...collection[index], ...normalized };
  } else {
    collection.unshift(normalized);
  }

  persistStore();
  return normalized;
}

function removeById(collection, id) {
  const index = collection.findIndex((entry) => entry.id === id);
  if (index >= 0) {
    collection.splice(index, 1);
    persistStore();
  }
}

function getById(collection, id, mapper) {
  const found = collection.find((item) => item.id === id);
  return found ? mapper(found) : null;
}

function withCategoryName(values = {}) {
  const categories = adminStore.categories.map(normalizeCategory);
  const category = categories.find((item) => item.id === values.categoryId) || categories.find((item) => item.name === values.categoryName);

  return {
    ...values,
    categoryName: values.categoryName || category?.name || 'General'
  };
}

function setPrimaryMedia(items = [], mediaId) {
  return items.map((item, index) => ({
    ...item,
    isPrimary: item.id === mediaId,
    sortOrder: index + 1
  }));
}

export function getAdminSnapshot() {
  return {
    users: adminStore.users.map(normalizeUser),
    categories: adminStore.categories.map(normalizeCategory),
    jobs: adminStore.jobs.map(normalizeJob),
    talent: adminStore.talent.map(normalizeTalent),
    pricing: adminStore.pricing.map(normalizePricing)
  };
}

export function getAdminCategoryOptions() {
  return adminStore.categories.map(normalizeCategory).filter((item) => item.status === 'active');
}

export function getPricingSummary(items = []) {
  return items.map((item) => ({ ...item, formattedPrice: formatCurrency(item.price) }));
}

export function getHomeCategoryTabs() {
  const activeNames = adminStore.categories
    .map(normalizeCategory)
    .filter((item) => item.status === 'active')
    .map((item) => item.name);

  return ['All', ...Array.from(new Set(activeNames))];
}

export function getHomePricingPlans() {
  return adminStore.pricing
    .map(normalizePricing)
    .filter((item) => item.status === 'active')
    .map((item, index) => ({
      name: item.name,
      description: item.badge ? `${item.badge} package for growing marketplace teams.` : 'Flexible plan for marketplace growth.',
      monthly: item.price,
      yearly: item.price * 10,
      features: item.features,
      badge: item.badge,
      isFeatured: index === 1
    }));
}

export function getHomeTalentCollection() {
  return adminStore.talent
    .map(normalizeTalent)
    .filter((item) => item.status === 'active')
    .map((item, index) => ({
      id: item.id,
      name: item.name,
      title: item.title,
      location: 'Remote',
      rating: item.rating,
      reviews: 18 + index * 7,
      price: 45 + index * 8,
      hourlyRate: 45 + index * 8,
      icon: '✨',
      label: item.skill,
      category: item.categoryName || item.skill,
      avatar: item.imageUrl,
      banner: item.imageUrl,
      duration: `${6 + index} Days`,
      tools: [item.skill, item.categoryName || 'Marketplace', 'Delivery'],
      badge: item.featured ? 'Featured Talent' : item.skill,
      featured: item.featured,
      availability: 'Available now',
      completedProjects: 12 + index * 4,
      bio: item.bio
    }));
}

export async function fetchAdminOverview() {
  try {
    const payload = await httpClient.get(API_ENDPOINTS.admin.dashboardOverview);
    return normalizeOverviewResponse(payload);
  } catch {
    return buildFallbackOverview();
  }
}

export async function fetchAdminUsers(params = {}) {
  try {
    const payload = await httpClient.get(API_ENDPOINTS.admin.users, { query: params });
    const response = normalizeListPayload(payload, normalizeUser, { page: 1, pageSize: 1000 });
    return buildListResponse(
      response.items
        .filter((item) => {
          const search = toLower(params.search);
          const role = toLower(params.role || 'all');
          const status = toLower(params.status || 'all');
          const verificationStatus = toLower(params.verificationStatus || 'all');

          const matchesSearch = !search || `${item.fullName} ${item.email} ${item.username} ${item.country}`.toLowerCase().includes(search);
          const matchesRole = role === 'all' || item.role === role;
          const matchesStatus = status === 'all' || item.status === status;
          const matchesVerification = verificationStatus === 'all' || item.verificationStatus === verificationStatus;

          return matchesSearch && matchesRole && matchesStatus && matchesVerification;
        })
        .sort((left, right) => sortByDateDesc(left, right, 'registeredAt')),
      params
    );
  } catch {
    return fallbackUsers(params);
  }
}

export async function fetchAdminUserById(id) {
  try {
    const payload = await httpClient.get(buildAdminResourceEndpoint(API_ENDPOINTS.admin.users, id));
    return normalizeUser(extractEntity(payload, ['data', 'item', 'result']) || {});
  } catch {
    return getById(adminStore.users, id, normalizeUser);
  }
}

export async function updateAdminUser(id, values) {
  try {
    const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.users, id), values);
    return normalizeUser(extractEntity(payload, ['data', 'item', 'result']) || values);
  } catch {
    return upsertById(adminStore.users, { ...getById(adminStore.users, id, normalizeUser), ...values, id }, normalizeUser);
  }
}

export async function updateAdminUserAvatar(id, avatarUrl) {
  try {
    const payload = await httpClient.patch(buildAdminUserAvatarEndpoint(id), { avatarUrl });
    return normalizeUser(extractEntity(payload, ['data', 'item', 'result']) || { id, avatarUrl });
  } catch {
    return upsertById(adminStore.users, { ...getById(adminStore.users, id, normalizeUser), avatarUrl }, normalizeUser);
  }
}

export async function updateAdminUserStatus(id, status) {
  try {
    const payload = await httpClient.patch(buildAdminUserStatusEndpoint(id), { status });
    return normalizeUser(extractEntity(payload, ['data', 'item', 'result']) || { id, status });
  } catch {
    return upsertById(adminStore.users, { ...getById(adminStore.users, id, normalizeUser), status }, normalizeUser);
  }
}

export async function deleteAdminUser(id) {
  try {
    await httpClient.delete(buildAdminResourceEndpoint(API_ENDPOINTS.admin.users, id));
  } catch {
    removeById(adminStore.users, id);
  }

  return { success: true };
}

export async function fetchAdminVerificationTickets(params = {}) {
  try {
    const payload = await httpClient.get(API_ENDPOINTS.admin.verificationTickets, { query: params });
    const items = extractEntity(payload, ['data', 'items', 'result']) || payload;
    return (Array.isArray(items) ? items : [])
      .map(normalizeVerificationTicket)
      .filter((item) => {
        const search = toLower(params.search);
        const status = toLower(params.status || 'all');

        const matchesSearch = !search || `${item.fullName} ${item.email} ${item.subject} ${item.message}`.toLowerCase().includes(search);
        const matchesStatus = status === 'all' || item.status === status;

        return matchesSearch && matchesStatus;
      })
      .sort((left, right) => sortByDateDesc(left, right, 'createdAt'));
  } catch {
    return fallbackVerificationTickets(params);
  }
}

export async function reviewAdminVerificationTicket(ticketId, values) {
  try {
    const payload = await httpClient.patch(buildAdminVerificationTicketEndpoint(ticketId), values);
    return normalizeVerificationTicket(extractEntity(payload, ['data', 'item', 'result']) || payload);
  } catch {
    const nextStatus = toLower(values.status || 'pending');
    adminStore.verificationTickets = (adminStore.verificationTickets || []).map((item) => (
      item.id === ticketId
        ? {
            ...item,
            status: nextStatus,
            adminNote: values.adminNote || item.adminNote,
            reviewedAt: new Date().toISOString()
          }
        : item
    ));

    const reviewedTicket = (adminStore.verificationTickets || []).find((item) => item.id === ticketId);

    if (reviewedTicket?.userId) {
      adminStore.users = adminStore.users.map((user) => (
        user.id === reviewedTicket.userId
          ? {
              ...user,
              isVerified: nextStatus === 'approved',
              verificationStatus: nextStatus === 'approved' ? 'verified' : nextStatus === 'rejected' ? 'rejected' : user.verificationStatus
            }
          : user
      ));
    }

    persistStore();
    return normalizeVerificationTicket(reviewedTicket || { id: ticketId, ...values });
  }
}

export async function fetchAdminJobs(params = {}) {
  try {
    const payload = await httpClient.get(API_ENDPOINTS.admin.jobs, { query: params });
    return normalizeListPayload(payload, normalizeJob, params);
  } catch {
    return fallbackJobs(params);
  }
}

export async function fetchAdminJobById(id) {
  try {
    const payload = await httpClient.get(buildAdminResourceEndpoint(API_ENDPOINTS.admin.jobs, id));
    return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || {});
  } catch {
    return getById(adminStore.jobs, id, normalizeJob);
  }
}

export async function updateAdminJob(id, values) {
  const nextValues = withCategoryName(values);

  try {
    const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.jobs, id), nextValues);
    return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || nextValues);
  } catch {
    return upsertById(adminStore.jobs, { ...getById(adminStore.jobs, id, normalizeJob), ...nextValues, id }, normalizeJob);
  }
}

export async function updateAdminJobStatus(id, status) {
  try {
    const payload = await httpClient.patch(buildAdminJobStatusEndpoint(id), { status });
    return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || { id, status });
  } catch {
    return upsertById(adminStore.jobs, { ...getById(adminStore.jobs, id, normalizeJob), status }, normalizeJob);
  }
}

export async function updateAdminJobVisibility(id, visibility) {
  try {
    const payload = await httpClient.patch(buildAdminJobVisibilityEndpoint(id), { visibility });
    return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || { id, visibility });
  } catch {
    return upsertById(adminStore.jobs, { ...getById(adminStore.jobs, id, normalizeJob), visibility }, normalizeJob);
  }
}

export async function addAdminJobMedia(id, mediaItem) {
  try {
    const payload = await httpClient.post(buildAdminJobMediaEndpoint(id), mediaItem);
    return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || { id });
  } catch {
    const currentJob = getById(adminStore.jobs, id, normalizeJob);
    const nextMedia = normalizeMediaList([...(currentJob?.media || []), mediaItem], currentJob?.coverImageUrl);
    return upsertById(adminStore.jobs, {
      ...currentJob,
      media: nextMedia,
      coverImageUrl: getPrimaryMediaUrl(nextMedia, currentJob?.coverImageUrl)
    }, normalizeJob);
  }
}

export async function removeAdminJobMedia(id, mediaId) {
  try {
    await httpClient.delete(buildAdminJobMediaItemEndpoint(id, mediaId));
  } catch {
    const currentJob = getById(adminStore.jobs, id, normalizeJob);
    const nextMedia = normalizeMediaList((currentJob?.media || []).filter((item) => item.id !== mediaId), '');
    upsertById(adminStore.jobs, {
      ...currentJob,
      media: nextMedia,
      coverImageUrl: getPrimaryMediaUrl(nextMedia, '')
    }, normalizeJob);
  }
}

export async function setAdminJobPrimaryMedia(id, mediaId) {
  try {
    const payload = await httpClient.patch(buildAdminJobMediaPrimaryEndpoint(id, mediaId), { mediaId });
    return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || { id });
  } catch {
    const currentJob = getById(adminStore.jobs, id, normalizeJob);
    const nextMedia = setPrimaryMedia(currentJob?.media || [], mediaId);
    return upsertById(adminStore.jobs, {
      ...currentJob,
      media: nextMedia,
      coverImageUrl: getPrimaryMediaUrl(nextMedia, currentJob?.coverImageUrl)
    }, normalizeJob);
  }
}

export async function reorderAdminJobMedia(id, mediaIds = []) {
  try {
    const payload = await httpClient.patch(buildAdminJobMediaReorderEndpoint(id), { mediaIds });
    return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || { id });
  } catch {
    const currentJob = getById(adminStore.jobs, id, normalizeJob);
    const nextMedia = mediaIds
      .map((mediaId, index) => {
        const found = (currentJob?.media || []).find((item) => item.id === mediaId);
        return found ? { ...found, sortOrder: index + 1, isPrimary: index === 0 ? found.isPrimary : false } : null;
      })
      .filter(Boolean);
    return upsertById(adminStore.jobs, {
      ...currentJob,
      media: nextMedia,
      coverImageUrl: getPrimaryMediaUrl(nextMedia, currentJob?.coverImageUrl)
    }, normalizeJob);
  }
}

export async function deleteAdminJob(id) {
  try {
    await httpClient.delete(buildAdminResourceEndpoint(API_ENDPOINTS.admin.jobs, id));
  } catch {
    removeById(adminStore.jobs, id);
  }

  return { success: true };
}

export async function fetchAdminCategories(params = {}) {
  try {
    const payload = await httpClient.get(API_ENDPOINTS.admin.categories, { query: params });
    return normalizeListPayload(payload, normalizeCategory, params);
  } catch {
    return fallbackCategories(params);
  }
}

export async function createAdminCategory(values) {
  try {
    const payload = await httpClient.post(API_ENDPOINTS.admin.categories, values);
    return normalizeCategory(extractEntity(payload, ['data', 'item', 'result']) || values);
  } catch {
    return upsertById(adminStore.categories, { ...values, id: createId('cat') }, normalizeCategory);
  }
}

export async function updateAdminCategory(id, values) {
  try {
    const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.categories, id), values);
    return normalizeCategory(extractEntity(payload, ['data', 'item', 'result']) || values);
  } catch {
    return upsertById(adminStore.categories, { ...getById(adminStore.categories, id, normalizeCategory), ...values, id }, normalizeCategory);
  }
}

export async function updateAdminCategoryIcon(id, iconUrl) {
  try {
    const payload = await httpClient.patch(buildAdminCategoryIconEndpoint(id), { iconUrl });
    return normalizeCategory(extractEntity(payload, ['data', 'item', 'result']) || { id, iconUrl });
  } catch {
    return upsertById(adminStore.categories, { ...getById(adminStore.categories, id, normalizeCategory), iconUrl }, normalizeCategory);
  }
}

export async function updateAdminCategoryStatus(id, status) {
  try {
    const payload = await httpClient.patch(buildAdminCategoryStatusEndpoint(id), { status });
    return normalizeCategory(extractEntity(payload, ['data', 'item', 'result']) || { id, status });
  } catch {
    return upsertById(adminStore.categories, { ...getById(adminStore.categories, id, normalizeCategory), status }, normalizeCategory);
  }
}

export async function deleteAdminCategory(id) {
  try {
    await httpClient.delete(buildAdminResourceEndpoint(API_ENDPOINTS.admin.categories, id));
  } catch {
    removeById(adminStore.categories, id);
  }

  return { success: true };
}

export async function fetchAdminTalent(params = {}) {
  try {
    const payload = await httpClient.get(API_ENDPOINTS.admin.talent, { query: params });
    return normalizeListPayload(payload, normalizeTalent, params);
  } catch {
    return fallbackTalent(params);
  }
}

export async function createAdminTalent(values) {
  try {
    const payload = await httpClient.post(API_ENDPOINTS.admin.talent, values);
    return normalizeTalent(extractEntity(payload, ['data', 'item', 'result']) || values);
  } catch {
    return upsertById(adminStore.talent, { ...values, id: createId('tal') }, normalizeTalent);
  }
}

export async function updateAdminTalent(id, values) {
  const nextValues = withCategoryName(values);

  try {
    const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.talent, id), nextValues);
    return normalizeTalent(extractEntity(payload, ['data', 'item', 'result']) || nextValues);
  } catch {
    return upsertById(adminStore.talent, { ...getById(adminStore.talent, id, normalizeTalent), ...nextValues, id }, normalizeTalent);
  }
}

export async function updateAdminTalentStatus(id, status) {
  try {
    const payload = await httpClient.patch(buildAdminTalentStatusEndpoint(id), { status });
    return normalizeTalent(extractEntity(payload, ['data', 'item', 'result']) || { id, status });
  } catch {
    return upsertById(adminStore.talent, { ...getById(adminStore.talent, id, normalizeTalent), status }, normalizeTalent);
  }
}

export async function updateAdminTalentFeatured(id, featured) {
  try {
    const payload = await httpClient.patch(buildAdminFeaturedEndpoint(id), { featured });
    return normalizeTalent(extractEntity(payload, ['data', 'item', 'result']) || { id, featured });
  } catch {
    return upsertById(adminStore.talent, { ...getById(adminStore.talent, id, normalizeTalent), featured }, normalizeTalent);
  }
}

export async function updateAdminTalentAvatar(id, imageUrl) {
  try {
    const payload = await httpClient.patch(buildAdminTalentAvatarEndpoint(id), { imageUrl });
    return normalizeTalent(extractEntity(payload, ['data', 'item', 'result']) || { id, imageUrl });
  } catch {
    return upsertById(adminStore.talent, { ...getById(adminStore.talent, id, normalizeTalent), imageUrl }, normalizeTalent);
  }
}

export async function deleteAdminTalent(id) {
  try {
    await httpClient.delete(buildAdminResourceEndpoint(API_ENDPOINTS.admin.talent, id));
  } catch {
    removeById(adminStore.talent, id);
  }

  return { success: true };
}

export async function fetchAdminPricing(params = {}) {
  try {
    const payload = await httpClient.get(API_ENDPOINTS.admin.pricing, { query: params });
    return normalizeListPayload(payload, normalizePricing, params);
  } catch {
    return fallbackPricing(params);
  }
}

export async function createAdminPricing(values) {
  try {
    const payload = await httpClient.post(API_ENDPOINTS.admin.pricing, values);
    return normalizePricing(extractEntity(payload, ['data', 'item', 'result']) || values);
  } catch {
    return upsertById(adminStore.pricing, { ...values, id: createId('pkg') }, normalizePricing);
  }
}

export async function updateAdminPricing(id, values) {
  try {
    const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.pricing, id), values);
    return normalizePricing(extractEntity(payload, ['data', 'item', 'result']) || values);
  } catch {
    return upsertById(adminStore.pricing, { ...getById(adminStore.pricing, id, normalizePricing), ...values, id }, normalizePricing);
  }
}

export async function deleteAdminPricing(id) {
  try {
    await httpClient.delete(buildAdminResourceEndpoint(API_ENDPOINTS.admin.pricing, id));
  } catch {
    removeById(adminStore.pricing, id);
  }

  return { success: true };
}
