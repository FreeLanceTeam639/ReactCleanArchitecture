import { Filter, Search, SlidersHorizontal } from 'lucide-react';
import { AUTHENTICATED_NAVIGATION_LINKS, HOME_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { useAuthSessionState } from '../../shared/hooks/useAuthSessionState.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { useExploreMembersPage } from '../../features/explore/hooks/useExploreMembersPage.js';
import ExploreMemberRow from '../../features/explore/components/ExploreMemberRow.jsx';
import HomeFooter from '../../widgets/home/HomeFooter.jsx';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently updated' },
  { value: 'rating', label: 'Top rated' },
  { value: 'tasks', label: 'Most tasks' },
  { value: 'budget-high', label: 'Highest budget' },
  { value: 'budget-low', label: 'Lowest budget' },
  { value: 'name', label: 'Seller name' }
];

export default function ExploreMembersPage({ navigate }) {
  const authSession = useAuthSessionState();
  const { t, language } = useI18n();
  const {
    filters,
    items,
    meta,
    isLoading,
    error,
    setFilterValue,
    resetFilters
  } = useExploreMembersPage();

  const formatMatchedSellers = (count) => {
    if (language === 'az') {
      return `${count} satıcı cari filtrlərə uyğun gəldi.`;
    }

    if (language === 'ru') {
      return `${count} продавцов соответствуют текущим фильтрам.`;
    }

    return `${count} sellers matched your current filters.`;
  };

  return (
    <div className="explorePage homeShell">
      <MarketplaceHeader
        navigate={navigate}
        links={HOME_NAVIGATION_LINKS}
        authenticatedLinks={AUTHENTICATED_NAVIGATION_LINKS}
        actionButton={authSession ? { label: t('Post Job'), route: ROUTES.postTask } : { label: t('Register'), route: ROUTES.register }}
      />

      <main className="exploreMain wrapLarge">
        <section className="exploreHero fadeUp">
          <div>
            <span className="eyebrow">{t('Explore members')}</span>
            <h1>{t('Browse sellers and review every published task in one cleaner workspace.')}</h1>
            <p>
              {t('Filter by budget, category, delivery timeline, seller name and keyword. Each row keeps the member profile on the left and all active tasks in a horizontal task lane on the right.')}
            </p>
          </div>

          <div className="exploreHeroStats cardLift">
            <div>
              <span>{t('Members')}</span>
              <strong>{isLoading ? '...' : meta.totalMembers}</strong>
            </div>
            <div>
              <span>{t('Live tasks')}</span>
              <strong>{isLoading ? '...' : meta.totalTasks}</strong>
            </div>
          </div>
        </section>

        <section className="exploreLayout">
          <aside className="exploreSidebar cardLift">
            <div className="exploreSidebarHead">
              <div>
                <span className="eyebrow">{t('Filters')}</span>
                <h2>{t('Refine results')}</h2>
              </div>
              <Filter size={18} />
            </div>

            <label className="exploreField">
              <span>{t('Keyword')}</span>
              <div className="exploreInputWrap">
                <Search size={16} />
                <input
                  value={filters.keyword}
                  onChange={(event) => setFilterValue('keyword', event.target.value)}
                  placeholder={t('Task title, brief, category')}
                />
              </div>
            </label>

            <label className="exploreField">
              <span>{t('Seller name')}</span>
              <input
                value={filters.seller}
                onChange={(event) => setFilterValue('seller', event.target.value)}
                placeholder={t('Search seller')}
              />
            </label>

            <label className="exploreField">
              <span>{t('Category')}</span>
              <select value={filters.category} onChange={(event) => setFilterValue('category', event.target.value)}>
                <option value="all">{t('All categories')}</option>
                {meta.categories.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="exploreField">
              <span>{t('Task duration')}</span>
              <select value={filters.duration} onChange={(event) => setFilterValue('duration', event.target.value)}>
                <option value="all">{t('All durations')}</option>
                {meta.durations.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <div className="exploreBudgetGrid">
              <label className="exploreField">
                <span>{t('Min budget')}</span>
                <input
                  type="number"
                  min="0"
                  value={filters.minBudget}
                  onChange={(event) => setFilterValue('minBudget', event.target.value)}
                  placeholder="0"
                />
              </label>

              <label className="exploreField">
                <span>{t('Max budget')}</span>
                <input
                  type="number"
                  min="0"
                  value={filters.maxBudget}
                  onChange={(event) => setFilterValue('maxBudget', event.target.value)}
                  placeholder="5000"
                />
              </label>
            </div>

            <label className="exploreField">
              <span>{t('Sort by')}</span>
              <select value={filters.sort} onChange={(event) => setFilterValue('sort', event.target.value)}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{t(option.label)}</option>
                ))}
              </select>
            </label>

            <button type="button" className="btn soft interactive exploreResetButton" onClick={resetFilters}>
              {t('Reset filters')}
            </button>
          </aside>

          <div className="exploreResults">
            <div className="exploreResultsHead cardLift">
              <div>
                <span className="eyebrow">{t('Live directory')}</span>
                <h2>{t('Members and their published task lanes')}</h2>
                <p>{isLoading ? t('Refreshing live sellers and task rows...') : formatMatchedSellers(meta.totalMembers)}</p>
              </div>
              <div className="exploreResultsIcon">
                <SlidersHorizontal size={18} />
              </div>
            </div>

            {error ? <div className="adminNotice error">{error}</div> : null}

            {isLoading ? (
              <div className="exploreEmptyState cardLift">
                <strong>{t('Loading explore directory...')}</strong>
                <p>{t('Member rows and task lanes are being prepared.')}</p>
              </div>
            ) : items.length ? (
              <div className="exploreRows">
                {items.map((item) => (
                  <ExploreMemberRow key={item.userId} item={item} navigate={navigate} />
                ))}
              </div>
            ) : (
              <div className="exploreEmptyState cardLift">
                <strong>{t('No matching member found')}</strong>
                <p>{t('Try widening the category, budget or keyword filters to see more active task lanes.')}</p>
                <button type="button" className="btn primary interactive" onClick={resetFilters}>{t('Clear filters')}</button>
              </div>
            )}
          </div>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
