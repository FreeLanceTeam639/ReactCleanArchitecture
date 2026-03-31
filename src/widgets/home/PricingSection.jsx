import { PricingInteraction } from '../../components/ui/pricing-interaction.jsx';
import { ROUTES } from '../../shared/constants/routes.js';
import { STORAGE_KEYS } from '../../shared/constants/storageKeys.js';
import { useToast } from '../../shared/hooks/useToast.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import { hasAuthenticatedSession, setPostLoginRedirect } from '../../shared/lib/storage/authStorage.js';
import { beginBillingCheckoutIntent } from '../../shared/lib/storage/billingCheckoutStorage.js';

function resolvePlanCatalog(plans) {
  const safePlans = Array.isArray(plans) ? plans : [];
  const nonFreePlans = safePlans.filter((plan) => !String(plan?.key || plan?.name || '').toLowerCase().includes('free'));
  const starterPlan = safePlans.find((plan) => {
    const value = String(plan?.key || plan?.name || '').toLowerCase();
    return value.includes('starter');
  }) || nonFreePlans[0] || safePlans[1] || safePlans[0] || {};
  const growthPlan = safePlans.find((plan) => {
    const value = String(plan?.key || plan?.name || '').toLowerCase();
    return value.includes('growth') || value.includes('pro') || value.includes('scale');
  }) || nonFreePlans.find((plan) => plan !== starterPlan) || safePlans[2] || starterPlan;

  return {
    starterPlan,
    growthPlan
  };
}

function saveBillingPeriodPreference(periodIndex) {
  if (typeof window === 'undefined') {
    return;
  }

  const value = Number(periodIndex) === 1 ? 'yearly' : 'monthly';
  sessionStorage.setItem(STORAGE_KEYS.billingPeriodPreference, value);
}

function showCheckoutToast(toast, isAuthenticated) {
  if (!toast) {
    return;
  }

  toast.info({
    title: isAuthenticated ? 'Opening payment' : 'Login required',
    message: isAuthenticated
      ? 'Secure payment page is opening now.'
      : 'Please sign in first. We will open the payment page right after login.'
  });
}

export default function PricingSection({ navigate, onBillingChange, plans }) {
  const { t } = useI18n();
  const toast = useToast();
  const { starterPlan, growthPlan } = resolvePlanCatalog(plans);
  const isAuthenticated = hasAuthenticatedSession();
  const actionHref = isAuthenticated ? ROUTES.billing : ROUTES.login;

  const handleActionClick = ({ planIndex, periodIndex }) => {
    const selectedPlanKey = planIndex === 2 ? 'growth' : planIndex === 1 ? 'starter' : 'free';
    const selectedBillingPeriod = periodIndex === 1 ? 'yearly' : 'monthly';

    try {
      saveBillingPeriodPreference(periodIndex);
      beginBillingCheckoutIntent({
        planKey: selectedPlanKey,
        billingPeriod: selectedBillingPeriod,
        entryRoute: ROUTES.login,
        source: 'home-pricing'
      });

      if (!isAuthenticated) {
        setPostLoginRedirect(ROUTES.billing);
      }
    } catch {
      // Route transition should still happen even if session storage is temporarily unavailable.
    }

    showCheckoutToast(toast, isAuthenticated);
  };

  return (
    <section className="section pricingSec" id="pricing">
      <div className="wrap pricingSimpleWrap">
        <div className="pricingSimpleHead">
          <p className="eyebrow centerText">{t('Pricing built for growth')}</p>
          <h2 className="centerText">{t('Simple plans for cleaner project publishing and collaboration')}</h2>
          <p className="lead centerLead">
            {t('Pick the billing period and choose the plan that fits your current workflow. Clean, fast and easy to compare.')}
          </p>
        </div>

        <div className="pricingSimpleCardHolder">
          <div className="pricingInteractionShell pricingInteractionShellCompact cardLift">
            <PricingInteraction
              starterMonth={Number(starterPlan?.monthly ?? starterPlan?.monthlyPrice ?? 9.99)}
              starterAnnual={Number(starterPlan?.yearly ?? starterPlan?.yearlyPrice ?? 99.99)}
              proMonth={Number(growthPlan?.monthly ?? growthPlan?.monthlyPrice ?? 19.99)}
              proAnnual={Number(growthPlan?.yearly ?? growthPlan?.yearlyPrice ?? 199.99)}
              freeLabel={t('Free')}
              starterLabel={starterPlan?.name || t('Starter')}
              proLabel={growthPlan?.name || t('Pro')}
              starterBadge={starterPlan?.badge || t('Popular')}
              freeCaption={t('1 active job post with 15-day active duration.')}
              starterMonthlyCaption={t('5 active job posts with 30-day renewal cycle.')}
              proMonthlyCaption={t('Unlimited active job posts with no renewal deadline.')}
              monthlyPriceSuffix={t('/month')}
              yearlyPriceSuffix={t('/year')}
              monthlyLabel={t('Monthly')}
              yearlyLabel={t('Yearly')}
              actionLabel={t('Get Started')}
              actionHref={actionHref}
              onPeriodChange={(index) => onBillingChange(index === 0 ? 'monthly' : 'yearly')}
              onActionClick={handleActionClick}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
