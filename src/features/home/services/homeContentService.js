import { homeEndpoints } from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { extractCollection } from '../../../shared/lib/response/extractCollection.js';

/*
  NOTE: bu fetch hissəsi backend endpoint tələb edir
  TODO: API inteqrasiyası tamamlanmalıdır
*/

function mapCategoryLabel(item) {
  if (typeof item === 'string') {
    return item;
  }

  return item?.name ?? item?.title ?? 'Category';
}

export async function fetchPopularCategories() {
  return extractCollection(await httpClient.get(homeEndpoints.popularCategories));
}

export async function fetchServiceOverview() {
  return extractCollection(await httpClient.get(homeEndpoints.categoryOverview));
}

export async function fetchFeaturedTestimonials() {
  return extractCollection(await httpClient.get(homeEndpoints.featuredTestimonials));
}

export async function fetchFeaturedFreelancerCategories() {
  const payload = await httpClient.get(homeEndpoints.featuredFreelancerCategories);
  return extractCollection(payload).map(mapCategoryLabel);
}

export async function fetchFeaturedFreelancers(category) {
  const query = new URLSearchParams({ category }).toString();
  return extractCollection(await httpClient.get(`${homeEndpoints.featuredFreelancers}?${query}`));
}

export async function fetchPricingPlans() {
  return extractCollection(await httpClient.get(homeEndpoints.pricingPlans));
}

export async function fetchLatestBlogs() {
  return extractCollection(await httpClient.get(homeEndpoints.latestBlogs));
}
