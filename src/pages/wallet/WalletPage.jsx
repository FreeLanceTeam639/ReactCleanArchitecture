import { ArrowDownToLine, ArrowUpRight, LoaderCircle, WalletCards } from 'lucide-react';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import { useWalletPage } from '../../features/workspace/hooks/useWalletPage.js';

export default function WalletPage({ navigate }) {
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
        actionButton={{ label: 'Post a Job', route: ROUTES.postTask }}
      />

      <main className="wrap workspacePage fadeUp">
        <section className="workspaceHero cardLift">
          <div>
            <span className="profileEyebrow">Finance Hub</span>
            <h1>Wallet & Transactions</h1>
            <p>Balance, payout və transaction tarixçəsi wallet service qatı üzərindən yüklənir.</p>
          </div>
          <div className="workspaceMetricsGrid">
            <article className="workspaceMetricCard cardLift"><span>Available</span><strong>{summary?.availableBalance || '$0'}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>Pending</span><strong>{summary?.pendingClearance || '$0'}</strong></article>
            <article className="workspaceMetricCard cardLift"><span>This month</span><strong>{summary?.thisMonthInflow || '$0'}</strong></article>
          </div>
        </section>

        <section className="workspaceSplitLayout singleTop">
          <article className="workspacePanel cardLift">
            <div className="workspaceToolbar compact">
              <select className="talentSelect" value={filters.type} onChange={(event) => setFilterValue('type', event.target.value)}>
                <option value="all">All transactions</option>
                <option value="income">Income</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="fee">Fees</option>
              </select>
              <select className="talentSelect" value={filters.status} onChange={(event) => setFilterValue('status', event.target.value)}>
                <option value="all">All statuses</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {isLoading ? (
              <div className="workspaceEmptyState"><LoaderCircle className="spinLoader" size={24} /> Loading transactions...</div>
            ) : error ? (
              <div className="workspaceEmptyState">{error}</div>
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
                      <span className={`workspaceBadge ${item.status}`}>{item.status}</span>
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
                <span className="profileEyebrow">Withdraw</span>
                <h2>Request payout</h2>
              </div>
              <WalletCards size={18} />
            </div>
            <form className="workspaceWithdrawForm" onSubmit={submitWithdrawal}>
              <label className="profileField fullWidth">
                <span>Amount</span>
                <input value={withdrawalAmount} onChange={(event) => setWithdrawalAmount(event.target.value)} placeholder="250" />
              </label>
              <button type="submit" className="btn primary interactive full" disabled={busyKey === 'withdrawal'}>
                {busyKey === 'withdrawal' ? 'Requesting...' : 'Request withdrawal'}
              </button>
            </form>
            {feedback ? <div className="profileFeedbackBanner">{feedback}</div> : null}
          </aside>
        </section>
      </main>
    </div>
  );
}
