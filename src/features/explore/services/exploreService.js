import { homeEndpoints } from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { resolveApiAssetUrl } from '../../../shared/api/mediaAssets.js';
import { extractCollection } from '../../../shared/lib/response/extractCollection.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';

function pickFirst(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== '');
}

function normalizeTask(item = {}) {
  return {
    id: pickFirst(item.id, item._id, `${item.slug || 'task'}-${item.title || ''}`),
    slug: pickFirst(item.slug, ''),
    title: pickFirst(item.title, 'Untitled task'),
    category: pickFirst(item.category, 'General'),
    budgetAmount: Number(pickFirst(item.budgetAmount, item.budget, 0)) || 0,
    budgetLabel: pickFirst(item.budgetLabel, '$0'),
    budgetType: pickFirst(item.budgetType, 'Fixed Price'),
    timeline: pickFirst(item.timeline, 'Flexible timeline'),
    summary: pickFirst(item.summary, ''),
    coverImageUrl: resolveApiAssetUrl(pickFirst(item.coverImageUrl, item.imageUrl, item.cover, '')),
    postedAt: pickFirst(item.postedAt, ''),
    isVerifiedOwner: Boolean(pickFirst(item.isVerifiedOwner, false))
  };
}

function normalizeRow(item = {}) {
  return {
    userId: pickFirst(item.userId, ''),
    talentProfileId: pickFirst(item.talentProfileId, ''),
    profileSlug: pickFirst(item.profileSlug, ''),
    profileActionLabel: pickFirst(item.profileActionLabel, 'Open profile'),
    name: pickFirst(item.name, 'Marketplace member'),
    title: pickFirst(item.title, 'Verified marketplace member'),
    avatarUrl: resolveApiAssetUrl(pickFirst(item.avatarUrl, item.avatar, '')),
    bannerUrl: resolveApiAssetUrl(pickFirst(item.bannerUrl, item.banner, '')),
    country: pickFirst(item.country, 'Remote'),
    badge: pickFirst(item.badge, 'Active Member'),
    availability: pickFirst(item.availability, 'Available now'),
    bio: pickFirst(item.bio, ''),
    rating: Number(pickFirst(item.rating, 0)) || 0,
    reviews: Number(pickFirst(item.reviews, 0)) || 0,
    completedProjects: Number(pickFirst(item.completedProjects, 0)) || 0,
    taskCount: Number(pickFirst(item.taskCount, 0)) || 0,
    skills: Array.isArray(item.skills) ? item.skills.filter(Boolean) : [],
    tasks: extractCollection(item.tasks || []).map(normalizeTask)
  };
}

export async function fetchExploreMembers(params = {}) {
  const payload = await httpClient.get(homeEndpoints.exploreMembers, { query: params });
  const root = extractEntity(payload, ['data', 'result', 'payload']) || payload || {};
  const entity = extractEntity(root, ['items', 'data']) || root;
  const items = extractCollection(entity.items || entity).map(normalizeRow);

  return {
    items,
    totalMembers: Number(pickFirst(root.totalMembers, entity.totalMembers, items.length)) || items.length,
    totalTasks: Number(pickFirst(root.totalTasks, entity.totalTasks, items.reduce((sum, item) => sum + item.tasks.length, 0))) || 0,
    categories: extractCollection(pickFirst(root.categories, entity.categories, [])).map(String),
    durations: extractCollection(pickFirst(root.durations, entity.durations, [])).map(String)
  };
}
