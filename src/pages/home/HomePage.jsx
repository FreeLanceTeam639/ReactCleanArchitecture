import { useMemo } from 'react';
import { useHomePageData } from '../../features/home/hooks/useHomePageData.js';
import NoticeBanner from '../../shared/ui/NoticeBanner.jsx';
import BlogSection from '../../widgets/home/BlogSection.jsx';
import CtaSection from '../../widgets/home/CtaSection.jsx';
import HomeFooter from '../../widgets/home/HomeFooter.jsx';
import HomeHeader from '../../widgets/home/HomeHeader.jsx';
import HeroSection from '../../widgets/home/HeroSection.jsx';
import PricingSection from '../../widgets/home/PricingSection.jsx';
import ServicesSection from '../../widgets/home/ServicesSection.jsx';
import TalentSection from '../../widgets/home/TalentSection.jsx';
import TestimonialSection from '../../widgets/home/TestimonialSection.jsx';

export default function HomePage({ navigate }) {
  const {
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
    visibleTalents,
    filteredTalentCount,
    hasMoreTalents,
    loadMoreTalents,
    resetTalentFilters,
    heroHighlights,
    trustIndicators,
    activeTestimonial,
    activeTestimonialIndex,
    setActiveTestimonialIndex,
    goToNextTestimonial,
    goToPreviousTestimonial
  } = useHomePageData();

  const selectedService = useMemo(
    () => homeData.services.find((service) => service.title === activeTalentCategory) || homeData.services[0],
    [activeTalentCategory, homeData.services]
  );

  return (
    <div>
      <HomeHeader navigate={navigate} />
      <HeroSection
        popularCategories={homeData.popular}
        heroHighlights={heroHighlights}
        trustIndicators={trustIndicators}
        navigate={navigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTalentCategory={activeTalentCategory}
        onCategoryPick={setActiveTalentCategory}
        isLoading={isInitialLoading}
      />
      <NoticeBanner message={notice} />
      <ServicesSection
        services={homeData.services}
        selectedService={selectedService}
        activeServiceTitle={activeTalentCategory}
        onSelectService={(serviceTitle) => setActiveTalentCategory(serviceTitle)}
      />
      <TestimonialSection
        testimonials={homeData.testimonials}
        activeTestimonial={activeTestimonial}
        activeIndex={activeTestimonialIndex}
        onDotClick={setActiveTestimonialIndex}
        onPrevious={goToPreviousTestimonial}
        onNext={goToNextTestimonial}
      />
      <TalentSection
        tabs={homeData.tabs}
        activeTab={activeTalentCategory}
        onTabChange={setActiveTalentCategory}
        talents={visibleTalents}
        navigate={navigate}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        budgetFilter={budgetFilter}
        onBudgetFilterChange={setBudgetFilter}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        onResetFilters={resetTalentFilters}
        filteredTalentCount={filteredTalentCount}
        isLoading={isTalentLoading}
        savedTalentIds={savedTalentIds}
        onSaveToggle={toggleSavedTalent}
        hasMoreTalents={hasMoreTalents}
        onLoadMore={loadMoreTalents}
      />
      <PricingSection
        billingPeriod={billingPeriod}
        onBillingChange={setBillingPeriod}
        plans={homeData.plans}
      />
      <BlogSection blogs={homeData.blogs} />
      <CtaSection navigate={navigate} />
      <HomeFooter />
    </div>
  );
}
