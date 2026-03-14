import { LoaderCircle, SearchCheck, Star } from 'lucide-react';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import { useReviewsPage } from '../../features/workspace/hooks/useReviewsPage.js';

export default function ReviewsPage({ navigate }) {
  const { filters, setFilterValue, items, summary, isLoading, error, busyKey, toggleFeatured } = useReviewsPage(navigate);

  return (
    <div className="profileShell">
      <MarketplaceHeader
        navigate={navigate}
        links={AUTHENTICATED_NAVIGATION_LINKS}
        actionButton={{ label: 'Post a Job', route: ROUTES.postTask }}
      />

      <main className="wrap workspacePage fadeUp">
        <section className="workspaceHero cardLift">
          <div>
            <span className="profileEyebrow">Trust Layer</span>
            <h1>Reviews</h1>
            <p>Review visibility, featured state və rating filter-ləri service qatından idarə olunur.</p>
          </div>
          <div className="workspaceMetricsGrid">
            <article className="workspaceMetricCard cardLift"><span>Average</span><strong>{summary?.averageRating || '0.0'}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>Total reviews</span><strong>{summary?.total || 0}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>Featured</span><strong>{summary?.featured || 0}</strong></article>
          </div>
        </section>

        <section className="workspacePanel cardLift">
          <div className="workspaceToolbar compact">
            <select className="talentSelect" value={filters.role} onChange={(event) => setFilterValue('role', event.target.value)}>
              <option value="all">All roles</option>
              <option value="client">Client reviews</option>
              <option value="freelancer">Given reviews</option>
            </select>
            <select className="talentSelect" value={filters.rating} onChange={(event) => setFilterValue('rating', event.target.value)}>
              <option value="all">All ratings</option>
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
            </select>
          </div>

          {isLoading ? (
            <div className="workspaceEmptyState"><LoaderCircle className="spinLoader" size={24} /> Loading reviews...</div>
          ) : error ? (
            <div className="workspaceEmptyState">{error}</div>
          ) : (
            <div className="workspaceCardGrid reviews">
              {items.map((item) => (
                <article key={item.id} className="workspaceEntityCard cardLift">
                  <div className="workspaceEntityTop">
                    <div>
                      <strong>{item.author}</strong>
                      <p>{item.project}</p>
                    </div>
                    <span className={`workspaceBadge ${item.status}`}>{item.status}</span>
                  </div>
                  <div className="workspaceStarsRow">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={`${item.id}-${index}`} size={16} fill={index < item.rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <p className="workspaceMutedText">{item.comment}</p>
                  <div className="workspaceInlineActions">
                    <small>{item.createdAt}</small>
                    <button type="button" className="profileActionButton interactive" disabled={busyKey === `review:${item.id}`} onClick={() => toggleFeatured(item.id)}>
                      <SearchCheck size={15} /> {busyKey === `review:${item.id}` ? 'Saving...' : item.status === 'featured' ? 'Remove feature' : 'Feature'}
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
