import { useState } from 'react';
import {
  BriefcaseBusiness,
  CalendarClock,
  CircleDollarSign,
  Download,
  LoaderCircle,
  Search,
  Sparkles
} from 'lucide-react';
import { useOrdersPage } from '../../features/workspace/hooks/useOrdersPage.js';
import { downloadOrderDocument } from '../../features/workspace/services/workspaceService.js';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { buildTaskDetailRoute, ROUTES } from '../../shared/constants/routes.js';
import { useToast } from '../../shared/hooks/useToast.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { setPendingConversationFocusId } from '../../shared/lib/storage/workspaceConversationState.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';

function MetricCard({ label, value, icon: Icon }) {
  return (
    <article className="workspaceMetricCard cardLift">
      <div className="workspaceMetricIcon">
        <Icon size={18} />
      </div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export default function OrdersPage({ navigate }) {
  const { t } = useI18n();
  const toast = useToast();
  const [downloadingOrderId, setDownloadingOrderId] = useState('');
  const { items, summary, filters, setFilterValue, isLoading, error } = useOrdersPage(navigate);

  const saveDownloadedFile = (blob, fileName) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName || 'order-document.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
  };

  const openOrderChat = (item) => {
    if (item?.conversationId) {
      setPendingConversationFocusId(item.conversationId);
    }

    navigate(ROUTES.messages);
  };

  const openOrderDetail = (item) => {
    if (item?.detailSlug) {
      navigate(buildTaskDetailRoute(item.detailSlug));
      return;
    }

    navigate(ROUTES.profile);
  };

  const handleDownloadDocument = async (item) => {
    if (!item?.id || !item?.hasDocument) {
      toast.info({
        title: 'PDF hazir deyil',
        message: 'Bu sifaris ucun PDF hele generasiya olunmayib.'
      });
      return;
    }

    setDownloadingOrderId(String(item.id));

    try {
      const response = await downloadOrderDocument(item.id);
      saveDownloadedFile(response.blob, response.fileName || `${item.orderNumber || 'order'}-summary.pdf`);
      toast.success({
        title: 'PDF endirildi',
        message: 'Sifaris sənədi ugurla yuklendi.'
      });
    } catch (nextError) {
      toast.error({
        title: 'PDF endirilemedi',
        message: nextError?.message || 'Sifaris senedini yuklemek mumkun olmadi.'
      });
    } finally {
      setDownloadingOrderId('');
    }
  };

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
            <span className="profileEyebrow">{t('Delivery Hub')}</span>
            <h1>{t('My Orders & Jobs')}</h1>
            <p>{t('Track active posts, delivery rhythm and collaboration status in one connected view. Newly published jobs appear here first.')}</p>
          </div>
          <div className="workspaceMetricsGrid">
            <MetricCard label={t('Active')} value={summary?.active || 0} icon={BriefcaseBusiness} />
            <MetricCard label={t('In Review')} value={summary?.review || 0} icon={CalendarClock} />
            <MetricCard label={t('Total Value')} value={summary?.totalValue || '$0'} icon={CircleDollarSign} />
          </div>
        </section>

        <section className="workspacePanel cardLift">
          <div className="workspaceToolbar">
            <label className="talentSearchInput">
              <Search size={16} />
              <input
                value={filters.search}
                onChange={(event) => setFilterValue('search', event.target.value)}
                placeholder={t('Search jobs, updates, categories')}
              />
            </label>
            <select className="talentSelect" value={filters.status} onChange={(event) => setFilterValue('status', event.target.value)}>
              <option value="all">{t('All statuses')}</option>
              <option value="active">{t('Active')}</option>
              <option value="review">{t('Review')}</option>
              <option value="completed">{t('Completed')}</option>
            </select>
            <select className="talentSelect" value={filters.role} onChange={(event) => setFilterValue('role', event.target.value)}>
              <option value="all">{t('All roles')}</option>
              <option value="owner">{t('My job posts')}</option>
              <option value="participant">{t('Collaborations')}</option>
            </select>
            <select className="talentSelect" value={filters.sort} onChange={(event) => setFilterValue('sort', event.target.value)}>
              <option value="updated">{t('Latest updates')}</option>
              <option value="deadline">{t('Closest deadline')}</option>
              <option value="budget">{t('Highest budget')}</option>
              <option value="progress">{t('Highest progress')}</option>
            </select>
          </div>

          {isLoading ? (
            <div className="workspaceEmptyState">
              <LoaderCircle className="spinLoader" size={24} /> {t('Loading orders...')}
            </div>
          ) : error ? (
            <div className="workspaceEmptyState">{t(error)}</div>
          ) : items.length ? (
            <div className="workspaceCardGrid">
              {items.map((item) => (
                <article key={item.id} className="workspaceEntityCard cardLift fadeUp">
                  <div className="workspaceEntityTop">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.role === 'participant' ? item.freelancer : item.client} - {item.category}</p>
                    </div>
                    <span className={`workspaceBadge ${item.status}`}>{t(item.status)}</span>
                  </div>
                  <div className="workspaceOrderMetaRow">
                    {item.orderNumber ? <span className="workspaceBadge order">#{item.orderNumber}</span> : null}
                    {item.termsVersion ? <span className="workspaceBadge security">Terms {item.termsVersion}</span> : null}
                    {item.documentStatus ? (
                      <span className={`workspaceBadge ${item.documentStatus}`}>
                        {item.documentStatus === 'ready' ? t('PDF Ready') : t(item.documentStatus)}
                      </span>
                    ) : null}
                  </div>
                  <div className="workspaceProgressTrack">
                    <span style={{ width: `${Math.min(100, Math.max(0, item.progress || 0))}%` }} />
                  </div>
                  <div className="workspaceEntityMeta">
                    <span>{t(`${item.progress}% complete`)}</span>
                    <span>{item.budget}</span>
                    <span>{t(`Due ${item.dueDate}`)}</span>
                  </div>
                  <p className="workspaceMutedText">{item.lastUpdate}</p>
                  <div className="workspaceInlineActions">
                    <button type="button" className="profileActionButton interactive" onClick={() => openOrderChat(item)}>
                      {t('Open chat')}
                    </button>
                    <button
                      type="button"
                      className="profileActionButton interactive"
                      onClick={() => handleDownloadDocument(item)}
                      disabled={!item.hasDocument || downloadingOrderId === String(item.id)}
                    >
                      {downloadingOrderId === String(item.id) ? (
                        t('Downloading...')
                      ) : (
                        <>
                          <Download size={15} /> {t('Download PDF')}
                        </>
                      )}
                    </button>
                    <button type="button" className="profileActionButton interactive" onClick={() => openOrderDetail(item)}>
                      {t('Open detail')}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="workspaceEmptyState">
              <Sparkles size={18} /> {t('No orders match the selected query.')}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
