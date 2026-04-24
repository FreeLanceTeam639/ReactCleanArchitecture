import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarClock,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  CheckCircle2,
  Clock3,
  Flag,
  LoaderCircle,
  MessageSquareText,
  Search,
  Sparkles,
  Truck,
  XCircle,
  Users
} from 'lucide-react';
import { useOrdersPage } from '../../features/workspace/hooks/useOrdersPage.js';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { buildTaskDetailRoute, ROUTES } from '../../shared/constants/routes.js';
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

function OrderVisual({ item, variant = 'thumb' }) {
  const hasImage = Boolean(item?.imageUrl);

  if (variant === 'poster') {
    return (
      <div className={hasImage ? `workspaceOrderPoster ${item.status} hasImage` : `workspaceOrderPoster ${item.status}`}>
        {hasImage ? <img src={item.imageUrl} alt={item.title} className="workspaceOrderPosterImage" /> : null}
        <div className="workspaceOrderPosterOverlay" />
        <span>{getOrderMonogram(item.title)}</span>
        <small>{item.category}</small>
      </div>
    );
  }

  return (
    <div className={hasImage ? `workspaceOrderThumb ${item.status} hasImage` : `workspaceOrderThumb ${item.status}`}>
      {hasImage ? <img src={item.imageUrl} alt={item.title} className="workspaceOrderThumbImage" /> : null}
      <div className="workspaceOrderThumbOverlay" />
      <span>{getOrderMonogram(item.title)}</span>
      {item.orderNumber ? <small>#{String(item.orderNumber).slice(-4)}</small> : null}
    </div>
  );
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

function buildTimelineSteps(item, t) {
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
      key: 'workspace',
      icon: Users,
      tone: 'neutral',
      eyebrow: t('Workspace type'),
      title: String(item?.role || '').toLowerCase() === 'participant' ? t('Collaboration order') : t('Published job record'),
      description:
        String(item?.role || '').toLowerCase() === 'participant'
          ? t('This record comes from a direct hire and chat workflow.')
          : t('This record represents one of your own published job posts.')
    }
  ];
}

export default function OrdersPage({ navigate }) {
  const { t } = useI18n();
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState('');
  const {
    items,
    summary,
    filters,
    busyAction,
    actionFeedback,
    setFilterValue,
    isLoading,
    error,
    runOrderAction
  } = useOrdersPage(navigate);

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
      const pendingConfirmationOrderId = String(orderConfirmation?.orderId || '').trim();

      if (pendingConfirmationOrderId) {
        const matchingConfirmedOrder = items.find((item) => {
          const normalizedItemId = String(item?.id || '').trim();
          const normalizedOrderNumber = String(item?.orderNumber || '').trim();

          return normalizedItemId === pendingConfirmationOrderId || normalizedOrderNumber === pendingConfirmationOrderId;
        });

        if (matchingConfirmedOrder?.id) {
          return String(matchingConfirmedOrder.id);
        }
      }

      if (currentId && items.some((item) => String(item.id) === String(currentId))) {
        return currentId;
      }

      return String(items[0].id);
    });
  }, [items, orderConfirmation]);

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

  const handleOrderAction = async (item, action, note = '') => {
    await runOrderAction(item.id, action, note);
  };

  const orderRows = useMemo(
    () =>
      items.map((item) => {
        const counterpart = item.role === 'participant' ? item.freelancer : item.client;
        const isExpanded = String(expandedOrderId) === String(item.id);
        const progressValue = Math.min(100, Math.max(0, Number(item.progress) || 0));
        const isParticipantOrder = String(item.role || '').toLowerCase() === 'participant';
        const timelineSteps = buildTimelineSteps(item, t);

        return {
          ...item,
          counterpart,
          isExpanded,
          progressValue,
          isParticipantOrder,
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
              {actionFeedback ? <div className="profileFeedbackBanner">{t(actionFeedback)}</div> : null}
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
                      <OrderVisual item={item} />

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

                          <button type="button" className="profileActionButton interactive" onClick={() => openOrderDetail(item)}>
                            <ArrowUpRight size={15} /> {t('Open detail')}
                          </button>

                          {item.isParticipantOrder && item.status === 'review' ? (
                            <button
                              type="button"
                              className="profileActionButton interactive"
                              disabled={busyAction === `${item.id}:start`}
                              onClick={() => handleOrderAction(item, 'start')}
                            >
                              <Clock3 size={15} /> {busyAction === `${item.id}:start` ? t('Saving...') : t('Start order')}
                            </button>
                          ) : null}

                          {item.isParticipantOrder && item.status === 'active' ? (
                            <button
                              type="button"
                              className="profileActionButton interactive"
                              disabled={busyAction === `${item.id}:deliver`}
                              onClick={() => handleOrderAction(item, 'deliver')}
                            >
                              <Truck size={15} /> {busyAction === `${item.id}:deliver` ? t('Saving...') : t('Submit delivery')}
                            </button>
                          ) : null}

                          {item.isParticipantOrder && item.status === 'review' ? (
                            <button
                              type="button"
                              className="profileActionButton interactive"
                              disabled={busyAction === `${item.id}:complete`}
                              onClick={() => handleOrderAction(item, 'complete')}
                            >
                              <CheckCircle2 size={15} /> {busyAction === `${item.id}:complete` ? t('Saving...') : t('Complete order')}
                            </button>
                          ) : null}

                          {item.isParticipantOrder && item.status !== 'completed' ? (
                            <button
                              type="button"
                              className="profileActionButton interactive"
                              disabled={busyAction === `${item.id}:issue`}
                              onClick={() => handleOrderAction(item, 'issue', 'There is a problem with this order. Please review the chat evidence.')}
                            >
                              <Flag size={15} /> {busyAction === `${item.id}:issue` ? t('Saving...') : t('Report issue')}
                            </button>
                          ) : null}

                          {item.isParticipantOrder && item.status !== 'completed' ? (
                            <button
                              type="button"
                              className="profileActionButton interactive"
                              disabled={busyAction === `${item.id}:cancel`}
                              onClick={() => handleOrderAction(item, 'cancel', 'Order cancelled from workspace actions.')}
                            >
                              <XCircle size={15} /> {busyAction === `${item.id}:cancel` ? t('Saving...') : t('Cancel order')}
                            </button>
                          ) : null}
                        </div>
                      </div>

                      <div className="workspaceOrderExpandedGrid">
                        <aside className="workspaceOrderAside">
                          <div className="workspaceOrderShowcase">
                            <OrderVisual item={item} variant="poster" />

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
                              <span>{t('Workspace type')}</span>
                              <strong>{item.isParticipantOrder ? t('Collaboration order') : t('Published job record')}</strong>
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
