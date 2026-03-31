import { Eye, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminAuditLogsPage } from '../../features/admin/hooks/useAdminAuditLogsPage.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { getCurrentLocale } from '../../shared/i18n/locale.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import { AdminModal } from '../../shared/ui/admin/AdminModal.jsx';
import AdminActionIconButton from '../../shared/ui/admin/AdminActionIconButton.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import AdminToolbar from '../../shared/ui/admin/AdminToolbar.jsx';

function formatDateTime(value) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(getCurrentLocale(), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function formatDetails(value) {
  if (!value) {
    return 'No details recorded.';
  }

  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
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

function ActorCell({ item }) {
  return (
    <div className="adminAuditActor">
      <strong>{item.actorName || 'Unknown actor'}</strong>
      <span>{item.actorEmail || item.actorType}</span>
    </div>
  );
}

export default function AdminAuditLogsPage({ navigate, pathname = ROUTES.adminAuditLogs }) {
  const {
    search,
    setSearch,
    actorType,
    setActorType,
    category,
    setCategory,
    result,
    setResult,
    items,
    summary,
    categoryOptions,
    isLoading,
    error,
    feedback,
    refresh
  } = useAdminAuditLogsPage();

  const [selectedLog, setSelectedLog] = useState(null);

  const toolbarFilters = useMemo(
    () => [
      {
        key: 'actorType',
        label: 'Actor',
        value: actorType,
        onChange: setActorType,
        options: [
          { value: 'all', label: 'All actors' },
          { value: 'Admin', label: 'Admin' },
          { value: 'İstifadəçi', label: 'User' },
          { value: 'Anonim', label: 'Anonymous' }
        ]
      },
      {
        key: 'category',
        label: 'Section',
        value: category,
        onChange: setCategory,
        options: categoryOptions
      },
      {
        key: 'result',
        label: 'Result',
        value: result,
        onChange: setResult,
        options: [
          { value: 'all', label: 'All results' },
          { value: 'success', label: 'Successful' },
          { value: 'failed', label: 'Failed' }
        ]
      }
    ],
    [actorType, setActorType, category, setCategory, categoryOptions, result, setResult]
  );

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Audit Logs"
      description="Track admin and member actions with Azerbaijani backend audit messages, request context and result status."
      actions={(
        <button type="button" className="btn soft interactive" onClick={refresh}>
          <RefreshCw size={16} />
          Refresh
        </button>
      )}
    >
      {feedback ? <div className="adminNotice success">{feedback}</div> : null}
      {error ? <div className="adminNotice error">{error}</div> : null}

      <section className="adminStatsGrid sixCols">
        <SummaryCard label="Total Logs" value={summary.total} />
        <SummaryCard label="Successful" value={summary.successful} />
        <SummaryCard label="Failed" value={summary.failed} tone="danger" />
        <SummaryCard label="Admin Actions" value={summary.adminActions} tone="primary" />
        <SummaryCard label="User Actions" value={summary.userActions} />
        <SummaryCard label="Anonymous" value={summary.anonymous} />
      </section>

      <AdminToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by actor, path, section, message or action"
        filters={toolbarFilters}
      />

      <section className="adminPanelCard cardLift">
        <div className="adminPanelCardHeader">
          <div>
            <span className="adminPageEyebrow">Audit timeline</span>
            <h2>Latest Recorded Actions</h2>
          </div>
          <span className="adminPanelCount">{items.length} entries</span>
        </div>

        {isLoading ? (
          <div className="adminEmptyState compact">
            <strong>Audit logs loading...</strong>
            <p>Request activity timeline is being refreshed.</p>
          </div>
        ) : items.length ? (
          <div className="adminTableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Actor</th>
                  <th>Section</th>
                  <th>Action</th>
                  <th>Result</th>
                  <th>Status</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{formatDateTime(item.occurredAt)}</strong>
                      <span>{item.source || 'HTTP'}</span>
                    </td>
                    <td><ActorCell item={item} /></td>
                    <td>
                      <strong>{item.category}</strong>
                      <span>{item.httpMethod} {item.path || '-'}</span>
                    </td>
                    <td>
                      <strong>{item.actionName}</strong>
                      <span className="adminAuditMessage">{item.messageAz}</span>
                    </td>
                    <td>
                      <div className="adminAuditBadgeStack">
                        <AdminStatusBadge value={item.isSuccessful ? 'Successful' : 'Failed'} tone={item.isSuccessful ? '' : 'danger'} />
                        <AdminStatusBadge value={item.actorType} tone={item.actorType === 'Admin' ? 'primary' : item.actorType === 'Anonim' ? 'muted' : ''} />
                      </div>
                    </td>
                    <td>{item.statusCode || '-'}</td>
                    <td>
                      <div className="adminRowActions">
                        <AdminActionIconButton icon={Eye} label="View log details" onClick={() => setSelectedLog(item)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="adminEmptyState compact">
            <strong>No audit logs found</strong>
            <p>Try a broader search or wait until new backend activity is recorded.</p>
          </div>
        )}
      </section>

      {selectedLog ? (
        <AdminModal
          title="Audit log details"
          onClose={() => setSelectedLog(null)}
          wide
          footer={<button type="button" className="adminSecondaryButton interactive" onClick={() => setSelectedLog(null)}>Close</button>}
        >
          <div className="adminDetailHero compact">
            <div>
              <h4>{selectedLog.actionName}</h4>
              <p>{selectedLog.messageAz}</p>
              <div className="adminInlineBadges">
                <AdminStatusBadge value={selectedLog.isSuccessful ? 'Successful' : 'Failed'} tone={selectedLog.isSuccessful ? '' : 'danger'} />
                <AdminStatusBadge value={selectedLog.actorType} tone={selectedLog.actorType === 'Admin' ? 'primary' : selectedLog.actorType === 'Anonim' ? 'muted' : ''} />
                <AdminStatusBadge value={selectedLog.source || 'HTTP'} tone={selectedLog.source === 'WebSocket' ? 'primary' : 'muted'} />
              </div>
            </div>
          </div>

          <div className="adminDetailGrid wide">
            <div><span>Occurred at</span><strong>{formatDateTime(selectedLog.occurredAt)}</strong></div>
            <div><span>Status code</span><strong>{selectedLog.statusCode || '-'}</strong></div>
            <div><span>Category</span><strong>{selectedLog.category}</strong></div>
            <div><span>Actor name</span><strong>{selectedLog.actorName || '-'}</strong></div>
            <div><span>Actor email</span><strong>{selectedLog.actorEmail || '-'}</strong></div>
            <div><span>Roles</span><strong>{selectedLog.actorRoles || '-'}</strong></div>
            <div><span>Method</span><strong>{selectedLog.httpMethod || '-'}</strong></div>
            <div><span>Path</span><strong>{selectedLog.path || '-'}</strong></div>
            <div><span>Query string</span><strong>{selectedLog.queryString || '-'}</strong></div>
            <div><span>IP address</span><strong>{selectedLog.ipAddress || '-'}</strong></div>
            <div><span>Trace ID</span><strong>{selectedLog.traceId || '-'}</strong></div>
            <div><span>User agent</span><strong>{selectedLog.userAgent || '-'}</strong></div>
            <div className="fullSpan adminAuditJsonPanel">
              <span>Details JSON</span>
              <pre className="adminAuditJsonBlock">{formatDetails(selectedLog.detailsJson)}</pre>
            </div>
          </div>
        </AdminModal>
      ) : null}
    </AdminLayout>
  );
}
