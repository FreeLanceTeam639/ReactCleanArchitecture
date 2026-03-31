import { Eye, ShieldBan, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminVerificationPage } from '../../features/admin/hooks/useAdminVerificationPage.js';
import { ROUTES } from '../../shared/constants/routes.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import { AdminModal } from '../../shared/ui/admin/AdminModal.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import AdminToolbar from '../../shared/ui/admin/AdminToolbar.jsx';
import AdminActionIconButton from '../../shared/ui/admin/AdminActionIconButton.jsx';
import { getCurrentLocale } from '../../shared/i18n/locale.js';

function formatDate(value) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(getCurrentLocale(), { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function SummaryCard({ label, value, tone = '' }) {
  const className = tone ? `adminStatCard cardLift ${tone}` : 'adminStatCard cardLift';

  return (
    <article className={className}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

export default function AdminVerificationPage({ navigate, pathname = ROUTES.adminVerification }) {
  const {
    search,
    setSearch,
    status,
    setStatus,
    items,
    summary,
    isLoading,
    error,
    feedback,
    reviewTicket
  } = useAdminVerificationPage();

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [adminNote, setAdminNote] = useState('');

  const toolbarFilters = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        value: status,
        onChange: setStatus,
        options: [
          { value: 'all', label: 'All tickets' },
          { value: 'pending', label: 'Pending' },
          { value: 'approved', label: 'Approved' },
          { value: 'rejected', label: 'Rejected' }
        ]
      }
    ],
    [status, setStatus]
  );

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Verification"
      description="Review member verification tickets and unlock job posting for approved accounts."
    >
      {feedback ? <div className="adminNotice success">{feedback}</div> : null}
      {error ? <div className="adminNotice error">{error}</div> : null}

      <section className="adminStatsGrid">
        <SummaryCard label="Total Tickets" value={summary.total} />
        <SummaryCard label="Pending" value={summary.pending} />
        <SummaryCard label="Approved" value={summary.approved} />
        <SummaryCard label="Rejected" value={summary.rejected} />
      </section>

      <AdminToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by user, email, subject or message"
        filters={toolbarFilters}
      />

      <section className="adminPanelCard cardLift">
        <div className="adminPanelCardHeader">
          <div>
            <span className="adminPageEyebrow">Verification queue</span>
            <h2>Submitted Tickets</h2>
          </div>
          <span className="adminPanelCount">{items.length} items</span>
        </div>

        {isLoading ? (
          <div className="adminEmptyState compact">
            <strong>Tickets loading...</strong>
            <p>Verification review queue is refreshing.</p>
          </div>
        ) : items.length ? (
          <div className="adminTableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Reviewed</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>
                      <strong>{ticket.fullName}</strong>
                      <span>{ticket.email}</span>
                    </td>
                    <td>
                      <strong>{ticket.subject}</strong>
                      <span>{ticket.message}</span>
                    </td>
                    <td><AdminStatusBadge value={ticket.status} /></td>
                    <td>{formatDate(ticket.createdAt)}</td>
                    <td>{formatDate(ticket.reviewedAt)}</td>
                    <td>
                      <div className="adminRowActions">
                        <AdminActionIconButton icon={Eye} label="View ticket" onClick={() => setSelectedTicket(ticket)} />
                        <AdminActionIconButton icon={ShieldCheck} label="Approve ticket" onClick={() => {
                          setReviewTarget({ ticket, status: 'Approved' });
                          setAdminNote(ticket.adminNote || '');
                        }} tone="primary" disabled={ticket.status === 'approved'} />
                        <AdminActionIconButton icon={ShieldBan} label="Reject ticket" onClick={() => {
                          setReviewTarget({ ticket, status: 'Rejected' });
                          setAdminNote(ticket.adminNote || '');
                        }} tone="danger" disabled={ticket.status === 'rejected'} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="adminEmptyState compact">
            <strong>No tickets found</strong>
            <p>Verification requests matching the current filter will appear here.</p>
          </div>
        )}
      </section>

      {selectedTicket ? (
        <AdminModal
          title="Verification ticket"
          onClose={() => setSelectedTicket(null)}
          wide
          footer={<button type="button" className="adminSecondaryButton interactive" onClick={() => setSelectedTicket(null)}>Close</button>}
        >
          <div className="adminDetailGrid wide">
            <div><span>User</span><strong>{selectedTicket.fullName}</strong></div>
            <div><span>Email</span><strong>{selectedTicket.email}</strong></div>
            <div><span>Status</span><strong>{selectedTicket.status}</strong></div>
            <div><span>Created</span><strong>{formatDate(selectedTicket.createdAt)}</strong></div>
            <div className="fullSpan"><span>Subject</span><strong>{selectedTicket.subject}</strong></div>
            <div className="fullSpan"><span>Message</span><strong>{selectedTicket.message}</strong></div>
            <div className="fullSpan"><span>Portfolio</span><strong>{selectedTicket.portfolioUrl || 'Not provided'}</strong></div>
            <div className="fullSpan"><span>Admin note</span><strong>{selectedTicket.adminNote || 'No review note yet.'}</strong></div>
          </div>
        </AdminModal>
      ) : null}

      {reviewTarget ? (
        <AdminModal
          title={`${reviewTarget.status} ticket`}
          onClose={() => setReviewTarget(null)}
          footer={(
            <>
              <button type="button" className="btn soft interactive" onClick={() => setReviewTarget(null)}>
                Cancel
              </button>
              <button
                type="button"
                className={`btn ${reviewTarget.status === 'Approved' ? 'primary' : 'danger'} interactive`}
                onClick={async () => {
                  const updatedTicket = await reviewTicket(reviewTarget.ticket.id, {
                    status: reviewTarget.status,
                    adminNote
                  });

                  if (updatedTicket) {
                    setReviewTarget(null);
                    setAdminNote('');
                  }
                }}
              >
                Confirm {reviewTarget.status}
              </button>
            </>
          )}
        >
          <p className="adminModalCopy">
            {reviewTarget.status === 'Approved'
              ? 'This member will immediately unlock job posting access.'
              : 'This member will stay blocked from job posting until they submit another ticket.'}
          </p>
          <label className="adminFilterField" style={{ width: '100%', marginTop: '1rem' }}>
            <span>Admin note</span>
            <textarea
              rows="4"
              value={adminNote}
              onChange={(event) => setAdminNote(event.target.value)}
              placeholder="Optional internal or user-facing review note"
            />
          </label>
        </AdminModal>
      ) : null}
    </AdminLayout>
  );
}
