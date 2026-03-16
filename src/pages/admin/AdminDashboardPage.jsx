import { BriefcaseBusiness, FolderKanban, Sparkles, Users } from 'lucide-react';
import { useAdminDashboardPage } from '../../features/admin/hooks/useAdminDashboardPage.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import { ROUTES } from '../../shared/constants/routes.js';

function formatDate(value) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
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
      description="Marketplace activity üçün qısa ümumi görüntü."
    >
      {error ? <div className="adminNotice error">{error}</div> : null}

      <section className="adminStatsGrid">
        <DashboardStatCard icon={Users} label="Total Users" value={overview.totals.users} hint="Platformda qeydiyyatdan keçən hesablar" />
        <DashboardStatCard icon={Sparkles} label="Total Freelancers" value={overview.totals.freelancers} hint="Aktiv freelancer profilləri" />
        <DashboardStatCard icon={BriefcaseBusiness} label="Job Posts" value={overview.totals.jobs} hint="Saytda görünən və ya idarə olunan elanlar" />
        <DashboardStatCard icon={FolderKanban} label="Active Categories" value={overview.totals.activeCategories} hint="Hazırda aktiv kateqoriya sayı" />
      </section>

      <section className="adminTwoColumnGrid">
        <article className="adminPanelCard cardLift">
          <div className="adminPanelCardHeader">
            <div>
              <span className="adminPageEyebrow">Latest</span>
              <h2>Recent Jobs</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="adminEmptyState compact">
              <strong>Dashboard loading...</strong>
              <p>Son job siyahısı hazırlanır.</p>
            </div>
          ) : overview.recentJobs.length ? (
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recentJobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <strong>{job.title}</strong>
                        <span>{job.categoryName}</span>
                      </td>
                      <td>{job.ownerName}</td>
                      <td>
                        <AdminStatusBadge value={job.status} />
                      </td>
                      <td>{formatDate(job.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="adminEmptyState compact">
              <strong>No recent jobs</strong>
              <p>Yeni elan yaradılanda burada görünəcək.</p>
            </div>
          )}
        </article>

        <article className="adminPanelCard cardLift">
          <div className="adminPanelCardHeader">
            <div>
              <span className="adminPageEyebrow">Latest</span>
              <h2>Recent Users</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="adminEmptyState compact">
              <strong>Loading users...</strong>
              <p>Son qeydiyyat olan istifadəçilər yoxlanılır.</p>
            </div>
          ) : overview.recentUsers.length ? (
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <strong>{user.fullName}</strong>
                        <span>{user.email}</span>
                      </td>
                      <td className="textCap">{user.role}</td>
                      <td>
                        <AdminStatusBadge value={user.status} />
                      </td>
                      <td>{formatDate(user.registeredAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="adminEmptyState compact">
              <strong>No recent users</strong>
              <p>Yeni user-lər qeydiyyatdan keçəndə burada görünəcək.</p>
            </div>
          )}
        </article>
      </section>
    </AdminLayout>
  );
}
