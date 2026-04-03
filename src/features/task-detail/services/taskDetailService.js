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

function normalizeReviewThreadItem(item = {}) {
  return {
    id: item.id || item._id || `${item.author || 'review'}-${item.createdAt || item.timeAgo || ''}`,
    author: item.author || item.clientName || 'Anonymous client',
    project: item.project || item.title || '',
    role: item.role || '',
    rating: Number(item.rating || item.score || 0) || 0,
    status: item.status || 'visible',
    createdAt: item.createdAt || item.timeAgo || '',
    comment: item.comment || item.text || '',
    replies: Array.isArray(item.replies) ? item.replies.map(normalizeReviewThreadItem) : []
  };
}

function normalizeDetail(payload, slug) {
  const entity = extractEntity(payload, ['task', 'detail', 'data']) || payload || {};
  const review = entity.review && typeof entity.review === 'object' ? entity.review : {};
  const reviewThread = Array.isArray(entity.reviewThread)
    ? entity.reviewThread.map(normalizeReviewThreadItem)
    : review?.text
      ? [
          normalizeReviewThreadItem({
            id: `${slug}-review`,
            author: review.author,
            rating: review.score,
            createdAt: review.timeAgo,
            comment: review.text,
            project: entity.title || '',
            status: 'visible'
          })
        ]
      : [];
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
    reviewThread,
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
    termsVersion: entity.termsVersion || '2026-04',
    termsSummary: entity.termsSummary || 'You must accept the current service terms before placing an order.',
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

export async function startTaskConversation(slug, packageKey, action = 'chat', options = {}) {
  const payload = await httpClient.post(buildTaskConversationEndpoint(slug), {
    packageKey,
    action,
    termsAccepted: Boolean(options?.termsAccepted),
    termsVersion: options?.termsVersion || ''
  });
  return extractEntity(payload, ['data', 'conversation', 'result']) || payload;
}

export async function hireTaskService(slug, packageKey, options = {}) {
  const payload = await httpClient.post(buildTaskConversationEndpoint(slug), {
    packageKey,
    action: 'hire',
    termsAccepted: Boolean(options?.termsAccepted),
    termsVersion: options?.termsVersion || ''
  });
  return extractEntity(payload, ['data', 'conversation', 'result']) || payload;
}
