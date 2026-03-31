import { Bell, LoaderCircle, Search } from 'lucide-react';
import { useNotificationsPage } from '../../features/workspace/hooks/useNotificationsPage.js';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';

export default function NotificationsPage({ navigate }) {
  const { t } = useI18n();
  const { filters, setFilterValue, items, summary, isLoading, error, busyKey, markOne, markAll } =
    useNotificationsPage(navigate);

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
            <span className="profileEyebrow">{t('Signal Center')}</span>
            <h1>{t('Notifications')}</h1>
            <p>{t('Unread, payment and security events are managed through a dedicated endpoint flow.')}</p>
          </div>
          <div className="workspaceMetricsGrid">
            <article className="workspaceMetricCard cardLift"><span>{t('Unread')}</span><strong>{summary?.unread || 0}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>{t('Payments')}</span><strong>{summary?.payments || 0}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>{t('Security')}</span><strong>{summary?.security || 0}</strong></article>
          </div>
        </section>

        <section className="workspacePanel cardLift">
          <div className="workspaceToolbar compact compactActions">
            <label className="talentSearchInput">
              <Search size={16} />
              <input
                value={filters.search}
                onChange={(event) => setFilterValue('search', event.target.value)}
                placeholder={t('Search notifications')}
              />
            </label>
            <select className="talentSelect" value={filters.type} onChange={(event) => setFilterValue('type', event.target.value)}>
              <option value="all">{t('All types')}</option>
              <option value="payment">{t('Payment')}</option>
              <option value="order">{t('Order')}</option>
              <option value="security">{t('Security')}</option>
              <option value="review">{t('Review')}</option>
            </select>
            <select className="talentSelect" value={filters.state} onChange={(event) => setFilterValue('state', event.target.value)}>
              <option value="all">{t('All states')}</option>
              <option value="unread">{t('Unread only')}</option>
            </select>
            <button type="button" className="btn ghost interactive" onClick={markAll} disabled={busyKey === 'all'}>
              {busyKey === 'all' ? t('Updating...') : t('Mark all read')}
            </button>
          </div>

          {isLoading ? (
            <div className="workspaceEmptyState">
              <LoaderCircle className="spinLoader" size={24} /> {t('Loading notifications...')}
            </div>
          ) : error ? (
            <div className="workspaceEmptyState">{t(error)}</div>
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
                    <span className={`workspaceBadge ${item.type}`}>{t(item.type)}</span>
                    <small>{item.createdAt}</small>
                    <button
                      type="button"
                      className="profileActionButton interactive"
                      disabled={item.isRead || busyKey === `notification:${item.id}`}
                      onClick={() => markOne(item.id)}
                    >
                      {item.isRead ? t('Seen') : busyKey === `notification:${item.id}` ? t('Saving...') : t('Mark read')}
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
