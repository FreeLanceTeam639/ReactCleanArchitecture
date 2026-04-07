import { buildTaskConversationEndpoint, buildTaskDetailEndpoint } from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { resolveApiAssetUrl } from '../../../shared/api/mediaAssets.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';
import { decodeMojibake, decodeMojibakeList } from '../../../shared/lib/text/decodeMojibake.js';

function normalizeOwnerTask(item = {}, fallback = {}) {
  return {
    id: item.id || fallback.id || '',
    slug: item.slug || fallback.slug || '',
    title: decodeMojibake(item.title || fallback.title || 'Task'),
    category: decodeMojibake(item.category || fallback.category || ''),
    budgetLabel: decodeMojibake(item.budgetLabel || fallback.budgetLabel || ''),
    timeline: decodeMojibake(item.timeline || fallback.timeline || ''),
    summary: decodeMojibake(item.summary || fallback.summary || ''),
    coverImageUrl: resolveApiAssetUrl(item.coverImageUrl || item.imageUrl || fallback.coverImageUrl || ''),
    isCurrent: Boolean(item.isCurrent)
  };
}

function normalizeReviewThreadItem(item = {}) {
  return {
    id: item.id || item._id || `${item.author || 'review'}-${item.createdAt || item.timeAgo || ''}`,
    author: decodeMojibake(item.author || item.clientName || 'Anonymous client'),
    project: decodeMojibake(item.project || item.title || ''),
    role: decodeMojibake(item.role || ''),
    rating: Number(item.rating || item.score || 0) || 0,
    status: decodeMojibake(item.status || 'visible'),
    createdAt: decodeMojibake(item.createdAt || item.timeAgo || ''),
    comment: decodeMojibake(item.comment || item.text || ''),
    replies: Array.isArray(item.replies) ? item.replies.map(normalizeReviewThreadItem) : []
  };
}

function normalizePackage(item = {}) {
  return {
    ...item,
    key: item.key || '',
    name: decodeMojibake(item.name || ''),
    description: decodeMojibake(item.description || ''),
    delivery: decodeMojibake(item.delivery || ''),
    revisions: decodeMojibake(item.revisions || '')
  };
}

function normalizeFaq(item = {}) {
  return {
    question: decodeMojibake(item.question || ''),
    answer: decodeMojibake(item.answer || '')
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
    title: decodeMojibake(entity.title || ''),
    category: decodeMojibake(entity.category || ''),
    rating: Number(entity.rating || 0),
    reviews: Number(entity.reviews || entity.reviewCount || 0),
    sales: Number(entity.sales || 0),
    views: Number(entity.views || 0),
    summary: decodeMojibake(entity.summary || entity.description || ''),
    packages: Array.isArray(entity.packages) ? entity.packages.map(normalizePackage) : [],
    gallery,
    highlights: decodeMojibakeList(entity.highlights),
    overview: decodeMojibakeList(entity.overview),
    faqs: Array.isArray(entity.faqs) ? entity.faqs.map(normalizeFaq) : [],
    tags: decodeMojibakeList(entity.tags),
    included: decodeMojibakeList(entity.included),
    ownerTasks,
    avatar,
    review: review && typeof review === 'object'
      ? {
          ...review,
          author: decodeMojibake(review.author || ''),
          timeAgo: decodeMojibake(review.timeAgo || ''),
          text: decodeMojibake(review.text || '')
        }
      : {},
    reviewThread,
    name: decodeMojibake(entity.name || entity.fullName || ''),
    role: decodeMojibake(entity.role || entity.profession || ''),
    hourlyRate: decodeMojibake(entity.hourlyRate || entity.rate || ''),
    location: decodeMojibake(entity.location || entity.country || ''),
    contact: entity.contact && typeof entity.contact === 'object'
      ? {
          ...entity.contact,
          email: decodeMojibake(entity.contact.email || ''),
          phone: decodeMojibake(entity.contact.phone || '')
        }
      : {},
    delivery: decodeMojibake(entity.delivery || entity.duration || ''),
    tools: decodeMojibakeList(entity.tools),
    sellerStats: entity.sellerStats && typeof entity.sellerStats === 'object' ? entity.sellerStats : {},
    primaryActionLabel: decodeMojibake(entity.primaryActionLabel || 'Hire me for a task'),
    secondaryActionLabel: decodeMojibake(entity.secondaryActionLabel || 'Compare packages'),
    showComparePackages: entity.showComparePackages !== false,
    termsVersion: decodeMojibake(entity.termsVersion || '2026-04'),
    termsSummary: decodeMojibake(entity.termsSummary || 'You must accept the current service terms before placing an order.'),
    reviewSectionEyebrow: decodeMojibake(entity.reviewSectionEyebrow || 'Client reviews'),
    reviewSectionTitle: decodeMojibake(entity.reviewSectionTitle || 'Client reviews'),
    reviewCardTitle: decodeMojibake(entity.reviewCardTitle || 'Highly recommend'),
    ownerCtaLabel: decodeMojibake(entity.ownerCtaLabel || 'View more profiles')
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
