import { Search } from 'lucide-react';
import FreelancerProfileCard from '../../shared/ui/FreelancerProfileCard.jsx';

const BUDGET_FILTERS = [
  { value: 'all', label: 'All budgets' },
  { value: 'under-50', label: 'Under $50/hr' },
  { value: '50-80', label: '$50 - $80/hr' },
  { value: '80-plus', label: '$80+/hr' }
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top rated' },
  { value: 'reviews', label: 'Most reviews' },
  { value: 'price-low', label: 'Lowest rate' },
  { value: 'price-high', label: 'Highest rate' }
];

export default function TalentSection({
  tabs,
  activeTab,
  onTabChange,
  talents,
  navigate,
  searchQuery,
  onSearchChange,
  budgetFilter,
  onBudgetFilterChange,
  sortOrder,
  onSortOrderChange,
  onResetFilters,
  filteredTalentCount,
  isLoading,
  savedTalentIds,
  onSaveToggle,
  hasMoreTalents,
  onLoadMore
}) {
  const safeTabs = Array.isArray(tabs) ? tabs : [];
  const safeTalents = Array.isArray(talents) ? talents : [];

  return (
    <section className="section wrap" id="talents">
      <div className="sectionHead splitHead talentHead">
        <div>
          <span className="eyebrow">Top talents</span>
          <h2>Meet the professionals ready for your next project</h2>
          <p className="lead">Filter by category, rate and relevance to narrow down your shortlist faster.</p>
        </div>
        <div className="talentCounterCard cardLift">
          <span>Profiles matched</span>
          <strong>{isLoading ? 'Loading...' : `${filteredTalentCount} talents`}</strong>
        </div>
      </div>

      <div className="tabs">
        {safeTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'tab active interactive' : 'tab interactive'}
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="talentToolbar cardLift">
        <div className="talentSearchInput">
          <Search size={17} />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Filter by title, skill or location"
            aria-label="Filter talent"
          />
        </div>

        <select value={budgetFilter} onChange={(event) => onBudgetFilterChange(event.target.value)} className="talentSelect interactive">
          {BUDGET_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={(event) => onSortOrderChange(event.target.value)} className="talentSelect interactive">
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <button type="button" className="btn soft interactive talentResetButton" onClick={onResetFilters}>
          Reset
        </button>
      </div>

      {safeTalents.length ? (
        <div className="grid freelancerGrid">
          {safeTalents.map((talent) => (
            <FreelancerProfileCard
              key={talent.id || `${talent.name}-${talent.title}`}
              talent={talent}
              navigate={navigate}
              isSaved={savedTalentIds.includes(talent.id || talent.name)}
              onSaveToggle={onSaveToggle}
            />
          ))}
        </div>
      ) : (
        <div className="talentEmptyState cardLift">
          <strong>No matching talent found</strong>
          <p>Adjust the category, search or budget filter to widen the shortlist.</p>
          <button type="button" className="btn primary interactive" onClick={onResetFilters}>Clear filters</button>
        </div>
      )}

      <div className="center">
        {hasMoreTalents ? (
          <button type="button" className="btn soft interactive" onClick={onLoadMore}>
            Load more talents
          </button>
        ) : (
          <a href="#cta" className="btn soft interactive">
            Start a project brief
          </a>
        )}
      </div>
    </section>
  );
}
