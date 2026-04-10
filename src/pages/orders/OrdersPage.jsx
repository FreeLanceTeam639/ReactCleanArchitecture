import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  Clock3,
  Download,
  FileText,
  LoaderCircle,
  MessageSquareText,
  Search,
  Sparkles,
  TriangleAlert
} from 'lucide-react';
import { useOrdersPage } from '../../features/workspace/hooks/useOrdersPage.js';
import { downloadOrderDocument } from '../../features/workspace/services/workspaceService.js';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { buildTaskDetailRoute, ROUTES } from '../../shared/constants/routes.js';
import { useToast } from '../../shared/hooks/useToast.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { consumePendingOrderConfirmation } from '../../shared/lib/storage/orderConfirmationState.js';
import { setPendingConversationFocusId } from '../../shared/lib/storage/workspaceConversationState.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import SelectOne from '../../components/ui/select-1.jsx';
import { OrderConfirmationCard } from '../../components/ui/order-confirmation-card.jsx';

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

function OrderTimelineStep({ icon: Icon, eyebrow, title, description, tone = 'neutral' }) {
  return (
    <article className={`workspaceOrderTimelineStep ${tone}`}>
      <div className={`workspaceOrderTimelineIcon ${tone}`}>
        <Icon size={16} />
      </div>
      <div className="workspaceOrderTimelineCopy">
        <span>{eyebrow}</span>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>
    </article>
  );
}

function getOrderMonogram(title = '') {
  const words = String(title || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (!words.length) {
    return 'OR';
  }

  return words.map((word) => word.charAt(0).toUpperCase()).join('');
}

function getOrderStatusLabel(status, t) {
  const normalizedStatus = String(status || '').toLowerCase();

  if (normalizedStatus === 'review') {
    return t('In Review');
  }

  if (normalizedStatus === 'completed') {
    return t('Completed');
  }

  if (normalizedStatus === 'active') {
    return t('Active');
  }

  return t(normalizedStatus || 'Active');
}

function getDocumentStatusLabel(item, t) {
  const normalizedStatus = String(item?.documentStatus || '').toLowerCase();

  if (String(item?.role || '').toLowerCase() !== 'participant') {
    return t('PDF unavailable');
  }

  if (normalizedStatus === 'ready') {
    return t('PDF Ready');
  }

  if (normalizedStatus === 'queued' || normalizedStatus === 'processing') {
    return t('Generating PDF');
  }

  if (normalizedStatus === 'failed') {
    return t('PDF failed');
  }

  return t('PDF is not ready');
}

function getDocumentStatusDescription(item, t) {
  const normalizedStatus = String(item?.documentStatus || '').toLowerCase();

  if (String(item?.role || '').toLowerCase() !== 'participant') {
    return t('PDF files are created only for hired order records.');
  }

  if (normalizedStatus === 'ready') {
    return t('The order document is ready to download.');
  }

  if (normalizedStatus === 'queued' || normalizedStatus === 'processing') {
    return t('The document is being generated. Please check again in a few seconds.');
  }

  if (normalizedStatus === 'failed') {
    return t('The order PDF could not be generated. Please try again later.');
  }

  return t('The PDF for this order has not been generated yet.');
}

function getDocumentTone(item) {
  const normalizedStatus = String(item?.documentStatus || '').toLowerCase();

  if (String(item?.role || '').toLowerCase() !== 'participant') {
    return 'neutral';
  }

  if (normalizedStatus === 'ready') {
    return 'success';
  }

  if (normalizedStatus === 'queued' || normalizedStatus === 'processing') {
    return 'pending';
  }

  if (normalizedStatus === 'failed') {
    return 'danger';
  }

  return 'neutral';
}

function getDocumentIcon(item) {
  const normalizedStatus = String(item?.documentStatus || '').toLowerCase();

  if (normalizedStatus === 'ready') {
    return CheckCircle2;
  }

  if (normalizedStatus === 'queued' || normalizedStatus === 'processing') {
    return Clock3;
  }

  if (normalizedStatus === 'failed') {
    return TriangleAlert;
  }

  return FileText;
}

function buildTimelineSteps(item, t) {
  const documentTone = getDocumentTone(item);
  const DocumentIcon = getDocumentIcon(item);

  return [
    {
      key: 'stage',
      icon: BriefcaseBusiness,
      tone: String(item?.status || '').toLowerCase() === 'completed' ? 'success' : 'accent',
      eyebrow: t('Current stage'),
      title: getOrderStatusLabel(item?.status, t),
      description: item?.lastUpdate || t('This workspace is syncing the latest delivery update.')
    },
    {
      key: 'progress',
      icon: CalendarClock,
      tone: 'pending',
      eyebrow: t('Progress'),
      title: `${Math.min(100, Math.max(0, Number(item?.progress) || 0))}%`,
      description: item?.dueDate ? `${t('Due date')}: ${item.dueDate}` : t('No deadline set')
    },
    {
      key: 'document',
      icon: DocumentIcon,
      tone: documentTone,
      eyebrow: t('Document status'),
      title: getDocumentStatusLabel(item, t),
      description: getDocumentStatusDescription(item, t)
    }
  ];
}

export default function OrdersPage({ navigate }) {
  const { t } = useI18n();
  const toast = useToast();
  const [downloadingOrderId, setDownloadingOrderId] = useState('');
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState('');
  const { items, summary, filters, setFilterValue, isLoading, error } = useOrdersPage(navigate);

  const statusOptions = [
    { value: 'all', label: 'All statuses' },
    { value: 'active', label: 'Active' },
    { value: 'review', label: 'Review' },
    { value: 'completed', label: 'Completed' }
  ];
  const roleOptions = [
    { value: 'all', label: 'All roles' },
    { value: 'owner', label: 'My job posts' },
    { value: 'participant', label: 'Collaborations' }
  ];
  const sortOptions = [
    { value: 'updated', label: 'Latest updates' },
    { value: 'deadline', label: 'Closest deadline' },
    { value: 'budget', label: 'Highest budget' },
    { value: 'progress', label: 'Highest progress' }
  ];

  useEffect(() => {
    const nextConfirmation = consumePendingOrderConfirmation();
    if (nextConfirmation?.orderId) {
      setOrderConfirmation(nextConfirmation);
    }
  }, []);

  useEffect(() => {
    if (!items.length) {
      setExpandedOrderId('');
      return;
    }

    setExpandedOrderId((currentId) => {
      if (currentId && items.some((item) => String(item.id) === String(currentId))) {
        return currentId;
      }

      return String(items[0].id);
    });
  }, [items]);

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
    const normalizedStatus = String(item?.documentStatus || '').toLowerCase();

    if (!item?.id) {
      return;
    }

    if (String(item?.role || '').toLowerCase() !== 'participant') {
      toast.info({
        title: t('PDF unavailable'),
        message: t('PDF files are created only for hired order records.')
      });
      return;
    }

    if (!item?.hasDocument) {
      if (normalizedStatus === 'queued' || normalizedStatus === 'processing') {
        toast.info({
          title: t('PDF is being prepared'),
          message: t('The document is being generated. Please check again in a few seconds.')
        });
      } else if (normalizedStatus === 'failed') {
        toast.error({
          title: t('PDF could not be prepared'),
          message: t('The order PDF could not be generated. Please try again later.')
        });
      } else {
        toast.info({
          title: t('PDF is not ready'),
          message: t('The PDF for this order has not been generated yet.')
        });
      }

      return;
    }

    setDownloadingOrderId(String(item.id));

    try {
      const response = await downloadOrderDocument(item.id);
      saveDownloadedFile(response.blob, response.fileName || `${item.orderNumber || 'order'}-summary.pdf`);
      toast.success({
        title: t('PDF downloaded'),
        message: t('The order document was downloaded successfully.')
      });
    } catch (nextError) {
      toast.error({
        title: t('PDF download failed'),
        message: nextError?.message || t('The order document could not be downloaded.')
      });
    } finally {
      setDownloadingOrderId('');
    }
  };

  const orderRows = useMemo(
    () =>
      items.map((item) => {
        const counterpart = item.role === 'participant' ? item.freelancer : item.client;
        const isExpanded = String(expandedOrderId) === String(item.id);
        const progressValue = Math.min(100, Math.max(0, Number(item.progress) || 0));
        const isParticipantOrder = String(item.role || '').toLowerCase() === 'participant';
        const normalizedDocumentStatus = String(item.documentStatus || '').toLowerCase();
        const timelineSteps = buildTimelineSteps(item, t);

        return {
          ...item,
          counterpart,
          isExpanded,
          progressValue,
          isParticipantOrder,
          normalizedDocumentStatus,
          timelineSteps
        };
      }),
    [expandedOrderId, items, t]
  );

  return (
    <div className="profileShell">
      <MarketplaceHeader
        navigate={navigate}
        links={AUTHENTICATED_NAVIGATION_LINKS}
        actionButton={{ label: t('Post Job'), route: ROUTES.postTask }}
      />

      <main className="wrap workspacePage fadeUp">
        {orderConfirmation ? (
          <div className="orderConfirmationInlineWrap">
            <OrderConfirmationCard
              orderId={orderConfirmation.orderId}
              paymentMethod={orderConfirmation.paymentMethod}
              dateTime={orderConfirmation.dateTime}
              totalAmount={orderConfirmation.totalAmount}
              title={t('Order created successfully')}
              buttonText={t('Continue to my orders')}
              onGoToAccount={() => setOrderConfirmation(null)}
            />
          </div>
        ) : null}

        <section className="workspaceHero workspaceOrdersHero cardLift">
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

        <section className="workspacePanel workspaceOrdersPanel cardLift">
          <div className="workspaceToolbar">
            <label className="talentSearchInput">
              <Search size={16} />
              <input
                value={filters.search}
                onChange={(event) => setFilterValue('search', event.target.value)}
                placeholder={t('Search jobs, updates, categories')}
              />
            </label>
            <SelectOne
              className="workspaceToolbarSelect"
              triggerClassName="interactive"
              value={filters.status}
              onChange={(nextValue) => setFilterValue('status', nextValue)}
              options={statusOptions}
            />
            <SelectOne
              className="workspaceToolbarSelect"
              triggerClassName="interactive"
              value={filters.role}
              onChange={(nextValue) => setFilterValue('role', nextValue)}
              options={roleOptions}
            />
            <SelectOne
              className="workspaceToolbarSelect"
              triggerClassName="interactive"
              value={filters.sort}
              onChange={(nextValue) => setFilterValue('sort', nextValue)}
              options={sortOptions}
            />
          </div>

          {isLoading ? (
            <div className="workspaceEmptyState">
              <LoaderCircle className="spinLoader" size={24} /> {t('Loading orders...')}
            </div>
          ) : error ? (
            <div className="workspaceEmptyState">{t(error)}</div>
          ) : orderRows.length ? (
            <div className="workspaceOrdersStack">
              {orderRows.map((item) => (
                <article
                  key={item.id}
                  className={item.isExpanded ? 'workspaceOrderCard expanded fadeUp' : 'workspaceOrderCard fadeUp'}
                >
                  <button
                    type="button"
                    className="workspaceOrderSummary interactive"
                    onClick={() => setExpandedOrderId((currentId) => (String(currentId) === String(item.id) ? '' : String(item.id)))}
                    aria-expanded={item.isExpanded}
                  >
                    <div className="workspaceOrderSummaryMain">
                      <div className={`workspaceOrderThumb ${item.status}`}>
                        <span>{getOrderMonogram(item.title)}</span>
                        {item.orderNumber ? <small>#{String(item.orderNumber).slice(-4)}</small> : null}
                      </div>

                      <div className="workspaceOrderSummaryCopy">
                        <div className="workspaceOrderSummaryTop">
                          <strong>{item.orderNumber ? `#${item.orderNumber}` : item.title}</strong>
                          <span className={`workspaceBadge ${item.status}`}>{getOrderStatusLabel(item.status, t)}</span>
                        </div>
                        <h3>{item.title}</h3>
                        <div className="workspaceOrderSummaryMeta">
                          <span className="workspaceOrderCounterparty">
                            <span className={`workspaceOrderStatusDot ${item.status}`} />
                            {item.counterpart}
                          </span>
                          <span>{item.category}</span>
                          {item.termsVersion ? <span>{t('Terms')} {item.termsVersion}</span> : null}
                        </div>
                      </div>
                    </div>

                    <div className="workspaceOrderSummarySide">
                      <div className="workspaceOrderValueBlock">
                        <small>{item.dueDate ? t('Due date') : t('Progress')}</small>
                        <span>{item.dueDate || `${item.progressValue}%`}</span>
                        <strong>{item.budget}</strong>
                      </div>
                      <span className="workspaceOrderExpandIcon">
                        {item.isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </span>
                    </div>
                  </button>

                  {item.isExpanded ? (
                    <div className="workspaceOrderExpanded">
                      <div className="workspaceOrderActions">
                        <span className="workspaceOrderSectionLabel">{t('Quick actions')}</span>
                        <div className="workspaceOrderActionButtons">
                          <button type="button" className="profileActionButton interactive" onClick={() => openOrderChat(item)}>
                            <MessageSquareText size={15} /> {t('Open chat')}
                          </button>

                          {item.isParticipantOrder ? (
                            <button
                              type="button"
                              className="profileActionButton interactive"
                              onClick={() => handleDownloadDocument(item)}
                              disabled={downloadingOrderId === String(item.id)}
                            >
                              {downloadingOrderId === String(item.id) ? (
                                t('Downloading...')
                              ) : (
                                <>
                                  <Download size={15} />
                                  {item.hasDocument ? t('Download PDF') : item.normalizedDocumentStatus === 'queued' || item.normalizedDocumentStatus === 'processing'
                                    ? t('PDF generating...')
                                    : t('Download PDF')}
                                </>
                              )}
                            </button>
                          ) : null}

                          <button type="button" className="profileActionButton interactive" onClick={() => openOrderDetail(item)}>
                            <ArrowUpRight size={15} /> {t('Open detail')}
                          </button>
                        </div>
                      </div>

                      <div className="workspaceOrderExpandedGrid">
                        <aside className="workspaceOrderAside">
                          <div className="workspaceOrderShowcase">
                            <div className={`workspaceOrderPoster ${item.status}`}>
                              <span>{getOrderMonogram(item.title)}</span>
                              <small>{item.category}</small>
                            </div>

                            <div className="workspaceOrderShowcaseCopy">
                              <span className="workspaceOrderSectionLabel">{t('Order workspace')}</span>
                              <strong>{item.title}</strong>
                              <p>{item.counterpart}</p>
                            </div>

                            <div className="workspaceOrderShowcasePrice">
                              <small>{t('Total Value')}</small>
                              <strong>{item.budget}</strong>
                            </div>
                          </div>

                          <div className="workspaceOrderFacts">
                            <div className="workspaceOrderFact">
                              <span>{t('Counterparty')}</span>
                              <strong>{item.counterpart}</strong>
                            </div>
                            <div className="workspaceOrderFact">
                              <span>{t('Category')}</span>
                              <strong>{item.category}</strong>
                            </div>
                            <div className="workspaceOrderFact">
                              <span>{t('Progress')}</span>
                              <strong>{item.progressValue}%</strong>
                            </div>
                            <div className="workspaceOrderFact">
                              <span>{t('Due date')}</span>
                              <strong>{item.dueDate || t('No deadline set')}</strong>
                            </div>
                            <div className="workspaceOrderFact fullWidth">
                              <span>{t('Document status')}</span>
                              <strong>{getDocumentStatusLabel(item, t)}</strong>
                            </div>
                          </div>
                        </aside>

                        <div className="workspaceOrderMain">
                          <section className="workspaceOrderTimelineCard">
                            <span className="workspaceOrderSectionLabel">{t('Latest updates')}</span>
                            <div className="workspaceOrderTimeline">
                              {item.timelineSteps.map((step) => (
                                <OrderTimelineStep
                                  key={step.key}
                                  icon={step.icon}
                                  eyebrow={step.eyebrow}
                                  title={step.title}
                                  description={step.description}
                                  tone={step.tone}
                                />
                              ))}
                            </div>
                          </section>

                          <section className="workspaceOrderNoteCard">
                            <span className="workspaceOrderSectionLabel">{t('Workspace notes')}</span>
                            <p>{item.lastUpdate || t('This workspace is syncing the latest delivery update.')}</p>
                          </section>
                        </div>
                      </div>
                    </div>
                  ) : null}
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
