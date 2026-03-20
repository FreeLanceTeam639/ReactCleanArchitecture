import { homeEndpoints, buildFeaturedTalentSaveEndpoint } from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { extractCollection } from '../../../shared/lib/response/extractCollection.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';
import { fallbackHomeContent } from '../data/fallbackHomeContent.js';
import { getHomeCategoryTabs, getHomePricingPlans, getHomeTalentCollection, getAdminSnapshot } from '../../admin/services/adminService.js';

const demoSavedTalentIds = new Set(['talent-2']);

function mapCategoryLabel(item) {
  if (typeof item === 'string') {
    return item;
  }

  return item?.name ?? item?.title ?? 'Category';
}

function normalizePlan(plan = {}) {
  return {
    ...plan,
    monthly: plan.monthly ?? plan.monthlyPrice ?? 0,
    yearly: plan.yearly ?? plan.yearlyPrice ?? 0
  };
}

function normalizeTalent(item = {}) {
  return {
    ...item,
    id: item.id || item._id || `${item.name || 'talent'}-${item.title || ''}`,
    hourlyRate: Number(item.hourlyRate ?? item.price ?? item.rate ?? 0),
    reviews: Number(item.reviews ?? item.reviewCount ?? 0),
    rating: Number(item.rating ?? item.averageRating ?? 0),
    isSaved: Boolean(item.isSaved)
  };
}

function getBudgetRange(budget) {
  if (!budget || budget === 'all') {
    return null;
  }

  if (budget === 'under-50') {
    return { max: 49.99 };
  }

  if (budget === '50-80') {
    return { min: 50, max: 80 };
  }

  if (budget === '80-plus') {
    return { min: 80.01 };
  }

  return null;
}

function applyFallbackTalentQuery({
  category,
  search,
  budget,
  sort = 'rating',
  page = 1,
  limit = 6
} = {}) {
  const normalizedSearch = String(search || '').trim().toLowerCase();
  const budgetRange = getBudgetRange(budget);
  let talents = fallbackHomeContent.talents.map((item) => ({
    ...item,
    isSaved: demoSavedTalentIds.has(item.id)
  }));

  if (category && category !== 'All') {
    talents = talents.filter((talent) => talent.category === category);
  }

  if (normalizedSearch) {
    talents = talents.filter((talent) => [
      talent.name,
      talent.title,
      talent.category,
      talent.location,
      ...(talent.tools || [])
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedSearch));
  }

  if (budgetRange) {
    talents = talents.filter((talent) => {
      const rate = Number(talent.hourlyRate || 0);
      if (budgetRange.min !== undefined && rate < budgetRange.min) {
        return false;
      }
      if (budgetRange.max !== undefined && rate > budgetRange.max) {
        return false;
      }
      return true;
    });
  }

  const sorters = {
    rating: (left, right) => Number(right.rating || 0) - Number(left.rating || 0),
    reviews: (left, right) => Number(right.reviews || 0) - Number(left.reviews || 0),
    'price-low': (left, right) => Number(left.hourlyRate || 0) - Number(right.hourlyRate || 0),
    'price-high': (left, right) => Number(right.hourlyRate || 0) - Number(left.hourlyRate || 0)
  };

  talents = [...talents].sort(sorters[sort] || sorters.rating);

  const safePage = Math.max(1, Number(page || 1));
  const safeLimit = Math.max(1, Number(limit || 6));
  const startIndex = (safePage - 1) * safeLimit;
  const items = talents.slice(startIndex, startIndex + safeLimit);

  return {
    items,
    total: talents.length,
    page: safePage,
    limit: safeLimit,
    hasMore: startIndex + safeLimit < talents.length
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
  try {
    return extractCollection(await httpClient.get(homeEndpoints.popularCategories));
  } catch {
    const adminCategories = getAdminSnapshot().categories.filter((item) => item.status === 'active').map((item) => item.name);
    return adminCategories.length ? adminCategories.slice(0, 3) : fallbackHomeContent.popular;
  }
}

export async function fetchServiceOverview() {
  try {
    return extractCollection(await httpClient.get(homeEndpoints.categoryOverview));
  } catch {
    return fallbackHomeContent.services;
  }
}

export async function fetchFeaturedTestimonials() {
  try {
    return extractCollection(await httpClient.get(homeEndpoints.featuredTestimonials));
  } catch {
    return fallbackHomeContent.testimonials;
  }
}

export async function fetchFeaturedFreelancerCategories() {
  try {
    const payload = await httpClient.get(homeEndpoints.featuredFreelancerCategories);
    const categories = extractCollection(payload).map(mapCategoryLabel);
    return categories.length ? categories : (getHomeCategoryTabs().length ? getHomeCategoryTabs() : fallbackHomeContent.tabs);
  } catch {
    const tabs = getHomeCategoryTabs();
    return tabs.length ? tabs : fallbackHomeContent.tabs;
  }
}

export async function fetchFeaturedFreelancers(params = {}) {
  try {
    const payload = await httpClient.get(homeEndpoints.featuredFreelancers, { query: params });
    return normalizeTalentResponse(payload, params);
  } catch {
    const adminTalent = getHomeTalentCollection();
    if (adminTalent.length) {
      const mergedFallback = { ...fallbackHomeContent, talents: adminTalent };
      const normalizedSearch = String(params.search || '').trim().toLowerCase();
      const budgetRange = getBudgetRange(params.budget);
      let talents = mergedFallback.talents.map((item) => ({ ...item, isSaved: demoSavedTalentIds.has(item.id) }));

      if (params.category && params.category !== 'All') {
        talents = talents.filter((talent) => talent.category === params.category);
      }

      if (normalizedSearch) {
        talents = talents.filter((talent) => [
          talent.name,
          talent.title,
          talent.category,
          talent.location,
          ...(talent.tools || [])
        ].join(' ').toLowerCase().includes(normalizedSearch));
      }

      if (budgetRange) {
        talents = talents.filter((talent) => {
          const rate = Number(talent.hourlyRate || 0);
          if (budgetRange.min !== undefined && rate < budgetRange.min) return false;
          if (budgetRange.max !== undefined && rate > budgetRange.max) return false;
          return true;
        });
      }

      const sorters = {
        rating: (left, right) => Number(right.rating || 0) - Number(left.rating || 0),
        reviews: (left, right) => Number(right.reviews || 0) - Number(left.reviews || 0),
        'price-low': (left, right) => Number(left.hourlyRate || 0) - Number(right.hourlyRate || 0),
        'price-high': (left, right) => Number(right.hourlyRate || 0) - Number(left.hourlyRate || 0)
      };

      talents = [...talents].sort(sorters[params.sort] || sorters.rating);
      const safePage = Math.max(1, Number(params.page || 1));
      const safeLimit = Math.max(1, Number(params.limit || 6));
      const startIndex = (safePage - 1) * safeLimit;
      const items = talents.slice(startIndex, startIndex + safeLimit);

      return {
        items,
        total: talents.length,
        page: safePage,
        limit: safeLimit,
        hasMore: startIndex + safeLimit < talents.length
      };
    }

    return applyFallbackTalentQuery(params);
  }
}

export async function toggleFeaturedTalentSavedStatus(talentId, isSaved) {
  try {
    const payload = await httpClient.patch(buildFeaturedTalentSaveEndpoint(talentId), { isSaved });
    const entity = extractEntity(payload, ['item', 'data', 'result']) || {};
    return {
      id: entity.id || entity._id || talentId,
      isSaved: entity.isSaved ?? isSaved
    };
  } catch {
    if (isSaved) {
      demoSavedTalentIds.add(talentId);
    } else {
      demoSavedTalentIds.delete(talentId);
    }

    return { id: talentId, isSaved };
  }
}

export async function fetchPricingPlans(params = {}) {
  try {
    const payload = await httpClient.get(homeEndpoints.pricingPlans, { query: params });
    return extractCollection(payload).map(normalizePlan);
  } catch {
    const plans = getHomePricingPlans();
    return (plans.length ? plans : fallbackHomeContent.plans).map(normalizePlan);
  }
}

export async function fetchLatestBlogs(params = {}) {
  const query = { limit: params.limit ?? 3 };

  try {
    return extractCollection(await httpClient.get(homeEndpoints.latestBlogs, { query }));
  } catch {
    return fallbackHomeContent.blogs.slice(0, query.limit);
  }
}
