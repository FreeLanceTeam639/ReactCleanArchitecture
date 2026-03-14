import { BriefcaseBusiness, CalendarClock, CircleDollarSign, LoaderCircle, Search, Sparkles } from 'lucide-react';
import { AUTHENTICATED_NAVIGATION_LINKS } from '../../shared/constants/navigationLinks.js';
import { ROUTES } from '../../shared/constants/routes.js';
import MarketplaceHeader from '../../shared/ui/MarketplaceHeader.jsx';
import { useOrdersPage } from '../../features/workspace/hooks/useOrdersPage.js';

function MetricCard({ label, value, icon: Icon }) {
  return (
    <article className="workspaceMetricCard cardLift">
      <div className="workspaceMetricIcon"><Icon size={18} /></div>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export default function OrdersPage({ navigate }) {
  const { items, summary, filters, setFilterValue, isLoading, error } = useOrdersPage(navigate);

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
            <span className="profileEyebrow">Delivery Hub</span>
            <h1>My Orders & Jobs</h1>
            <p>Order lifecycle, delivery stages və komanda ritmini tək axında idarə et.</p>
          </div>
          <div className="workspaceMetricsGrid">
            <MetricCard label="Active" value={summary?.active || 0} icon={BriefcaseBusiness} />
            <MetricCard label="In Review" value={summary?.review || 0} icon={CalendarClock} />
            <MetricCard label="Total Value" value={summary?.totalValue || '$0'} icon={CircleDollarSign} />
          </div>
        </section>

        <section className="workspacePanel cardLift">
          <div className="workspaceToolbar">
            <label className="talentSearchInput">
              <Search size={16} />
              <input
                value={filters.search}
                onChange={(event) => setFilterValue('search', event.target.value)}
                placeholder="Search jobs, clients, categories"
              />
            </label>
            <select className="talentSelect" value={filters.status} onChange={(event) => setFilterValue('status', event.target.value)}>
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
            <select className="talentSelect" value={filters.role} onChange={(event) => setFilterValue('role', event.target.value)}>
              <option value="all">All roles</option>
              <option value="freelancer">Freelancer</option>
              <option value="client">Client</option>
            </select>
            <select className="talentSelect" value={filters.sort} onChange={(event) => setFilterValue('sort', event.target.value)}>
              <option value="updated">Latest updates</option>
              <option value="deadline">Closest deadline</option>
              <option value="budget">Highest budget</option>
              <option value="progress">Highest progress</option>
            </select>
          </div>

          {isLoading ? (
            <div className="workspaceEmptyState"><LoaderCircle className="spinLoader" size={24} /> Loading orders...</div>
          ) : error ? (
            <div className="workspaceEmptyState">{error}</div>
          ) : items.length ? (
            <div className="workspaceCardGrid">
              {items.map((item) => (
                <article key={item.id} className="workspaceEntityCard cardLift fadeUp">
                  <div className="workspaceEntityTop">
                    <div>
                      <strong>{item.title}</strong>
                      <p>{item.role === 'client' ? item.freelancer : item.client} • {item.category}</p>
                    </div>
                    <span className={`workspaceBadge ${item.status}`}>{item.status}</span>
                  </div>
                  <div className="workspaceProgressTrack">
                    <span style={{ width: `${Math.min(100, Math.max(0, item.progress || 0))}%` }} />
                  </div>
                  <div className="workspaceEntityMeta">
                    <span>{item.progress}% complete</span>
                    <span>{item.budget}</span>
                    <span>Due {item.dueDate}</span>
                  </div>
                  <p className="workspaceMutedText">{item.lastUpdate}</p>
                  <div className="workspaceInlineActions">
                    <button type="button" className="profileActionButton interactive" onClick={() => navigate(ROUTES.messages)}>Open chat</button>
                    <button type="button" className="profileActionButton interactive" onClick={() => navigate(ROUTES.profile)}>Open profile view</button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="workspaceEmptyState"><Sparkles size={18} /> No orders match the selected query.</div>
          )}
        </section>
      </main>
    </div>
  );
}
