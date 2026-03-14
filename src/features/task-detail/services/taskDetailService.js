import { buildTaskDetailEndpoint } from '../../../shared/api/endpoints.js';
import { httpClient } from '../../../shared/api/httpClient.js';
import { extractEntity } from '../../../shared/lib/response/extractEntity.js';
import { getFallbackTaskDetailBySlug } from '../data/fallbackTaskDetails.js';

function normalizeDetail(payload, slug) {
  const entity = extractEntity(payload, ['task', 'detail', 'data']) || payload;

  if (!entity || typeof entity !== 'object') {
    return getFallbackTaskDetailBySlug(slug);
  }

  return {
    ...getFallbackTaskDetailBySlug(slug),
    ...entity,
    packages: Array.isArray(entity.packages) && entity.packages.length
      ? entity.packages
      : getFallbackTaskDetailBySlug(slug).packages,
    gallery: Array.isArray(entity.gallery) && entity.gallery.length
      ? entity.gallery
      : getFallbackTaskDetailBySlug(slug).gallery,
    highlights: Array.isArray(entity.highlights) && entity.highlights.length
      ? entity.highlights
      : getFallbackTaskDetailBySlug(slug).highlights,
    overview: Array.isArray(entity.overview) && entity.overview.length
      ? entity.overview
      : getFallbackTaskDetailBySlug(slug).overview,
    faqs: Array.isArray(entity.faqs) && entity.faqs.length
      ? entity.faqs
      : getFallbackTaskDetailBySlug(slug).faqs,
    tags: Array.isArray(entity.tags) && entity.tags.length
      ? entity.tags
      : getFallbackTaskDetailBySlug(slug).tags,
    included: Array.isArray(entity.included) && entity.included.length
      ? entity.included
      : getFallbackTaskDetailBySlug(slug).included
  };
}

export async function fetchTaskDetailBySlug(slug) {
  try {
    const payload = await httpClient.get(buildTaskDetailEndpoint(slug));
    return normalizeDetail(payload, slug);
  } catch {
    return getFallbackTaskDetailBySlug(slug);
  }
}
