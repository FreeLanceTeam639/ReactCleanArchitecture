import { useHomePageData } from '../../features/home/hooks/useHomePageData.js';
import NoticeBanner from '../../shared/ui/NoticeBanner.jsx';
import CtaSection from '../../widgets/home/CtaSection.jsx';
import HomeFooter from '../../widgets/home/HomeFooter.jsx';
import HomeHeader from '../../widgets/home/HomeHeader.jsx';
import HeroSection from '../../widgets/home/HeroSection.jsx';
import LiveJobsSection from '../../widgets/home/LiveJobsSection.jsx';
import PricingSection from '../../widgets/home/PricingSection.jsx';
import TalentSection from '../../widgets/home/TalentSection.jsx';

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
    trustIndicators
  } = useHomePageData();

  return (
    <div className="homeShell">
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
      <LiveJobsSection jobs={homeData.jobs} navigate={navigate} />
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
        navigate={navigate}
        billingPeriod={billingPeriod}
        onBillingChange={setBillingPeriod}
        plans={homeData.plans}
      />
      <CtaSection navigate={navigate} />
      <HomeFooter />
    </div>
  );
}
