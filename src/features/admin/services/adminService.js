import { API_ENDPOINTS, buildAdminCategoryStatusEndpoint, buildAdminFeaturedEndpoint, buildAdminJobStatusEndpoint, buildAdminJobVisibilityEndpoint, buildAdminResourceEndpoint, buildAdminUserStatusEndpoint } from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';
import { fallbackAdminContent } from '../data/fallbackAdminContent.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

const adminStore = {
  users: clone(fallbackAdminContent.users),
  categories: clone(fallbackAdminContent.categories),
  jobs: clone(fallbackAdminContent.jobs),
  talent: clone(fallbackAdminContent.talent),
  pricing: clone(fallbackAdminContent.pricing)
};

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
    totalPages: Math.max(1, Number(meta.totalPages ?? Math.ceil(total / safePageSize))|| 1)
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
  return `${prefix}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeUser(item = {}) {
  return {
    id: pickFirst(item.id, item._id, createId('usr')),
    fullName: pickFirst(item.fullName, item.name, `${item.firstName || ''} ${item.lastName || ''}`.trim(), 'Unknown user'),
    email: pickFirst(item.email, 'unknown@example.com'),
    role: toLower(pickFirst(item.role, 'client')),
    status: toLower(pickFirst(item.status, 'active')),
    registeredAt: pickFirst(item.registeredAt, item.createdAt, new Date().toISOString())
  };
}

function normalizeCategory(item = {}) {
  return {
    id: pickFirst(item.id, item._id, createId('cat')),
    name: pickFirst(item.name, item.title, 'Category'),
    slug: pickFirst(item.slug, item.name ? item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'category'),
    status: toLower(pickFirst(item.status, 'active'))
  };
}

function normalizeJob(item = {}) {
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
    createdAt: pickFirst(item.createdAt, item.publishedAt, new Date().toISOString())
  };
}

function normalizeTalent(item = {}) {
  return {
    id: pickFirst(item.id, item._id, createId('tal')),
    name: pickFirst(item.name, 'Talent'),
    title: pickFirst(item.title, item.professionalTitle, 'Professional'),
    skill: pickFirst(item.skill, item.primarySkill, 'General'),
    rating: Number(pickFirst(item.rating, 0)) || 0,
    imageUrl: pickFirst(item.imageUrl, item.avatar, ''),
    status: toLower(pickFirst(item.status, 'active')),
    featured: Boolean(pickFirst(item.featured, false))
  };
}

function normalizePricing(item = {}) {
  return {
    id: pickFirst(item.id, item._id, createId('pkg')),
    name: pickFirst(item.name, 'Package'),
    price: Number(pickFirst(item.price, 0)) || 0,
    features: Array.isArray(item.features) ? item.features : [],
    status: toLower(pickFirst(item.status, 'active'))
  };
}

function normalizeOverviewResponse(payload) {
  const root = extractEntity(payload, ['data', 'result', 'payload']) || {};
  const totals = root.totals || {};

  return {
    totals: {
      users: Number(totals.users ?? 0),
      freelancers: Number(totals.freelancers ?? 0),
      jobs: Number(totals.jobs ?? 0),
      activeCategories: Number(totals.activeCategories ?? 0)
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

  return {
    totals: {
      users: users.length,
      freelancers: users.filter((item) => item.role === 'freelancer').length,
      jobs: jobs.length,
      activeCategories: categories.filter((item) => item.status === 'active').length
    },
    recentJobs: [...jobs].sort((a, b) => sortByDateDesc(a, b, 'createdAt')).slice(0, 5),
    recentUsers: [...users].sort((a, b) => sortByDateDesc(a, b, 'registeredAt')).slice(0, 5)
  };
}

function fallbackUsers(params = {}) {
  let items = adminStore.users.map(normalizeUser);
  items = filterCollection(items, params, ['fullName', 'email']);

  const role = toLower(params.role || 'all');
  const status = toLower(params.status || 'all');

  if (role !== 'all') {
    items = items.filter((item) => item.role === role);
  }

  if (status !== 'all') {
    items = items.filter((item) => item.status === status);
  }

  items = [...items].sort((a, b) => sortByDateDesc(a, b, 'registeredAt'));
  return buildListResponse(items, params);
}

function fallbackJobs(params = {}) {
  let items = adminStore.jobs.map(normalizeJob);
  items = filterCollection(items, params, ['title', 'categoryName', 'ownerName']);

  const categoryId = toLower(params.categoryId || 'all');
  const status = toLower(params.status || 'all');

  if (categoryId !== 'all') {
    items = items.filter((item) => toLower(item.categoryId) === categoryId || toLower(item.categoryName) === categoryId);
  }

  if (status !== 'all') {
    items = items.filter((item) => item.status === status);
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
  items = filterCollection(items, params, ['name', 'title', 'skill']);

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
  items = filterCollection(items, params, ['name']);

  const status = toLower(params.status || 'all');
  if (status !== 'all') {
    items = items.filter((item) => item.status === status);
  }

  items = [...items].sort((left, right) => left.price - right.price);
  return buildListResponse(items, params);
}

function upsertById(collection, item, mapper) {
  const normalized = mapper(item);
  const index = collection.findIndex((entry) => entry.id === normalized.id);

  if (index >= 0) {
    collection[index] = { ...collection[index], ...normalized };
  } else {
    collection.unshift(normalized);
  }

  return normalized;
}

function removeById(collection, id) {
  const index = collection.findIndex((entry) => entry.id === id);
  if (index >= 0) {
    collection.splice(index, 1);
  }
}

function getById(collection, id, mapper) {
  const found = collection.find((item) => item.id === id);
  return found ? mapper(found) : null;
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
    return normalizeListPayload(payload, normalizeUser, params);
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
    return upsertById(adminStore.users, { ...values, id }, normalizeUser);
  }
}

export async function updateAdminUserStatus(id, status) {
  try {
    const payload = await httpClient.patch(buildAdminUserStatusEndpoint(id), { status });
    return normalizeUser(extractEntity(payload, ['data', 'item', 'result']) || { id, status });
  } catch {
    const nextItem = upsertById(adminStore.users, { ...getById(adminStore.users, id, normalizeUser), status }, normalizeUser);
    return nextItem;
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
  try {
    const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.jobs, id), values);
    return normalizeJob(extractEntity(payload, ['data', 'item', 'result']) || values);
  } catch {
    const categories = adminStore.categories.map(normalizeCategory);
    const category = categories.find((item) => item.id === values.categoryId) || categories.find((item) => item.name === values.categoryName);
    return upsertById(adminStore.jobs, { ...getById(adminStore.jobs, id, normalizeJob), ...values, id, categoryName: values.categoryName || category?.name || 'General' }, normalizeJob);
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
  try {
    const payload = await httpClient.put(buildAdminResourceEndpoint(API_ENDPOINTS.admin.talent, id), values);
    return normalizeTalent(extractEntity(payload, ['data', 'item', 'result']) || values);
  } catch {
    return upsertById(adminStore.talent, { ...getById(adminStore.talent, id, normalizeTalent), ...values, id }, normalizeTalent);
  }
}

export async function updateAdminTalentStatus(id, status) {
  try {
    const payload = await httpClient.patch(buildAdminResourceEndpoint(API_ENDPOINTS.admin.talent, `${id}/status`), { status });
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

export function getAdminCategoryOptions() {
  return adminStore.categories.map(normalizeCategory).filter((item) => item.status === 'active');
}

export function getPricingSummary(items = []) {
  return items.map((item) => ({ ...item, formattedPrice: formatCurrency(item.price) }));
}
