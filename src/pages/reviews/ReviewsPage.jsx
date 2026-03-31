import { LoaderCircle, SearchCheck, Star } from 'lucide-react';
import { useReviewsPage } from '../../features/workspace/hooks/useReviewsPage.js';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';

export default function ReviewsPage({ navigate }) {
  const { t } = useI18n();
  const { filters, setFilterValue, items, summary, isLoading, error, busyKey, toggleFeatured } =
    useReviewsPage(navigate);

  return (
    <div className="profileShell">
      <MarketplaceHeader
        navigate={navigate}
        links={AUTHENTICATED_NAVIGATION_LINKS}
        actionButton={{ label: t('Post Job'), route: ROUTES.postTask }}
      />

      <main className="wrap workspacePage fadeUp">
        <section className="workspaceHero cardLift">
          <div>
            <span className="profileEyebrow">{t('Trust Layer')}</span>
            <h1>{t('Reviews')}</h1>
            <p>{t('Review visibility, featured state and rating filters are managed through the workspace service layer.')}</p>
          </div>
          <div className="workspaceMetricsGrid">
            <article className="workspaceMetricCard cardLift"><span>{t('Average')}</span><strong>{summary?.averageRating || '0.0'}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>{t('Total reviews')}</span><strong>{summary?.total || 0}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>{t('Featured')}</span><strong>{summary?.featured || 0}</strong></article>
          </div>
        </section>

        <section className="workspacePanel cardLift">
          <div className="workspaceToolbar compact">
            <select className="talentSelect" value={filters.role} onChange={(event) => setFilterValue('role', event.target.value)}>
              <option value="all">{t('All roles')}</option>
              <option value="received">{t('Received reviews')}</option>
              <option value="given">{t('Shared reviews')}</option>
            </select>
            <select className="talentSelect" value={filters.rating} onChange={(event) => setFilterValue('rating', event.target.value)}>
              <option value="all">{t('All ratings')}</option>
              <option value="5">{t('5 stars')}</option>
              <option value="4">{t('4 stars')}</option>
            </select>
          </div>

          {isLoading ? (
            <div className="workspaceEmptyState">
              <LoaderCircle className="spinLoader" size={24} /> {t('Loading reviews...')}
            </div>
          ) : error ? (
            <div className="workspaceEmptyState">{t(error)}</div>
          ) : (
            <div className="workspaceCardGrid reviews">
              {items.map((item) => (
                <article key={item.id} className="workspaceEntityCard cardLift">
                  <div className="workspaceEntityTop">
                    <div>
                      <strong>{item.author}</strong>
                      <p>{item.project}</p>
                    </div>
                    <span className={`workspaceBadge ${item.status}`}>{t(item.status)}</span>
                  </div>
                  <div className="workspaceStarsRow">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={`${item.id}-${index}`} size={16} fill={index < item.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <p className="workspaceMutedText">{item.comment}</p>
                  <div className="workspaceInlineActions">
                    <small>{item.createdAt}</small>
                    <button
                      type="button"
                      className="profileActionButton interactive"
                      disabled={busyKey === `review:${item.id}`}
                      onClick={() => toggleFeatured(item.id)}
                    >
                      <SearchCheck size={15} />{' '}
                      {busyKey === `review:${item.id}`
                        ? t('Saving...')
                        : item.status === 'featured'
                          ? t('Remove feature')
                          : t('Feature')}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
