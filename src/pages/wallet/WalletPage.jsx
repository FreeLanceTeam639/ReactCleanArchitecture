import { ArrowDownToLine, ArrowUpRight, CreditCard, LoaderCircle, WalletCards } from 'lucide-react';
import { useWalletPage } from '../../features/workspace/hooks/useWalletPage.js';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { useI18n } from '../../shared/i18n/I18nProvider.jsx';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';

export default function WalletPage({ navigate }) {
  const { t } = useI18n();
  const {
    filters,
    summary,
    transactions,
    topUpForm,
    topUpErrors,
    withdrawalAmount,
    feedback,
    isLoading,
    busyKey,
    error,
    setTopUpField,
    setWithdrawalAmount,
    setFilterValue,
    submitTopUp,
    submitWithdrawal
  } = useWalletPage(navigate);

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
            <span className="profileEyebrow">{t('Finance Hub')}</span>
            <h1>{t('Wallet & Transactions')}</h1>
            <p>{t('Balance, payout and transaction history are loaded through the wallet service layer.')}</p>
          </div>
          <div className="workspaceMetricsGrid">
            <article className="workspaceMetricCard cardLift"><span>{t('Available')}</span><strong>{summary?.availableBalance || '$0'}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>{t('Pending')}</span><strong>{summary?.pendingClearance || '$0'}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>{t('This month')}</span><strong>{summary?.thisMonthInflow || '$0'}</strong></article>
          </div>
        </section>

        <section className="workspaceSplitLayout singleTop">
          <article className="workspacePanel cardLift">
            <div className="workspaceToolbar compact">
              <select className="talentSelect" value={filters.type} onChange={(event) => setFilterValue('type', event.target.value)}>
                <option value="all">{t('All transactions')}</option>
                <option value="income">{t('Income')}</option>
                <option value="topup">{t('Top-ups')}</option>
                <option value="withdrawal">{t('Withdrawals')}</option>
                <option value="fee">{t('Fees')}</option>
              </select>
              <select className="talentSelect" value={filters.status} onChange={(event) => setFilterValue('status', event.target.value)}>
                <option value="all">{t('All statuses')}</option>
                <option value="completed">{t('Completed')}</option>
                <option value="processing">{t('Processing')}</option>
                <option value="pending">{t('Pending')}</option>
                <option value="failed">{t('Failed')}</option>
                <option value="canceled">{t('Canceled')}</option>
              </select>
            </div>

            {isLoading ? (
              <div className="workspaceEmptyState">
                <LoaderCircle className="spinLoader" size={24} /> {t('Loading transactions...')}
              </div>
            ) : error ? (
              <div className="workspaceEmptyState">{t(error)}</div>
            ) : (
              <div className="workspaceListStack">
                {transactions.map((item) => (
                  <article key={item.id} className="workspaceListCard">
                    <div className="workspaceListCardMain">
                      <div className="workspaceListCardIcon">
                        {item.type === 'income' ? <ArrowDownToLine size={16} /> : <ArrowUpRight size={16} />}
                      </div>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{[item.method, item.provider, item.reference].filter(Boolean).join(' • ')}</p>
                      </div>
                    </div>
                    <div className="workspaceListCardSide">
                      <strong>{item.amount}</strong>
                      <span className={`workspaceBadge ${item.status}`}>{t(item.status)}</span>
                      <small>{item.createdAt}</small>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </article>

          <aside className="workspaceSidebarStack">
            <article className="workspacePanel cardLift">
              <div className="workspacePanelHeader">
                <div>
                  <span className="profileEyebrow">{t('Balance top-up')}</span>
                  <h2>{t('Add funds by card')}</h2>
                </div>
                <CreditCard size={18} />
              </div>
              <form className="workspaceWithdrawForm" onSubmit={submitTopUp}>
                <div className="workspaceForm">
                  <label className="workspaceCheckoutField">
                    <span>{t('Amount')}</span>
                    <input
                      value={topUpForm.amount}
                      onChange={(event) => setTopUpField('amount', event.target.value)}
                      placeholder={t('25')}
                    />
                    {topUpErrors.amount ? <small className="workspaceFieldError">{t(topUpErrors.amount)}</small> : null}
                  </label>
                  <label className="workspaceCheckoutField">
                    <span>{t('Currency')}</span>
                    <input
                      value={topUpForm.currency}
                      onChange={(event) => setTopUpField('currency', event.target.value.toUpperCase())}
                      placeholder="USD"
                    />
                  </label>
                  <label className="workspaceCheckoutField fullWidth">
                    <span>{t('Cardholder name')}</span>
                    <input
                      value={topUpForm.cardholderName}
                      onChange={(event) => setTopUpField('cardholderName', event.target.value)}
                      placeholder={t('Full name')}
                    />
                    {topUpErrors.cardholderName ? <small className="workspaceFieldError">{t(topUpErrors.cardholderName)}</small> : null}
                  </label>
                  <label className="workspaceCheckoutField">
                    <span>{t('Billing email')}</span>
                    <input
                      value={topUpForm.billingEmail}
                      onChange={(event) => setTopUpField('billingEmail', event.target.value)}
                      placeholder="name@email.com"
                    />
                    {topUpErrors.billingEmail ? <small className="workspaceFieldError">{t(topUpErrors.billingEmail)}</small> : null}
                  </label>
                  <label className="workspaceCheckoutField">
                    <span>{t('Country')}</span>
                    <input
                      value={topUpForm.billingCountry}
                      onChange={(event) => setTopUpField('billingCountry', event.target.value)}
                      placeholder={t('Azerbaijan')}
                    />
                    {topUpErrors.billingCountry ? <small className="workspaceFieldError">{t(topUpErrors.billingCountry)}</small> : null}
                  </label>
                  <label className="workspaceCheckoutField fullWidth">
                    <span>{t('Card number')}</span>
                    <input
                      value={topUpForm.cardNumber}
                      onChange={(event) => setTopUpField('cardNumber', event.target.value)}
                      placeholder="4242 4242 4242 4242"
                    />
                    {topUpErrors.cardNumber ? <small className="workspaceFieldError">{t(topUpErrors.cardNumber)}</small> : null}
                  </label>
                  <label className="workspaceCheckoutField">
                    <span>{t('Expiry')}</span>
                    <input
                      value={topUpForm.expiry}
                      onChange={(event) => setTopUpField('expiry', event.target.value)}
                      placeholder="MM/YY"
                    />
                    {topUpErrors.expiry ? <small className="workspaceFieldError">{t(topUpErrors.expiry)}</small> : null}
                  </label>
                  <label className="workspaceCheckoutField">
                    <span>{t('CVC')}</span>
                    <input
                      value={topUpForm.cvc}
                      onChange={(event) => setTopUpField('cvc', event.target.value)}
                      placeholder="123"
                    />
                    {topUpErrors.cvc ? <small className="workspaceFieldError">{t(topUpErrors.cvc)}</small> : null}
                  </label>
                  <label className="workspaceConsentRow fullWidth">
                    <input
                      type="checkbox"
                      checked={topUpForm.termsAccepted}
                      onChange={(event) => setTopUpField('termsAccepted', event.target.checked)}
                    />
                    <span>{t('I confirm this card payment and accept the wallet top-up terms.')}</span>
                  </label>
                  {topUpErrors.termsAccepted ? <small className="workspaceFieldError">{t(topUpErrors.termsAccepted)}</small> : null}
                </div>
                <button type="submit" className="btn primary interactive full" disabled={busyKey === 'topup'}>
                  {busyKey === 'topup' ? t('Processing...') : t('Add funds')}
                </button>
              </form>
            </article>

            <article className="workspacePanel cardLift">
              <div className="workspacePanelHeader">
                <div>
                  <span className="profileEyebrow">{t('Withdraw')}</span>
                  <h2>{t('Request payout')}</h2>
                </div>
                <WalletCards size={18} />
              </div>
              <form className="workspaceWithdrawForm" onSubmit={submitWithdrawal}>
                <label className="profileField fullWidth">
                  <span>{t('Amount')}</span>
                  <input
                    value={withdrawalAmount}
                    onChange={(event) => setWithdrawalAmount(event.target.value)}
                    placeholder={t('Enter amount')}
                  />
                </label>
                <button type="submit" className="btn primary interactive full" disabled={busyKey === 'withdrawal'}>
                  {busyKey === 'withdrawal' ? t('Requesting...') : t('Request withdrawal')}
                </button>
              </form>
            </article>

            {feedback ? <div className="profileFeedbackBanner">{t(feedback)}</div> : null}
          </aside>
        </section>
      </main>
    </div>
  );
}
