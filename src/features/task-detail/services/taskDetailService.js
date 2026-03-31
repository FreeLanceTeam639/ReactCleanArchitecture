import { buildTaskConversationEndpoint, buildTaskDetailEndpoint } from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { resolveApiAssetUrl } from '../../../shared/api/mediaAssets.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';

function normalizeOwnerTask(item = {}, fallback = {}) {
  return {
    id: item.id || fallback.id || '',
    slug: item.slug || fallback.slug || '',
    title: item.title || fallback.title || 'Task',
    category: item.category || fallback.category || '',
    budgetLabel: item.budgetLabel || fallback.budgetLabel || '',
    timeline: item.timeline || fallback.timeline || '',
    summary: item.summary || fallback.summary || '',
    coverImageUrl: resolveApiAssetUrl(item.coverImageUrl || item.imageUrl || fallback.coverImageUrl || ''),
    isCurrent: Boolean(item.isCurrent)
  };
}

function normalizeDetail(payload, slug) {
  const entity = extractEntity(payload, ['task', 'detail', 'data']) || payload || {};
  const review = entity.review && typeof entity.review === 'object' ? entity.review : {};
  const avatar = resolveApiAssetUrl(entity.avatar || entity.imageUrl || '');
  const gallery = Array.isArray(entity.gallery) && entity.gallery.length
    ? entity.gallery.map((image) => resolveApiAssetUrl(image)).filter(Boolean)
    : [
        resolveApiAssetUrl(entity.coverImageUrl || entity.imageUrl || avatar)
      ].filter(Boolean);
  const fallbackOwnerTask = normalizeOwnerTask({
    id: entity.id || entity._id || slug,
    slug: entity.slug || slug,
    title: entity.title || '',
    category: entity.category || '',
    budgetLabel: entity.hourlyRate || entity.rate || '',
    timeline: entity.delivery || entity.duration || '',
    summary: entity.summary || entity.description || '',
    coverImageUrl: entity.coverImageUrl || entity.imageUrl || gallery[0] || avatar,
    isCurrent: true
  });
  const ownerTasks = Array.isArray(entity.ownerTasks) && entity.ownerTasks.length
    ? entity.ownerTasks
        .map((item) => normalizeOwnerTask(item, fallbackOwnerTask))
        .filter((item) => item.slug)
    : [fallbackOwnerTask];

  return {
    id: entity.id || entity._id || slug,
    ownerUserId: entity.ownerUserId || entity.userId || entity.ownerId || '',
    slug: entity.slug || slug,
    detailType: entity.detailType || 'member-service',
    title: entity.title || '',
    category: entity.category || '',
    rating: Number(entity.rating || 0),
    reviews: Number(entity.reviews || entity.reviewCount || 0),
    sales: Number(entity.sales || 0),
    views: Number(entity.views || 0),
    summary: entity.summary || entity.description || '',
    packages: Array.isArray(entity.packages) ? entity.packages : [],
    gallery,
    highlights: Array.isArray(entity.highlights) ? entity.highlights : [],
    overview: Array.isArray(entity.overview) ? entity.overview : [],
    faqs: Array.isArray(entity.faqs) ? entity.faqs : [],
    tags: Array.isArray(entity.tags) ? entity.tags : [],
    included: Array.isArray(entity.included) ? entity.included : [],
    ownerTasks,
    avatar,
    review,
    name: entity.name || entity.fullName || '',
    role: entity.role || entity.profession || '',
    hourlyRate: entity.hourlyRate || entity.rate || '',
    location: entity.location || entity.country || '',
    contact: entity.contact && typeof entity.contact === 'object' ? entity.contact : {},
    delivery: entity.delivery || entity.duration || '',
    tools: Array.isArray(entity.tools) ? entity.tools : [],
    sellerStats: entity.sellerStats && typeof entity.sellerStats === 'object' ? entity.sellerStats : {},
    primaryActionLabel: entity.primaryActionLabel || 'Hire me for a task',
    secondaryActionLabel: entity.secondaryActionLabel || 'Compare packages',
    showComparePackages: entity.showComparePackages !== false,
    reviewSectionEyebrow: entity.reviewSectionEyebrow || 'Client reviews',
    reviewSectionTitle: entity.reviewSectionTitle || 'Client reviews',
    reviewCardTitle: entity.reviewCardTitle || 'Highly recommend',
    ownerCtaLabel: entity.ownerCtaLabel || 'View more profiles'
  };
}

export async function fetchTaskDetailBySlug(slug) {
  const payload = await httpClient.get(buildTaskDetailEndpoint(slug));
  return normalizeDetail(payload, slug);
}

export async function startTaskConversation(slug, packageKey, action = 'chat') {
  const payload = await httpClient.post(buildTaskConversationEndpoint(slug), { packageKey, action });
  return extractEntity(payload, ['data', 'conversation', 'result']) || payload;
}

export async function hireTaskService(slug, packageKey) {
  const payload = await httpClient.post(buildTaskConversationEndpoint(slug), { packageKey, action: 'hire' });
  return extractEntity(payload, ['data', 'conversation', 'result']) || payload;
}
