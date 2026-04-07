import { useEffect, useMemo, useState } from 'react';
import {
  fetchFeaturedFreelancerCategories,
  fetchFeaturedFreelancers,
  fetchLiveJobs,
  fetchPopularCategories,
  fetchPricingPlans,
  toggleFeaturedTalentSavedStatus
} from '../services/homeContentService.js';

const DEFAULT_LIMIT = 6;
const DEFAULT_TALENT_CATEGORY = 'All';
const EMPTY_HOME_DATA = {
  popular: [],
  services: [],
  jobs: [],
  tabs: [],
  talents: [],
  plans: []
};

export function useHomePageData() {
  const [homeData, setHomeData] = useState(EMPTY_HOME_DATA);
  const [activeTalentCategory, setActiveTalentCategory] = useState(DEFAULT_TALENT_CATEGORY);
  const [notice, setNotice] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTalentLoading, setIsTalentLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('rating');
  const [savedTalentIds, setSavedTalentIds] = useState([]);
  const [talentMeta, setTalentMeta] = useState({ total: 0, hasMore: false, page: 1, limit: DEFAULT_LIMIT });

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialContent() {
      setIsInitialLoading(true);

      const results = await Promise.allSettled([
        fetchPopularCategories(),
        fetchLiveJobs({ limit: 4 }),
        fetchFeaturedFreelancerCategories(),
        fetchPricingPlans({ billingPeriod })
      ]);

      if (isCancelled) {
        return;
      }

      const [popular, jobs, tabs, plans] = results;
      const nextTabs = tabs.status === 'fulfilled' ? tabs.value : [];

      setHomeData({
        popular: popular.status === 'fulfilled' ? popular.value : [],
        services: [],
        jobs: jobs.status === 'fulfilled' ? jobs.value : [],
        tabs: nextTabs,
        talents: [],
        plans: plans.status === 'fulfilled' ? plans.value : []
      });

      setActiveTalentCategory((currentCategory) => (
        nextTabs.includes(currentCategory) ? currentCategory : (nextTabs[0] || DEFAULT_TALENT_CATEGORY)
      ));

      setNotice(
        results.some((result) => result.status === 'rejected')
          ? 'A few sections are taking longer than usual. The rest of the marketplace is ready to use.'
          : ''
      );
      setIsInitialLoading(false);
    }

    loadInitialContent();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadPricingByBillingPeriod() {
      try {
        const plans = await fetchPricingPlans({ billingPeriod });

        if (!isCancelled) {
          setHomeData((currentState) => ({
            ...currentState,
            plans
          }));
        }
      } catch (error) {
        if (!isCancelled) {
          setHomeData((currentState) => ({ ...currentState, plans: [] }));
          setNotice(error?.message || 'Pricing plans are syncing. You can continue browsing the marketplace.');
        }
      }
    }

    loadPricingByBillingPeriod();

    return () => {
      isCancelled = true;
    };
  }, [billingPeriod]);

  useEffect(() => {
    let isCancelled = false;

    async function loadTalents(page = 1, append = false) {
      setIsTalentLoading(true);

      try {
        const response = await fetchFeaturedFreelancers({
          category: activeTalentCategory !== DEFAULT_TALENT_CATEGORY ? activeTalentCategory : undefined,
          search: searchQuery,
          budget: budgetFilter,
          sort: sortOrder,
          page,
          limit: DEFAULT_LIMIT
        });

        if (!isCancelled) {
          setHomeData((currentState) => ({
            ...currentState,
            talents: append ? [...(currentState.talents || []), ...response.items] : response.items
          }));
          setTalentMeta({
            total: response.total,
            hasMore: response.hasMore,
            page: response.page,
            limit: response.limit
          });
          setSavedTalentIds((response.items || []).filter((item) => item.isSaved).map((item) => item.id));
        }
      } catch (error) {
        if (!isCancelled) {
          setHomeData((currentState) => ({
            ...currentState,
            talents: append ? currentState.talents || [] : []
          }));
          setTalentMeta({
            total: 0,
            hasMore: false,
            page: 1,
            limit: DEFAULT_LIMIT
          });
          setSavedTalentIds([]);
          setNotice(error?.message || 'Talent discovery is refreshing. Please try again in a moment.');
        }
      } finally {
        if (!isCancelled) {
          setIsTalentLoading(false);
        }
      }
    }

    loadTalents(1, false);

    return () => {
      isCancelled = true;
    };
  }, [activeTalentCategory, searchQuery, budgetFilter, sortOrder]);

  const loadMoreTalents = async () => {
    if (isTalentLoading || !talentMeta.hasMore) {
      return;
    }

    setIsTalentLoading(true);

    try {
      const response = await fetchFeaturedFreelancers({
        category: activeTalentCategory !== DEFAULT_TALENT_CATEGORY ? activeTalentCategory : undefined,
        search: searchQuery,
        budget: budgetFilter,
        sort: sortOrder,
        page: talentMeta.page + 1,
        limit: DEFAULT_LIMIT
      });

      setHomeData((currentState) => ({
        ...currentState,
        talents: [...(currentState.talents || []), ...response.items]
      }));
      setTalentMeta({
        total: response.total,
        hasMore: response.hasMore,
        page: response.page,
        limit: response.limit
      });
      setSavedTalentIds((currentSaved) => {
        const nextIds = new Set(currentSaved);
        response.items.forEach((item) => {
          if (item.isSaved) {
            nextIds.add(item.id);
          }
        });
        return Array.from(nextIds);
      });
    } catch (error) {
      setNotice(error?.message || 'More talent profiles could not be loaded right now.');
    } finally {
      setIsTalentLoading(false);
    }
  };

  const resetTalentFilters = () => {
    setSearchQuery('');
    setBudgetFilter('all');
    setSortOrder('rating');
    setActiveTalentCategory(homeData.tabs[0] || DEFAULT_TALENT_CATEGORY);
  };

  const toggleSavedTalent = async (talentId) => {
    try {
      const nextSaved = !savedTalentIds.includes(talentId);
      const result = await toggleFeaturedTalentSavedStatus(talentId, nextSaved);

      setSavedTalentIds((currentState) => {
        const nextSet = new Set(currentState);

        if (result.isSaved) {
          nextSet.add(talentId);
        } else {
          nextSet.delete(talentId);
        }

        return Array.from(nextSet);
      });

      setHomeData((currentState) => ({
        ...currentState,
        talents: (currentState.talents || []).map((talent) => (
          talent.id === talentId
            ? {
                ...talent,
                isSaved: result.isSaved
              }
            : talent
        ))
      }));
    } catch (error) {
      setNotice(error?.message || 'Saved profile status could not be updated.');
    }
  };

  const heroHighlights = useMemo(() => [
    { label: 'Featured talent', value: String(talentMeta.total || homeData.talents.length || 0) },
    { label: 'Active categories', value: String(homeData.tabs.length || homeData.popular.length || 0) },
    { label: 'Open job posts', value: String(homeData.jobs.length || 0) }
  ], [homeData.jobs.length, homeData.popular.length, homeData.tabs.length, homeData.talents.length, talentMeta.total]);

  const trustIndicators = useMemo(() => [
    'Verified profiles',
    'Secure hiring flow',
    'Transparent pricing'
  ], []);

  return {
    homeData,
    notice,
    activeTalentCategory,
    setActiveTalentCategory,
    isInitialLoading,
    isTalentLoading,
    billingPeriod,
    setBillingPeriod,
    searchQuery,
    setSearchQuery,
    budgetFilter,
    setBudgetFilter,
    sortOrder,
    setSortOrder,
    savedTalentIds,
    toggleSavedTalent,
    visibleTalents: homeData.talents || [],
    filteredTalentCount: talentMeta.total,
    hasMoreTalents: talentMeta.hasMore,
    loadMoreTalents,
    resetTalentFilters,
    heroHighlights,
    trustIndicators
  };
}
