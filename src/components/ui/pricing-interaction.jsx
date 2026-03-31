import NumberFlow from '@number-flow/react';
import React from 'react';

function resolvePrice(period, monthly, annual) {
  return period === 0 ? monthly : annual;
}

export function PricingInteraction({
  starterMonth,
  starterAnnual,
  proMonth,
  proAnnual,
  onPeriodChange,
  onPlanChange,
  starterLabel = 'Starter',
  proLabel = 'Pro',
  freeLabel = 'Free',
  starterBadge = 'Popular',
  freeCaption = '1 active job post with 15-day active duration.',
  starterMonthlyCaption = '5 active job posts with 30-day renewal cycle.',
  proMonthlyCaption = 'Unlimited active job posts with no renewal deadline.',
  monthlyPriceSuffix = '/month',
  yearlyPriceSuffix = '/year',
  monthlyLabel = 'Monthly',
  yearlyLabel = 'Yearly',
  actionLabel = 'Get Started',
  actionHref = '/login',
  onActionClick
}) {
  const [active, setActive] = React.useState(1);
  const [period, setPeriod] = React.useState(0);
  const [starter, setStarter] = React.useState(starterMonth);
  const [pro, setPro] = React.useState(proMonth);
  const actionLockRef = React.useRef(false);

  React.useEffect(() => {
    setStarter(resolvePrice(period, starterMonth, starterAnnual));
    setPro(resolvePrice(period, proMonth, proAnnual));
  }, [period, starterAnnual, starterMonth, proAnnual, proMonth]);

  const isYearly = period === 1;
  const priceSuffix = isYearly ? yearlyPriceSuffix : monthlyPriceSuffix;

  const handleChangePlan = (index) => {
    setActive(index);
    onPlanChange?.(index);
  };

  const handleChangePeriod = (index) => {
    setPeriod(index);
    onPeriodChange?.(index);
  };

  const executeAction = React.useCallback(() => {
    if (actionLockRef.current) {
      return;
    }

    actionLockRef.current = true;
    onActionClick?.({ planIndex: active, periodIndex: period });

    window.setTimeout(() => {
      actionLockRef.current = false;
    }, 250);
  }, [active, onActionClick, period]);

  return (
    <div className="pricingInteractionCard">
      <div className="pricingInteractionToggle">
        <button
          type="button"
          className={period === 0 ? 'pricingInteractionToggleButton isActive' : 'pricingInteractionToggleButton'}
          onClick={() => handleChangePeriod(0)}
        >
          {monthlyLabel}
        </button>
        <button
          type="button"
          className={period === 1 ? 'pricingInteractionToggleButton isActive' : 'pricingInteractionToggleButton'}
          onClick={() => handleChangePeriod(1)}
        >
          {yearlyLabel}
        </button>
        <div
          className="pricingInteractionToggleRail"
          style={{
            transform: `translateX(${period * 100}%)`
          }}
        />
      </div>

      <div className="pricingInteractionPlans">
        <button
          type="button"
          className={active === 0 ? 'pricingInteractionPlan isSelected' : 'pricingInteractionPlan'}
          onClick={() => handleChangePlan(0)}
        >
          <div className="pricingInteractionPlanCopy">
            <p className="pricingInteractionPlanTitle">{freeLabel}</p>
            <p className="pricingInteractionPlanPrice">
              <span>$0.00</span>
              <span className="pricingInteractionPlanSuffix">{priceSuffix}</span>
            </p>
            <p className="pricingInteractionPlanMeta">{freeCaption}</p>
          </div>
          <span className={active === 0 ? 'pricingInteractionRadio isChecked' : 'pricingInteractionRadio'}>
            <span className="pricingInteractionRadioDot" />
          </span>
        </button>

        <button
          type="button"
          className={active === 1 ? 'pricingInteractionPlan isSelected' : 'pricingInteractionPlan'}
          onClick={() => handleChangePlan(1)}
        >
          <div className="pricingInteractionPlanCopy">
            <p className="pricingInteractionPlanTitle">
              {starterLabel}
              <span className="pricingInteractionBadge">{starterBadge}</span>
            </p>
            <p className="pricingInteractionPlanPrice">
              <span>$<NumberFlow value={starter} /></span>
              <span className="pricingInteractionPlanSuffix">{priceSuffix}</span>
            </p>
            <p className="pricingInteractionPlanMeta">
              {starterMonthlyCaption}
            </p>
          </div>
          <span className={active === 1 ? 'pricingInteractionRadio isChecked' : 'pricingInteractionRadio'}>
            <span className="pricingInteractionRadioDot" />
          </span>
        </button>

        <button
          type="button"
          className={active === 2 ? 'pricingInteractionPlan isSelected' : 'pricingInteractionPlan'}
          onClick={() => handleChangePlan(2)}
        >
          <div className="pricingInteractionPlanCopy">
            <p className="pricingInteractionPlanTitle">{proLabel}</p>
            <p className="pricingInteractionPlanPrice">
              <span>$<NumberFlow value={pro} /></span>
              <span className="pricingInteractionPlanSuffix">{priceSuffix}</span>
            </p>
            <p className="pricingInteractionPlanMeta">
              {proMonthlyCaption}
            </p>
          </div>
          <span className={active === 2 ? 'pricingInteractionRadio isChecked' : 'pricingInteractionRadio'}>
            <span className="pricingInteractionRadioDot" />
          </span>
        </button>
      </div>

      <a
        href={actionHref}
        role="button"
        className="pricingInteractionAction"
        onPointerDown={executeAction}
        onClick={executeAction}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            executeAction();
          }
        }}
      >
        {actionLabel}
      </a>
    </div>
  );
}
