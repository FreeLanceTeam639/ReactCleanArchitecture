function resolvePlanPrice(plan, billingPeriod) {
  return billingPeriod === 'monthly'
    ? plan.monthly ?? plan.monthlyPrice
    : plan.yearly ?? plan.yearlyPrice;
}

export default function PricingSection({ billingPeriod, onBillingChange, plans }) {
  return (
    <section className="section pricingSec" id="pricing">
      <div className="wrap">
        <p className="eyebrow centerText">Best plans to win</p>
        <h2 className="centerText">Tailored packages for every business stage and size</h2>
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
          {plans.map((plan, index) => (
            <article key={plan.name} className={index === 1 ? 'card plan featured cardLift' : 'card plan cardLift'}>
              <h3>{plan.name}</h3>
              <p>{plan.text || plan.description}</p>
              <div className="money">${resolvePlanPrice(plan, billingPeriod)}</div>
              <ul>
                {(plan.features || []).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <a href="#cta" className={index === 1 ? 'btn primary full interactive' : 'btn soft full interactive'}>
                Get Started
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
