import {
  Bell,
  BellRing,
  BriefcaseBusiness,
  CreditCard,
  LoaderCircle,
  Search,
  ShieldAlert,
  Star
} from 'lucide-react';
import { useNotificationsPage } from '../../features/workspace/hooks/useNotificationsPage.js';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import SelectOne from '../../components/ui/select-1.jsx';

function resolveNotificationVisual(type) {
  switch (String(type || '').toLowerCase()) {
    case 'payment':
      return { icon: CreditCard, tone: 'payment' };
    case 'order':
      return { icon: BriefcaseBusiness, tone: 'order' };
    case 'security':
      return { icon: ShieldAlert, tone: 'security' };
    case 'review':
      return { icon: Star, tone: 'review' };
    default:
      return { icon: BellRing, tone: 'general' };
  }
}

export default function NotificationsPage({ navigate }) {
  const { t } = useI18n();
  const { filters, setFilterValue, items, summary, isLoading, error, busyKey, markOne, markAll } =
    useNotificationsPage(navigate);
  const typeOptions = [
    { value: 'all', label: t('All types') },
    { value: 'payment', label: t('Payment') },
    { value: 'order', label: t('Order') },
    { value: 'security', label: t('Security') },
    { value: 'review', label: t('Review') }
  ];
  const stateOptions = [
    { value: 'all', label: t('All states') },
    { value: 'unread', label: t('Unread only') }
  ];

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
            <SelectOne className="workspaceToolbarSelect" triggerClassName="interactive" value={filters.type} onChange={(nextValue) => setFilterValue('type', nextValue)} options={typeOptions} />
            <SelectOne className="workspaceToolbarSelect" triggerClassName="interactive" value={filters.state} onChange={(nextValue) => setFilterValue('state', nextValue)} options={stateOptions} />
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
                (() => {
                  const { icon: NotificationIcon, tone } = resolveNotificationVisual(item.type);

                  return (
                    <article
                      key={item.id}
                      className={item.isRead ? 'workspaceNotificationCard' : 'workspaceNotificationCard unread'}
                    >
                      <div className={`workspaceNotificationSplash ${tone}`}>
                        <NotificationIcon size={18} />
                      </div>

                      <div className="workspaceNotificationBody">
                        <div className="workspaceNotificationCopy">
                          <strong>{item.title}</strong>
                          <p>{item.message}</p>
                        </div>

                        <div className="workspaceNotificationMeta">
                          <span className={`workspaceBadge ${item.type}`}>{t(item.type)}</span>
                          <small>{item.createdAt}</small>
                        </div>
                      </div>

                      <div className="workspaceNotificationActions">
                        {!item.isRead ? <span className="workspaceNotificationPulse" aria-hidden="true" /> : null}
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
                  );
                })()
              ))}
              {!items.length ? (
                <div className="workspaceEmptyState">
                  <Bell size={18} /> {t('No notifications yet.')}
                </div>
              ) : null}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
