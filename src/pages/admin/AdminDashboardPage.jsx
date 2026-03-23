import { BriefcaseBusiness, FolderKanban, ImageIcon, Package2, Sparkles, Users } from 'lucide-react';
import { useAdminDashboardPage } from '../../features/admin/hooks/useAdminDashboardPage.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import { ROUTES } from '../../shared/constants/routes.js';
import { getCurrentLocale } from '../../shared/i18n/locale.js';

function formatDate(value) {
  return new Intl.DateTimeFormat(getCurrentLocale(), { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function DashboardStatCard({ icon: Icon, label, value, hint }) {
  return (
    <article className="adminStatCard cardLift">
      <div className="adminStatIcon">
        <Icon size={18} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <p>{hint}</p>
      </div>
    </article>
  );
}

export default function AdminDashboardPage({ navigate, pathname = ROUTES.admin }) {
  const { overview, isLoading, error } = useAdminDashboardPage();

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Dashboard"
      description="Marketplace content, media və əsas idarəetmə axınlarının qısa premium görünüşü."
    >
      {error ? <div className="adminNotice error">{error}</div> : null}

      <section className="adminStatsGrid sixCols">
        <DashboardStatCard icon={Users} label="Total Users" value={overview.totals.users} hint="Platformada qeydiyyatdan keçən hesablar" />
        <DashboardStatCard icon={Sparkles} label="Freelancers" value={overview.totals.freelancers} hint="Aktiv freelancer profilləri" />
        <DashboardStatCard icon={BriefcaseBusiness} label="Job Posts" value={overview.totals.jobs} hint="Saytda görünən və ya idarə olunan elanlar" />
        <DashboardStatCard icon={FolderKanban} label="Categories" value={overview.totals.activeCategories} hint="Hazırda aktiv kateqoriya sayı" />
        <DashboardStatCard icon={Package2} label="Featured Talent" value={overview.totals.featuredTalent || 0} hint="Önə çıxarılan freelancer kartları" />
        <DashboardStatCard icon={ImageIcon} label="Media Items" value={overview.totals.mediaItems || 0} hint="Task və listing şəkilləri" />
      </section>

      <section className="adminTwoColumnGrid">
        <article className="adminPanelCard cardLift">
          <div className="adminPanelCardHeader">
            <div>
              <span className="adminPageEyebrow">Recent jobs</span>
              <h2>Latest Job Activity</h2>
            </div>
            <span className="adminPanelCount">{overview.recentJobs.length} items</span>
          </div>

          {isLoading ? (
            <div className="adminEmptyState compact">
              <strong>Dashboard loading...</strong>
              <p>İdarəetmə göstəriciləri yüklənir.</p>
            </div>
          ) : overview.recentJobs.length ? (
            <div className="adminSimpleStack">
              {overview.recentJobs.map((job) => (
                <div key={job.id} className="adminSimpleRow elevated">
                  <div className="adminSimpleRowIdentity">
                    {job.coverImageUrl ? <img src={job.coverImageUrl} alt={job.title} className="adminListThumb" /> : <div className="adminListThumb placeholder">JOB</div>}
                    <div>
                      <strong>{job.title}</strong>
                      <p>{job.categoryName} • {job.ownerName}</p>
                    </div>
                  </div>
                  <div className="adminSimpleRowMeta">
                    <AdminStatusBadge value={job.status} />
                    <span>{formatDate(job.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="adminEmptyState compact">
              <strong>No recent jobs</strong>
              <p>Ən son job activity burada görünəcək.</p>
            </div>
          )}
        </article>

        <article className="adminPanelCard cardLift">
          <div className="adminPanelCardHeader">
            <div>
              <span className="adminPageEyebrow">Recent users</span>
              <h2>New Registrations</h2>
            </div>
            <span className="adminPanelCount">{overview.recentUsers.length} items</span>
          </div>

          {isLoading ? (
            <div className="adminEmptyState compact">
              <strong>Users loading...</strong>
              <p>Yeni qeydiyyatlar hazırlanır.</p>
            </div>
          ) : overview.recentUsers.length ? (
            <div className="adminSimpleStack">
              {overview.recentUsers.map((user) => (
                <div key={user.id} className="adminSimpleRow elevated">
                  <div className="adminSimpleRowIdentity">
                    {user.avatarUrl ? <img src={user.avatarUrl} alt={user.fullName} className="adminListThumb avatar" /> : <div className="adminListThumb avatar placeholder">{user.initials || 'US'}</div>}
                    <div>
                      <strong>{user.fullName}</strong>
                      <p>{user.email}</p>
                    </div>
                  </div>
                  <div className="adminSimpleRowMeta">
                    <AdminStatusBadge value={user.role} tone="primary" />
                    <AdminStatusBadge value={user.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="adminEmptyState compact">
              <strong>No recent users</strong>
              <p>Yeni hesablar burada görünəcək.</p>
            </div>
          )}
        </article>
      </section>
    </AdminLayout>
  );
}
