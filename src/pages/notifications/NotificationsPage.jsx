import { Bell, LoaderCircle, Search } from 'lucide-react';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import { useNotificationsPage } from '../../features/workspace/hooks/useNotificationsPage.js';

export default function NotificationsPage({ navigate }) {
  const { filters, setFilterValue, items, summary, isLoading, error, busyKey, markOne, markAll } = useNotificationsPage(navigate);

  return (
    <div className="profileShell">
      <MarketplaceHeader
        navigate={navigate}
        links={AUTHENTICATED_NAVIGATION_LINKS}
        actionButton={{ label: 'Post Job', route: ROUTES.postTask }}
      />

      <main className="wrap workspacePage fadeUp">
        <section className="workspaceHero cardLift">
          <div>
            <span className="profileEyebrow">Signal Center</span>
            <h1>Notifications</h1>
            <p>Unread, payment və security eventləri ayrıca endpoint axını ilə idarə olunur.</p>
          </div>
          <div className="workspaceMetricsGrid">
            <article className="workspaceMetricCard cardLift"><span>Unread</span><strong>{summary?.unread || 0}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>Payments</span><strong>{summary?.payments || 0}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>Security</span><strong>{summary?.security || 0}</strong></article>
          </div>
        </section>

        <section className="workspacePanel cardLift">
          <div className="workspaceToolbar compact compactActions">
            <label className="talentSearchInput">
              <Search size={16} />
              <input value={filters.search} onChange={(event) => setFilterValue('search', event.target.value)} placeholder="Search notifications" />
            </label>
            <select className="talentSelect" value={filters.type} onChange={(event) => setFilterValue('type', event.target.value)}>
              <option value="all">All types</option>
              <option value="payment">Payment</option>
              <option value="order">Order</option>
              <option value="security">Security</option>
              <option value="review">Review</option>
            </select>
            <select className="talentSelect" value={filters.state} onChange={(event) => setFilterValue('state', event.target.value)}>
              <option value="all">All states</option>
              <option value="unread">Unread only</option>
            </select>
            <button type="button" className="btn ghost interactive" onClick={markAll} disabled={busyKey === 'all'}>
              {busyKey === 'all' ? 'Updating...' : 'Mark all read'}
            </button>
          </div>

          {isLoading ? (
            <div className="workspaceEmptyState"><LoaderCircle className="spinLoader" size={24} /> Loading notifications...</div>
          ) : error ? (
            <div className="workspaceEmptyState">{error}</div>
          ) : (
            <div className="workspaceListStack">
              {items.map((item) => (
                <article key={item.id} className={item.isRead ? 'workspaceListCard' : 'workspaceListCard unread'}>
                  <div className="workspaceListCardMain">
                    <div className="workspaceListCardIcon"><Bell size={16} /></div>
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.message}</p>
                    </div>
                  </div>
                  <div className="workspaceListCardSide">
                    <span className={`workspaceBadge ${item.type}`}>{item.type}</span>
                    <small>{item.createdAt}</small>
                    <button type="button" className="profileActionButton interactive" disabled={item.isRead || busyKey === `notification:${item.id}`} onClick={() => markOne(item.id)}>
                      {item.isRead ? 'Seen' : busyKey === `notification:${item.id}` ? 'Saving...' : 'Mark read'}
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
