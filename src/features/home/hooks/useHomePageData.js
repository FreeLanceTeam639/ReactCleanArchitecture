import { useEffect, useState } from 'react';
import { defaultTalentCategory, fallbackHomeContent } from '../data/fallbackHomeContent.js';
import {
  fetchFeaturedFreelancerCategories,
  fetchFeaturedFreelancers,
  fetchFeaturedTestimonials,
  fetchLatestBlogs,
  fetchPopularCategories,
  fetchPricingPlans,
  fetchServiceOverview
} from '../services/homeContentService.js';

export function useHomePageData() {
  const [homeData, setHomeData] = useState(fallbackHomeContent);
  const [activeTalentCategory, setActiveTalentCategory] = useState(defaultTalentCategory);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function loadInitialContent() {
      const results = await Promise.allSettled([
        fetchPopularCategories(),
        fetchServiceOverview(),
        fetchFeaturedTestimonials(),
        fetchFeaturedFreelancerCategories(),
        fetchPricingPlans(),
        fetchLatestBlogs()
      ]);

      if (isCancelled) {
        return;
      }

      const [popular, services, testimonials, tabs, plans, blogs] = results;
      const nextTabs = tabs.status === 'fulfilled' ? tabs.value : fallbackHomeContent.tabs;

      setHomeData((currentState) => ({
        ...currentState,
        popular: popular.status === 'fulfilled' ? popular.value : fallbackHomeContent.popular,
        services: services.status === 'fulfilled' ? services.value : fallbackHomeContent.services,
        testimonials: testimonials.status === 'fulfilled' ? testimonials.value : fallbackHomeContent.testimonials,
        tabs: nextTabs,
        plans: plans.status === 'fulfilled' ? plans.value : fallbackHomeContent.plans,
        blogs: blogs.status === 'fulfilled' ? blogs.value : fallbackHomeContent.blogs
      }));

      setActiveTalentCategory((currentCategory) => (
        nextTabs.includes(currentCategory) ? currentCategory : nextTabs[0] || defaultTalentCategory
      ));

      if (results.some((result) => result.status === 'rejected')) {
        setNotice('Backend hazir olmayanda demo data gosterilir.');
      }
    }

    loadInitialContent();

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadTalentByCategory() {
      try {
        const talents = await fetchFeaturedFreelancers(activeTalentCategory);

        if (!isCancelled) {
          setHomeData((currentState) => ({ ...currentState, talents }));
        }
      } catch {
        if (!isCancelled) {
          setHomeData((currentState) => ({ ...currentState, talents: fallbackHomeContent.talents }));
        }
      }
    }

    loadTalentByCategory();

    return () => {
      isCancelled = true;
    };
  }, [activeTalentCategory]);

  return {
    homeData,
    notice,
    activeTalentCategory,
    setActiveTalentCategory
  };
}
