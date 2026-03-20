import { useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { fetchWorkspaceReviews, toggleReviewFeatured } from '../services/workspaceService.js';

export function useReviewsPage(navigate) {
  const [filters, setFilters] = useState({ role: 'all', rating: 'all' });
  const [state, setState] = useState({ items: [], summary: null, isLoading: true, error: '', busyKey: '' });

  const load = async () => {
    setState((current) => ({ ...current, isLoading: true, error: '' }));
    try {
      const payload = await fetchWorkspaceReviews(filters);
      setState((current) => ({ ...current, items: payload.items || [], summary: payload.summary || null, isLoading: false }));
    } catch (error) {
      setState((current) => ({ ...current, items: [], summary: null, isLoading: false, error: error?.message || 'Reviews could not be loaded.' }));
    }
  };

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      navigate(ROUTES.login);
      return;
    }

    load();
  }, [filters, navigate]);

  const setFilterValue = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const toggleFeatured = async (reviewId) => {
    setState((current) => ({ ...current, busyKey: `review:${reviewId}` }));
    await toggleReviewFeatured(reviewId);
    await load();
    setState((current) => ({ ...current, busyKey: '' }));
  };

  return { filters, setFilterValue, toggleFeatured, ...state };
}
