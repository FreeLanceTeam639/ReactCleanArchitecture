import {
  BadgeCheck,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  LockKeyhole,
  ReceiptText,
  ShieldCheck
} from 'lucide-react';
import { useBillingPage } from '../../features/workspace/hooks/useBillingPage.js';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';

function FieldError({ message }) {
  if (!message) {
    return null;
  }

  return <small className="workspaceFieldError">{message}</small>;
}

function PlanCard({ item, selectedPlanKey, billingPeriod, onSelect }) {
  const isSelected = selectedPlanKey === item.key;
  const isUnlimited = item.maxActivePublishedJobs === null || item.maxActivePublishedJobs === undefined;
  const durationLabel = item.key === 'free'
    ? '15-day active duration'
    : item.key === 'starter'
      ? 'Renews every 30 days'
      : 'No renewal deadline';
  const limitLabel = isUnlimited ? 'Unlimited active jobs' : `${item.maxActivePublishedJobs} active jobs`;
  const price = billingPeriod === 'yearly'
    ? Number(item.yearlyPrice || 0)
    : Number(item.monthlyPrice || 0);

  return (
    <button
      type="button"
      className={isSelected ? 'workspacePlanCard isSelected' : 'workspacePlanCard'}
      onClick={() => onSelect(item.key)}
    >
      <div className="workspacePlanCardHeader">
        <div>
          <strong>{item.name}</strong>
          <p>{limitLabel}</p>
        </div>
        <span className={isSelected ? 'workspacePlanCardRadio isSelected' : 'workspacePlanCardRadio'} />
      </div>

      <div className="workspacePlanCardPricing">
        <strong>${price.toFixed(2)}</strong>
        <span>{billingPeriod === 'yearly' ? '/year' : '/month'}</span>
      </div>

      <div className="workspacePlanCardMeta">
        <span>{durationLabel}</span>
        {item.isCurrent ? <em className="workspacePlanPill">Current plan</em> : null}
      </div>
    </button>
  );
}

export default function BillingPage({ navigate }) {
  const {
    overview,
    selectedPlan,
    selectedPlanKey,
    billingPeriod,
    paymentForm,
    paymentErrors,
    receipt,
    currentCharge,
    isPaidPlan,
    cardBrand,
    isLoading,
    error,
    feedback,
    busyKey,
    setSelectedPlanKey,
    setBillingPeriod,
    setPaymentField,
    submitCheckout
  } = useBillingPage(navigate);

  const activeJobs = Number(overview?.activePublishedJobs || 0);
  const currentPlanName = overview?.currentPlanName || 'Free';
  const currentPlanUsage = overview?.isUnlimited
    ? `${activeJobs} active jobs`
    : `${activeJobs}/${overview?.maxActivePublishedJobs || 0} active jobs`;
  const checkoutLabel = selectedPlanKey === 'free'
    ? 'Activate free plan'
    : busyKey === 'checkout'
      ? 'Processing secure payment...'
      : `Pay $${currentCharge.toFixed(2)} and activate`;
  const maskedPreview = paymentForm.cardNumber.trim()
    ? `${cardBrand} **** ${paymentForm.cardNumber.replace(/\D/g, '').slice(-4)}`
    : 'Card details will appear here';

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
            <span className="profileEyebrow">Secure checkout</span>
            <h1>Complete your subscription payment</h1>
            <p>Select a plan, enter secure billing details and activate your workspace instantly.</p>
          </div>
          <div className="workspaceMetricsGrid">
            <article className="workspaceMetricCard cardLift">
              <span>Current plan</span>
              <strong>{currentPlanName}</strong>
            </article>
            <article className="workspaceMetricCard cardLift">
              <span>Usage</span>
              <strong>{currentPlanUsage}</strong>
            </article>
            <article className="workspaceMetricCard cardLift">
              <span>Checkout status</span>
              <strong>{isPaidPlan ? 'Card required' : 'No card needed'}</strong>
            </article>
          </div>
        </section>

        {isLoading ? (
          <section className="workspacePanel cardLift">
            <div className="workspaceEmptyState"><LoaderCircle className="spinLoader" size={24} /> Loading secure checkout...</div>
          </section>
        ) : error ? (
          <section className="workspacePanel cardLift">
            <div className="workspaceEmptyState">{error}</div>
          </section>
        ) : (
          <section className="workspaceSplitLayout singleTop">
            <article className="workspacePanel cardLift">
              <form className="workspaceBillingForm workspaceCheckoutForm" onSubmit={submitCheckout}>
                <div className="workspaceBillingToggle">
                  <button
                    type="button"
                    className={billingPeriod === 'monthly' ? 'workspaceBillingToggleBtn isActive' : 'workspaceBillingToggleBtn'}
                    onClick={() => setBillingPeriod('monthly')}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    className={billingPeriod === 'yearly' ? 'workspaceBillingToggleBtn isActive' : 'workspaceBillingToggleBtn'}
                    onClick={() => setBillingPeriod('yearly')}
                  >
                    Yearly
                  </button>
                </div>

                <div className="workspacePlanGrid">
                  {(overview?.plans || []).map((item) => (
                    <PlanCard
                      key={item.key}
                      item={item}
                      selectedPlanKey={selectedPlanKey}
                      billingPeriod={billingPeriod}
                      onSelect={setSelectedPlanKey}
                    />
                  ))}
                </div>

                <div className="workspaceCheckoutDivider">
                  <span>{isPaidPlan ? 'Secure card details' : 'Free activation'}</span>
                </div>

                {isPaidPlan ? (
                  <div className="workspaceCheckoutGrid">
                    <label className="workspaceCheckoutField fullWidth">
                      <span>Cardholder name</span>
                      <input
                        type="text"
                        value={paymentForm.cardholderName}
                        onChange={(event) => setPaymentField('cardholderName', event.target.value)}
                        placeholder="Name on card"
                        autoComplete="cc-name"
                      />
                      <FieldError message={paymentErrors.cardholderName} />
                    </label>

                    <label className="workspaceCheckoutField fullWidth">
                      <span>Billing email</span>
                      <input
                        type="email"
                        value={paymentForm.billingEmail}
                        onChange={(event) => setPaymentField('billingEmail', event.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                      <FieldError message={paymentErrors.billingEmail} />
                    </label>

                    <label className="workspaceCheckoutField fullWidth">
                      <span>Card number</span>
                      <div className="workspaceCardInputShell">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={paymentForm.cardNumber}
                          onChange={(event) => setPaymentField('cardNumber', event.target.value)}
                          placeholder="4242 4242 4242 4242"
                          autoComplete="cc-number"
                        />
                        <span className="workspaceCardBrandTag">{cardBrand}</span>
                      </div>
                      <FieldError message={paymentErrors.cardNumber} />
                    </label>

                    <label className="workspaceCheckoutField">
                      <span>Expiry</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={paymentForm.expiry}
                        onChange={(event) => setPaymentField('expiry', event.target.value)}
                        placeholder="MM/YY"
                        autoComplete="cc-exp"
                      />
                      <FieldError message={paymentErrors.expiry} />
                    </label>

                    <label className="workspaceCheckoutField">
                      <span>Security code</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={paymentForm.cvc}
                        onChange={(event) => setPaymentField('cvc', event.target.value)}
                        placeholder="CVC"
                        autoComplete="cc-csc"
                      />
                      <FieldError message={paymentErrors.cvc} />
                    </label>

                    <label className="workspaceCheckoutField fullWidth">
                      <span>Billing country</span>
                      <input
                        type="text"
                        value={paymentForm.billingCountry}
                        onChange={(event) => setPaymentField('billingCountry', event.target.value)}
                        placeholder="Azerbaijan"
                        autoComplete="country-name"
                      />
                      <FieldError message={paymentErrors.billingCountry} />
                    </label>

                    <label className="workspaceConsentRow fullWidth">
                      <input
                        type="checkbox"
                        checked={paymentForm.termsAccepted}
                        onChange={(event) => setPaymentField('termsAccepted', event.target.checked)}
                      />
                      <span>I confirm this secure checkout and allow the selected subscription charge.</span>
                    </label>
                    <FieldError message={paymentErrors.termsAccepted} />
                  </div>
                ) : (
                  <div className="workspaceCheckoutFreeState">
                    <BadgeCheck size={18} />
                    <div>
                      <strong>No payment is required for the free plan.</strong>
                      <p>You can activate the free package and publish 1 active job for 15 days.</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn primary interactive full workspaceCheckoutButton"
                  disabled={busyKey === 'checkout'}
                >
                  <CreditCard size={16} /> {checkoutLabel}
                </button>
              </form>

              {feedback ? <div className="profileFeedbackBanner">{feedback}</div> : null}
            </article>

            <aside className="workspacePanel cardLift workspaceCheckoutSidebar">
              <div className="workspacePanelHeader">
                <div>
                  <span className="profileEyebrow">Order summary</span>
                  <h2>{selectedPlan?.name || 'Starter'} checkout</h2>
                </div>
                <CheckCircle2 size={18} />
              </div>

              <div className="workspacePreviewCard workspaceCheckoutSummary">
                <div className="workspaceCheckoutTotal">
                  <span>Total due now</span>
                  <strong>${currentCharge.toFixed(2)}</strong>
                  <small>{billingPeriod === 'yearly' ? 'Annual charge' : 'Monthly charge'}</small>
                </div>

                <div className="workspacePreviewGrid">
                  <div>
                    <span>Selected plan</span>
                    <strong>{selectedPlan?.name || 'Starter'}</strong>
                  </div>
                  <div>
                    <span>Billing cycle</span>
                    <strong>{billingPeriod === 'yearly' ? 'Yearly' : 'Monthly'}</strong>
                  </div>
                  <div>
                    <span>Publishing limit</span>
                    <strong>
                      {(selectedPlan?.maxActivePublishedJobs === null || selectedPlan?.maxActivePublishedJobs === undefined)
                        ? 'Unlimited'
                        : selectedPlan.maxActivePublishedJobs}
                    </strong>
                  </div>
                  <div>
                    <span>Payment method</span>
                    <strong>{isPaidPlan ? maskedPreview : 'No payment required'}</strong>
                  </div>
                </div>

                <div className="workspaceSecurityList">
                  <div className="workspaceSecurityItem">
                    <LockKeyhole size={16} />
                    <span>Secure card validation before activation</span>
                  </div>
                  <div className="workspaceSecurityItem">
                    <ShieldCheck size={16} />
                    <span>Subscription receipt is recorded after checkout</span>
                  </div>
                </div>

                <button type="button" className="btn ghost interactive" onClick={() => navigate(ROUTES.wallet)}>
                  Open wallet activity
                </button>
              </div>

              {receipt ? (
                <div className="workspaceReceiptCard">
                  <div className="workspaceReceiptHeader">
                    <div>
                      <span className="profileEyebrow">Latest receipt</span>
                      <h3>Payment approved</h3>
                    </div>
                    <ReceiptText size={18} />
                  </div>

                  <div className="workspaceReceiptGrid">
                    <div>
                      <span>Receipt</span>
                      <strong>{receipt.receiptNumber || 'Generated'}</strong>
                    </div>
                    <div>
                      <span>Charged</span>
                      <strong>${Number(receipt.amountPaid || 0).toFixed(2)} {receipt.currency || 'USD'}</strong>
                    </div>
                    <div>
                      <span>Method</span>
                      <strong>{receipt.paymentMethod || 'Card'}</strong>
                    </div>
                    <div>
                      <span>Processed</span>
                      <strong>{receipt.processedAt ? new Date(receipt.processedAt).toLocaleString() : 'Just now'}</strong>
                    </div>
                  </div>
                </div>
              ) : null}
            </aside>
          </section>
        )}
      </main>
    </div>
  );
}
