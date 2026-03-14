function resolvePlanPrice(plan, billingPeriod) {
  return billingPeriod === 'monthly'
    ? plan.monthly ?? plan.monthlyPrice
    : plan.yearly ?? plan.yearlyPrice;
}

function resolveSavings(plan) {
  if (!plan.monthly || !plan.yearly) {
    return null;
  }

  const yearlyMonthEquivalent = plan.yearly / 12;
  const savings = Math.max(0, Math.round(((plan.monthly - yearlyMonthEquivalent) / plan.monthly) * 100));

  return savings ? `Save ${savings}% yearly` : null;
}

export default function PricingSection({ billingPeriod, onBillingChange, plans }) {
  return (
    <section className="section pricingSec" id="pricing">
      <div className="wrap">
        <p className="eyebrow centerText">Best plans to win</p>
        <h2 className="centerText">Tailored packages for every business stage and size</h2>
        <p className="lead centerLead">Choose a plan for sourcing, visibility and better project throughput.</p>
        <div className="billing">
          <button
            className={billingPeriod === 'monthly' ? 'bill active interactive' : 'bill interactive'}
            onClick={() => onBillingChange('monthly')}
          >
            Monthly
          </button>
          <button
            className={billingPeriod === 'yearly' ? 'bill active interactive' : 'bill interactive'}
            onClick={() => onBillingChange('yearly')}
          >
            Yearly
          </button>
        </div>
        <div className="grid planGrid">
          {plans.map((plan, index) => {
            const savings = resolveSavings(plan);
            const isFeatured = index === 1;

            return (
              <article key={plan.name} className={isFeatured ? 'card plan featured cardLift' : 'card plan cardLift'}>
                <div className="planHeaderRow">
                  <h3>{plan.name}</h3>
                  {savings && billingPeriod === 'yearly' ? <span className="planBadge">{savings}</span> : null}
                </div>
                <p>{plan.text || plan.description}</p>
                <div className="money">${resolvePlanPrice(plan, billingPeriod)}</div>
                <ul>
                  {(plan.features || []).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <a href="#cta" className={isFeatured ? 'btn primary full interactive' : 'btn soft full interactive'}>
                  Get Started
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
