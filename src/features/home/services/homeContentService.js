import { homeEndpoints, buildFeaturedTalentSaveEndpoint } from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { resolveApiAssetUrl } from '../../../shared/api/mediaAssets.js';
import { extractCollection } from '../../../shared/lib/response/extractCollection.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';
import { decodeMojibake, decodeMojibakeList } from '../../../shared/lib/text/decodeMojibake.js';

function mapCategoryLabel(item) {
  if (typeof item === 'string') {
    return decodeMojibake(item);
  }

  return decodeMojibake(item?.name ?? item?.title ?? 'Category');
}

function normalizePlan(plan = {}) {
  return {
    ...plan,
    name: decodeMojibake(plan.name || ''),
    badge: decodeMojibake(plan.badge || ''),
    description: decodeMojibake(plan.description || ''),
    features: decodeMojibakeList(plan.features),
    monthly: plan.monthly ?? plan.monthlyPrice ?? 0,
    yearly: plan.yearly ?? plan.yearlyPrice ?? 0
  };
}

function normalizeTalent(item = {}) {
  return {
    ...item,
    id: item.id || item._id || `${item.name || 'talent'}-${item.title || ''}`,
    name: decodeMojibake(item.name || ''),
    title: decodeMojibake(item.title || ''),
    location: decodeMojibake(item.location || ''),
    summary: decodeMojibake(item.summary || item.description || ''),
    skills: decodeMojibakeList(item.skills),
    avatar: resolveApiAssetUrl(item.avatar || item.avatarUrl || item.imageUrl || ''),
    banner: resolveApiAssetUrl(item.banner || item.coverImageUrl || ''),
    hourlyRate: Number(item.hourlyRate ?? item.price ?? item.rate ?? 0),
    reviews: Number(item.reviews ?? item.reviewCount ?? 0),
    rating: Number(item.rating ?? item.averageRating ?? 0),
    isSaved: Boolean(item.isSaved)
  };
}

function normalizeLiveJob(item = {}) {
  return {
    id: item.id || item._id || `${item.title || 'job'}-${item.postedAt || ''}`,
    slug: item.slug || '',
    title: decodeMojibake(item.title || 'Open role'),
    category: decodeMojibake(item.category || 'General'),
    budget: decodeMojibake(item.budget || '$0'),
    budgetType: decodeMojibake(item.budgetType || 'Fixed Price'),
    timeline: decodeMojibake(item.timeline || 'Flexible timeline'),
    summary: decodeMojibake(item.summary || ''),
    postedAt: decodeMojibake(item.postedAt || ''),
    coverImageUrl: resolveApiAssetUrl(item.coverImageUrl || item.cover || item.imageUrl || ''),
    ownerName: decodeMojibake(item.ownerName || item.clientName || 'Platform member'),
    ownerLocation: decodeMojibake(item.ownerLocation || item.location || 'Remote'),
    ownerAvatarUrl: resolveApiAssetUrl(item.ownerAvatarUrl || item.avatarUrl || item.avatar || ''),
    ownerVerified: Boolean(item.ownerVerified || item.isVerified),
    ownerRating: Number(item.ownerRating ?? item.rating ?? 0) || 0,
    ownerReviewCount: Number(item.ownerReviewCount ?? item.reviewCount ?? item.reviews ?? 0) || 0
  };
}

function normalizeTalentResponse(payload, params = {}) {
  const root = extractEntity(payload, ['data', 'result', 'payload']) || payload || {};
  const items = extractCollection(extractEntity(root, ['items', 'talents', 'data']) || root).map(normalizeTalent);
  const total = Number(root.total ?? root.count ?? items.length);
  const page = Number(root.page ?? params.page ?? 1);
  const limit = Number(root.limit ?? params.limit ?? items.length ?? 1);

  return {
    items,
    total,
    page,
    limit,
    hasMore: page * limit < total
  };
}

export async function fetchPopularCategories() {
  return extractCollection(await httpClient.get(homeEndpoints.popularCategories)).map(mapCategoryLabel);
}

export async function fetchServiceOverview() {
  return extractCollection(await httpClient.get(homeEndpoints.categoryOverview));
}

export async function fetchFeaturedTestimonials() {
  return extractCollection(await httpClient.get(homeEndpoints.featuredTestimonials));
}

export async function fetchLiveJobs(params = {}) {
  const query = { limit: params.limit ?? 4 };
  return extractCollection(await httpClient.get(homeEndpoints.liveJobs, { query })).map(normalizeLiveJob);
}

export async function fetchFeaturedFreelancerCategories() {
  const payload = await httpClient.get(homeEndpoints.featuredFreelancerCategories);
  return extractCollection(payload).map(mapCategoryLabel);
}

export async function fetchFeaturedFreelancers(params = {}) {
  const payload = await httpClient.get(homeEndpoints.featuredFreelancers, { query: params });
  return normalizeTalentResponse(payload, params);
}

export async function toggleFeaturedTalentSavedStatus(talentId, isSaved) {
  const payload = await httpClient.patch(buildFeaturedTalentSaveEndpoint(talentId), { isSaved });
  const entity = extractEntity(payload, ['item', 'data', 'result']) || {};

  return {
    id: entity.id || entity._id || talentId,
    isSaved: entity.isSaved ?? isSaved
  };
}

export async function fetchPricingPlans(params = {}) {
  const payload = await httpClient.get(homeEndpoints.pricingPlans, { query: params });
  return extractCollection(payload).map(normalizePlan);
}

export async function fetchLatestBlogs(params = {}) {
  const query = { limit: params.limit ?? 3 };
  return extractCollection(await httpClient.get(homeEndpoints.latestBlogs, { query }));
}
