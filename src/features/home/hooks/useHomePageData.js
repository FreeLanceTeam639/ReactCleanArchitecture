import { useEffect, useMemo, useState } from 'react';
import { defaultTalentCategory, fallbackHomeContent } from '../data/fallbackHomeContent.js';
import {
  fetchFeaturedFreelancerCategories,
  fetchFeaturedFreelancers,
  fetchFeaturedTestimonials,
  fetchLatestBlogs,
  fetchPopularCategories,
  fetchPricingPlans,
  fetchServiceOverview,
  toggleFeaturedTalentSavedStatus
} from '../services/homeContentService.js';

const DEFAULT_LIMIT = 6;

export function useHomePageData() {
  const [homeData, setHomeData] = useState(fallbackHomeContent);
  const [activeTalentCategory, setActiveTalentCategory] = useState(defaultTalentCategory);
  const [notice, setNotice] = useState('');
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isTalentLoading, setIsTalentLoading] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('rating');
  const [savedTalentIds, setSavedTalentIds] = useState([]);
  const [talentMeta, setTalentMeta] = useState({ total: fallbackHomeContent.talents.length, hasMore: false, page: 1, limit: DEFAULT_LIMIT });
  const [activeTestimonialIndex, setActiveTestimonialIndex] = useState(0);

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialContent() {
      setIsInitialLoading(true);

      const results = await Promise.allSettled([
        fetchPopularCategories(),
        fetchServiceOverview(),
        fetchFeaturedTestimonials(),
        fetchFeaturedFreelancerCategories(),
        fetchPricingPlans({ billingPeriod }),
        fetchLatestBlogs({ limit: 3 })
      ]);

      if (isCancelled) {
        return;
      }

      const [popular, services, testimonials, tabs, plans, blogs] = results;
      const nextTabs = tabs.status === 'fulfilled' && tabs.value.length ? tabs.value : fallbackHomeContent.tabs;

      setHomeData((currentState) => ({
        ...currentState,
        popular: popular.status === 'fulfilled' && popular.value.length ? popular.value : fallbackHomeContent.popular,
        services: services.status === 'fulfilled' && services.value.length ? services.value : fallbackHomeContent.services,
        testimonials:
          testimonials.status === 'fulfilled' && testimonials.value.length
            ? testimonials.value
            : fallbackHomeContent.testimonials,
        tabs: nextTabs,
        plans: plans.status === 'fulfilled' && plans.value.length ? plans.value : fallbackHomeContent.plans,
        blogs: blogs.status === 'fulfilled' && blogs.value.length ? blogs.value : fallbackHomeContent.blogs
      }));

      setActiveTalentCategory((currentCategory) => (
        nextTabs.includes(currentCategory) ? currentCategory : nextTabs[0] || defaultTalentCategory
      ));

      if (results.some((result) => result.status === 'rejected')) {
        setNotice('Endpointlər əlavə olunub. Backend hazır olmayanda ana səhifə mock cavabla işləyir.');
      }

      if (results.some((result) => result.status === 'rejected')) {
        setNotice('Some sections are currently showing preview content while new updates sync in.');
      }

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
            plans: plans.length ? plans : fallbackHomeContent.plans
          }));
        }
      } catch {
        if (!isCancelled) {
          setHomeData((currentState) => ({ ...currentState, plans: fallbackHomeContent.plans }));
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
          category: activeTalentCategory,
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
      } catch {
        if (!isCancelled) {
          const fallbackResponse = await fetchFeaturedFreelancers({
            category: activeTalentCategory,
            search: searchQuery,
            budget: budgetFilter,
            sort: sortOrder,
            page,
            limit: DEFAULT_LIMIT
          });

          setHomeData((currentState) => ({
            ...currentState,
            talents: append ? [...(currentState.talents || []), ...fallbackResponse.items] : fallbackResponse.items
          }));
          setTalentMeta({
            total: fallbackResponse.total,
            hasMore: fallbackResponse.hasMore,
            page: fallbackResponse.page,
            limit: fallbackResponse.limit
          });
          setSavedTalentIds((fallbackResponse.items || []).filter((item) => item.isSaved).map((item) => item.id));
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
        category: activeTalentCategory,
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
    } finally {
      setIsTalentLoading(false);
    }
  };

  const resetTalentFilters = () => {
    setSearchQuery('');
    setBudgetFilter('all');
    setSortOrder('rating');
    setActiveTalentCategory(defaultTalentCategory);
  };

  const toggleSavedTalent = async (talentId) => {
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
  };

  const goToNextTestimonial = () => {
    setActiveTestimonialIndex((currentState) => (
      homeData.testimonials.length ? (currentState + 1) % homeData.testimonials.length : 0
    ));
  };

  const goToPreviousTestimonial = () => {
    setActiveTestimonialIndex((currentState) => (
      homeData.testimonials.length ? (currentState - 1 + homeData.testimonials.length) % homeData.testimonials.length : 0
    ));
  };

  const heroHighlights = useMemo(() => [
    { label: 'Verified specialists', value: '12k+' },
    { label: 'Briefs posted', value: '980+' },
    { label: 'Avg. reply time', value: '2h' }
  ], []);

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
    trustIndicators,
    activeTestimonial: homeData.testimonials[activeTestimonialIndex] || homeData.testimonials[0],
    activeTestimonialIndex,
    setActiveTestimonialIndex,
    goToNextTestimonial,
    goToPreviousTestimonial
  };
}
