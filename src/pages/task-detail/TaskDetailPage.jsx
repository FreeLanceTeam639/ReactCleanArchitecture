import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Heart,
  Images,
  ShoppingBag,
  Star
} from 'lucide-react';
import {
  fetchTaskDetailBySlug,
  hireTaskService,
  startTaskConversation
} from '../../features/task-detail/services/taskDetailService.js';
import { CommentThread } from '../../components/ui/reddit-nested-thread-reply.jsx';
import { OrderConfirmationCard } from '../../components/ui/order-confirmation-card.jsx';
import { fetchWalletSummary } from '../../features/workspace/services/workspaceService.js';
import { buildTaskDetailRoute, getTaskSlugFromPathname, ROUTES } from '../../shared/constants/routes.js';
import { useToast } from '../../shared/hooks/useToast.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { getAuthenticatedUser, hasAuthenticatedSession } from '../../shared/lib/storage/authStorage.js';
import { setPendingOrderConfirmation } from '../../shared/lib/storage/orderConfirmationState.js';
import { setPendingConversationFocusId } from '../../shared/lib/storage/workspaceConversationState.js';
import HomeFooter from '../../widgets/home/HomeFooter.jsx';
import TaskDetailHeader from '../../widgets/task-detail/TaskDetailHeader.jsx';

const transitionUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' }
};

function parseMoneyValue(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const normalizedValue = String(value || '')
    .replace(/[^0-9.,-]/g, '')
    .replace(/,/g, '');
  const numericValue = Number(normalizedValue);

  return Number.isFinite(numericValue) ? numericValue : 0;
}

function normalizeIdentityValue(value) {
  return String(value || '').trim().toLowerCase();
}

function renderStars(score) {
  const safeScore = Math.round(Number(score || 0));

  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={`${score}-${index}`}
      size={15}
      className={index < safeScore ? 'detailStar active' : 'detailStar'}
      fill={index < safeScore ? 'currentColor' : 'none'}
    />
  ));
}

function formatOwnerTasksDescription(name, language) {
  if (language === 'az') {
    return `${name} tərəfindən paylaşılmış tapşırıqlar burada yuxarıdan aşağı düzülüb. Hər hansına klik etdikdə həmin tapşırığın detail səhifəsi açılacaq.`;
  }

  if (language === 'ru') {
    return `Здесь сверху вниз показаны задачи, опубликованные ${name}. Нажмите на любую из них, чтобы открыть страницу деталей.`;
  }

  return `Tasks shared by ${name} are listed here. Select any of them to open its detail page.`;
}

function formatReviewHeading(detail, isJobBrief, t) {
  if (!detail.reviews || detail.reviews <= 0) {
    return t(detail.reviewSectionTitle);
  }

  const reviewLabel = isJobBrief
    ? t(detail.reviews === 1 ? 'owner review' : 'owner reviews')
    : t(detail.reviews === 1 ? 'review' : 'reviews');

  return `${detail.reviews} ${reviewLabel} (${detail.rating} ${t('overall rating')})`;
}

export default function TaskDetailPage({ navigate, pathname }) {
  const { t, language } = useI18n();
  const slug = getTaskSlugFromPathname(pathname);
  const toast = useToast();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [isOpeningChat, setIsOpeningChat] = useState(false);
  const [isHiringTask, setIsHiringTask] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const [activeImage, setActiveImage] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadDetail() {
      try {
        const payload = await fetchTaskDetailBySlug(slug);

        if (!isCancelled) {
          setDetail(payload);
          setError('');
          setSelectedPackage(payload.packages[1]?.key || payload.packages[0]?.key || '');
          setActiveImage(payload.gallery?.[0] || '');
          setOpenFaq(0);
          setTermsAccepted(false);
          setOrderConfirmation(null);
        }
      } catch {
        if (!isCancelled) {
          setDetail(null);
          setError('Task detail could not be loaded.');
        }
      }
    }

    loadDetail();

    return () => {
      isCancelled = true;
    };
  }, [slug]);

  if (!detail) {
    return (
      <div className="detailPageShell">
        <TaskDetailHeader navigate={navigate} />
        <main className="wrap detailPage fadeUp">
          <section className="detailTitleCard">{t(error || 'Loading task detail...')}</section>
        </main>
      </div>
    );
  }

  if (!detail.packages.length || !detail.gallery.length) {
    return (
      <div className="detailPageShell">
        <TaskDetailHeader navigate={navigate} />
        <main className="wrap detailPage fadeUp">
          <section className="detailTitleCard">{t('Task detail is currently unavailable.')}</section>
        </main>
      </div>
    );
  }

  const selectedPackageData = detail.packages.find((item) => item.key === selectedPackage) || detail.packages[0];
  const selectedOwnerTask =
    detail.ownerTasks.find((item) => item.slug === detail.slug) ||
    detail.ownerTasks[0] ||
    null;
  const authenticatedUser = getAuthenticatedUser()?.user || null;
  const authenticatedUserId = normalizeIdentityValue(authenticatedUser?.id || authenticatedUser?.userId);
  const ownerUserId = normalizeIdentityValue(detail.ownerUserId);
  const isOwnTask = Boolean(authenticatedUserId && ownerUserId && authenticatedUserId === ownerUserId);
  const isJobBrief = detail.detailType === 'job-brief';
  const faqEyebrow = isJobBrief ? t('Project questions') : t('Frequently asked questions');
  const faqHeading = isJobBrief
    ? t('Everything you may want to confirm before replying to this brief')
    : t('Everything you may want to know before starting');
  const reviewHeading = formatReviewHeading(detail, isJobBrief, t);
  const chatButtonLabel = isOpeningChat
    ? t('Opening chat...')
    : isOwnTask
      ? t('This is your listing')
      : t('Open chat');
  const hireButtonLabel = isHiringTask
    ? t('Creating order...')
    : isOwnTask
      ? t('This is your listing')
      : t(detail.primaryActionLabel || 'Hire me for this task');
  const selectedTaskPanelLabel = selectedOwnerTask
    ? t('Project budget')
    : t(selectedPackageData.name);
  const selectedTaskPanelPrice = selectedOwnerTask?.budgetLabel || `$${selectedPackageData.price}`;
  const selectedTaskPanelDescription = selectedOwnerTask?.summary || selectedPackageData.description;
  const selectedTaskPanelTimeline = selectedOwnerTask?.timeline || selectedPackageData.delivery;
  const selectedTaskPanelStatus = selectedOwnerTask
    ? t('Scope can be refined in chat')
    : t(selectedPackageData.revisions);
  const selectedTaskFeatures = selectedOwnerTask
    ? [
        'Direct access to the job owner',
        'Budget and scope alignment',
        'Timeline clarification',
        'Order-ready brief'
      ]
    : detail.included;

  const resolveTaskActionErrorMessage = (message) => {
    const normalizedMessage = String(message || '').toLowerCase();

    if (
      normalizedMessage.includes('your own profile') ||
      normalizedMessage.includes('your own job post') ||
      normalizedMessage.includes('yourself')
    ) {
      return t('You cannot start a conversation with your own listing.');
    }

    return t(message || 'Conversation could not be started.');
  };

  const handleTaskAction = async (action) => {
    const isChatAction = action === 'chat';

    if (!hasAuthenticatedSession()) {
      navigate(ROUTES.login);
      return;
    }

    if (isOwnTask) {
      toast.info({
        title: t('Message was not sent'),
        message: t('You cannot start a conversation with your own listing.')
      });
      return;
    }

    if (!isChatAction) {
      if (!termsAccepted) {
        toast.error({
          title: t('Order terms were not accepted'),
          message: t('Please accept the current terms before completing the order.')
        });
        return;
      }

      try {
        const walletSummary = await fetchWalletSummary();
        const availableBalance = parseMoneyValue(walletSummary?.availableBalance);
        const requiredBalance = parseMoneyValue(selectedPackageData?.price);

        if (availableBalance < requiredBalance) {
          toast.error({
            title: t('Insufficient balance'),
            message: t('Please add funds to your wallet before ordering this service.')
          });
          navigate(ROUTES.wallet);
          return;
        }
      } catch {
        // If wallet summary could not be loaded, fall back to backend validation below.
      }
    }

    if (isChatAction) {
      setIsOpeningChat(true);
    } else {
      setIsHiringTask(true);
    }

    try {
      const result = isChatAction
        ? await startTaskConversation(detail.slug, selectedPackageData?.key, 'chat')
        : await hireTaskService(detail.slug, selectedPackageData?.key, {
            termsAccepted,
            termsVersion: detail.termsVersion
          });

      if (result?.conversationId && isChatAction) {
        setPendingConversationFocusId(result.conversationId);
      }

      const normalizedMessage = String(result?.message || '').toLowerCase();
      const isExistingFlow =
        normalizedMessage.includes('artiq') ||
        normalizedMessage.includes('already') ||
        normalizedMessage.includes('existing');

      const toastMethod = isExistingFlow ? toast.info : toast.success;

      toastMethod({
        title: isChatAction ? t('Chat ready') : t('Order ready'),
        message: isChatAction ? t('The conversation was opened successfully.') : t('The order was created successfully.')
      });

      if (!isChatAction && result?.orderNumber && !isExistingFlow) {
        setPendingOrderConfirmation({
          orderId: result.orderNumber,
          paymentMethod: t('Wallet balance'),
          dateTime: new Date().toLocaleString(),
          totalAmount: selectedTaskPanelPrice
        });
      }

      navigate(isChatAction ? ROUTES.messages : ROUTES.orders);
    } catch (nextError) {
      toast.error({
        title: isChatAction ? t('Chat could not be opened') : t('Order could not be created'),
        message: resolveTaskActionErrorMessage(nextError?.message)
      });
    } finally {
      if (isChatAction) {
        setIsOpeningChat(false);
      } else {
        setIsHiringTask(false);
      }
    }
  };

  return (
    <div className="detailPageShell">
      <TaskDetailHeader navigate={navigate} />

      <main className="wrap detailPage fadeUp">
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

        <motion.section className="detailTitleCard" {...transitionUp}>
          <div>
            <span className="detailCategoryPill">{detail.category}</span>
            <h1>{detail.title}</h1>
            <div className="detailMetaRow">
              <span className="detailMetaInline detailMetaReview">
                <span className="detailStars">{renderStars(detail.rating)}</span>
                <strong>{detail.rating}/5.0</strong>
                <span>
                  {detail.reviews} {t(isJobBrief ? (detail.reviews === 1 ? 'owner review' : 'owner reviews') : detail.reviews === 1 ? 'review' : 'reviews')}
                </span>
              </span>
              <span className="detailMetaInline">
                <ShoppingBag size={16} />
                {detail.sales} {t(isJobBrief ? (detail.sales === 1 ? 'open brief' : 'open briefs') : detail.sales === 1 ? 'sale' : 'sales')}
              </span>
              <span className="detailMetaInline">
                <Eye size={16} />
                {detail.views} {t('views')}
              </span>
              <button type="button" className="detailSaveButton interactive">
                <Heart size={16} />
                {t('Save')}
              </button>
            </div>
          </div>
        </motion.section>

        <section className="detailGrid">
          <div className="detailMainColumn">
            <motion.div className="detailVisualCard" {...transitionUp} transition={{ duration: 0.5, delay: 0.05 }}>
              <div className="detailMainVisualWrap">
                <img src={activeImage} alt={detail.title} className="detailMainVisual" />
                <div className="detailVisualMeta">
                  <span className="detailVisualPill">{detail.category}</span>
                  <span className="detailVisualPill dark">
                    <Images size={15} />
                    {detail.gallery.length} {t('images')}
                  </span>
                </div>
              </div>
              <div className="detailThumbRow">
                {detail.gallery.map((image, index) => (
                  <motion.button
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    key={`${image}-${index}`}
                    className={activeImage === image ? 'detailThumb active' : 'detailThumb'}
                    onClick={() => setActiveImage(image)}
                    aria-label={`Preview ${index + 1}`}
                  >
                    <img src={image} alt={`${detail.title} preview ${index + 1}`} />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.section className="detailContentCard" {...transitionUp} transition={{ duration: 0.5, delay: 0.1 }}>
              <p className="detailLeadText">{detail.summary}</p>
              <div className="detailChecklist">
                {detail.highlights.map((item) => (
                  <div key={item} className="detailChecklistItem">
                    <span className="detailCheckIcon">
                      <Check size={15} />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              {detail.overview.map((paragraph) => (
                <p key={paragraph} className="detailParagraph">
                  {paragraph}
                </p>
              ))}
              <div className="detailTagRow">
                <span className="detailTagLabel">{t('Tags:')}</span>
                {detail.tags.map((tag) => (
                  <span key={tag} className="detailTagChip">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.section>

            <motion.section className="detailContentCard" {...transitionUp} transition={{ duration: 0.5, delay: 0.16 }}>
              <div className="detailSectionHeading">
                <div>
                  <span className="eyebrow">{faqEyebrow}</span>
                  <h2>{faqHeading}</h2>
                </div>
              </div>

              <div className="detailFaqList">
                {detail.faqs.map((faq, index) => {
                  const isOpen = openFaq === index;

                  return (
                    <motion.div key={faq.question} className={isOpen ? 'detailFaqItem open' : 'detailFaqItem'} layout>
                      <button
                        type="button"
                        className="detailFaqButton"
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                      >
                        <span>{faq.question}</span>
                        <ChevronDown size={18} className={isOpen ? 'detailFaqChevron open' : 'detailFaqChevron'} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            key="content"
                            className="detailFaqContent"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                          >
                            <p>{faq.answer}</p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>

            <motion.section className="detailContentCard" {...transitionUp} transition={{ duration: 0.5, delay: 0.22 }}>
              <div className="detailSectionHeading detailReviewHeading">
                <div>
                  <span className="eyebrow">{t(detail.reviewSectionEyebrow)}</span>
                  <h2>{reviewHeading}</h2>
                </div>
              </div>

              <CommentThread
                items={detail.reviewThread}
                groupByProject
                className="detailReviewThread"
                emptyTitle={t(isJobBrief ? 'No task reviews yet' : 'No client reviews yet')}
                emptyDescription={
                  t(
                    isJobBrief
                      ? 'Reviews from completed deliveries on this task will appear here once collaborators leave feedback.'
                      : 'Completed collaborations will appear here as soon as clients start leaving feedback.'
                  )
                }
              />
            </motion.section>
          </div>

          <motion.aside className="detailSidebarColumn" {...transitionUp} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="detailStickyStack">
              <div className="detailPackageCard">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedOwnerTask?.slug || selectedPackageData.key}
                    className="detailPackageBody"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                  >
                    <div className="detailPackageMetaTop">
                      <div className="detailPackageMiniAvatar">
                        <img src={detail.avatar} alt={detail.name} />
                      </div>
                      <div>
                        <span className="detailPackageLabel">{selectedTaskPanelLabel}</span>
                        <h3>{selectedTaskPanelPrice}</h3>
                      </div>
                    </div>

                    <p className="detailPackageDescription">{selectedTaskPanelDescription}</p>

                    <div className="detailInfoPill">
                      <Clock3 size={16} />
                      <strong>{t('Timeline')}</strong>
                      <span>{selectedTaskPanelTimeline}</span>
                    </div>

                    <div className="detailInfoPill muted">
                      <BadgeCheck size={16} />
                      <strong>{selectedTaskPanelStatus}</strong>
                    </div>

                    <div className="detailFeatureBlock">
                      <h4>{t('Features included')}</h4>
                      {selectedTaskFeatures.map((feature) => (
                        <div key={`${selectedOwnerTask?.slug || selectedPackageData.key}-${feature}`} className="detailIncludedRow">
                          <Check size={15} />
                          <span>{t(feature)}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="detailActionGroup">
                  <div className="detailTermsCard">
                    <div className="detailTermsHeader">
                      <div className="detailTermsIcon">
                        <FileText size={18} />
                      </div>
                      <div>
                        <strong>{t('Order terms acceptance')}</strong>
                        <span>{t('Version')} {detail.termsVersion}</span>
                      </div>
                    </div>
                    <p>{t(detail.termsSummary)}</p>
                    <label className="detailTermsCheckbox">
                      <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(event) => setTermsAccepted(event.target.checked)}
                      />
                      <span>{t('I accept the current terms and confirm the order details before hire.')}</span>
                    </label>
                  </div>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="btn full detailOpenChatButton"
                    onClick={() => handleTaskAction('chat')}
                    disabled={isOpeningChat || isHiringTask}
                  >
                    {chatButtonLabel}
                    <ArrowRight size={16} />
                  </motion.button>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="btn primary full detailHireButton"
                    onClick={() => handleTaskAction('hire')}
                    disabled={isOpeningChat || isHiringTask}
                  >
                    {hireButtonLabel}
                    <ArrowRight size={16} />
                  </motion.button>
                </div>
              </div>

              <div className="detailOwnerTasksCard">
                <div className="detailOwnerTasksHeader">
                  <span className="eyebrow">{t('Task shortlist')}</span>
                  <h3>{t('Open another task detail')}</h3>
                  <p>{formatOwnerTasksDescription(detail.name, language)}</p>
                </div>

                <div className="detailOwnerTasksList">
                  {detail.ownerTasks.map((task) => {
                    const isSelected = detail.slug === task.slug;

                    return (
                      <button
                        type="button"
                        key={task.slug || task.id}
                        className={isSelected ? 'detailOwnerTaskItem active' : 'detailOwnerTaskItem'}
                        onClick={() => {
                          if (!task.slug || task.slug === detail.slug) {
                            if (task.coverImageUrl) {
                              setActiveImage(task.coverImageUrl);
                            }
                            return;
                          }

                          navigate(buildTaskDetailRoute(task.slug));
                        }}
                      >
                        <div className="detailOwnerTaskThumb">
                          <img src={task.coverImageUrl || detail.avatar} alt={task.title} />
                        </div>

                        <div className="detailOwnerTaskContent">
                          <span>{task.category || detail.category}</span>
                          <strong>{task.title}</strong>
                          <p>{task.summary}</p>
                        </div>

                        <div className="detailOwnerTaskMeta">
                          <strong>{task.budgetLabel || '$0'}</strong>
                          <span>{task.timeline || t('Flexible timeline')}</span>
                          <em>{isSelected ? t('Current detail') : t('Open detail')}</em>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.aside>
        </section>
      </main>

      <HomeFooter />
    </div>
  );
}
