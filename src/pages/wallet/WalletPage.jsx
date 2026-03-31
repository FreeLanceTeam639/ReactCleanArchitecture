import { ArrowDownToLine, ArrowUpRight, LoaderCircle, WalletCards } from 'lucide-react';
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
    withdrawalAmount,
    feedback,
    isLoading,
    busyKey,
    error,
    setWithdrawalAmount,
    setFilterValue,
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
                <option value="withdrawal">{t('Withdrawals')}</option>
                <option value="fee">{t('Fees')}</option>
              </select>
              <select className="talentSelect" value={filters.status} onChange={(event) => setFilterValue('status', event.target.value)}>
                <option value="all">{t('All statuses')}</option>
                <option value="completed">{t('Completed')}</option>
                <option value="processing">{t('Processing')}</option>
                <option value="pending">{t('Pending')}</option>
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
                        <p>{item.method}</p>
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

          <aside className="workspacePanel cardLift">
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
            {feedback ? <div className="profileFeedbackBanner">{t(feedback)}</div> : null}
          </aside>
        </section>
      </main>
    </div>
  );
}
