import { Eye, Pencil, ShieldBan, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminUsersPage } from '../../features/admin/hooks/useAdminUsersPage.js';
import { ROUTES } from '../../shared/constants/routes.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import { AdminConfirmDialog, AdminModal } from '../../shared/ui/admin/AdminModal.jsx';
import AdminPagination from '../../shared/ui/admin/AdminPagination.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import AdminToolbar from '../../shared/ui/admin/AdminToolbar.jsx';

function formatDate(value) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function buildUserFormState(user) {
  return {
    fullName: user?.fullName || '',
    email: user?.email || '',
    role: user?.role || 'client',
    status: user?.status || 'active'
  };
}

export default function AdminUsersPage({ navigate, pathname = ROUTES.adminUsers }) {
  const {
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    page,
    setPage,
    items,
    meta,
    isLoading,
    error,
    feedback,
    setFeedback,
    saveUser,
    toggleUserStatus,
    deleteUser
  } = useAdminUsersPage();

  const [viewUser, setViewUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formState, setFormState] = useState(buildUserFormState(null));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const toolbarFilters = useMemo(
    () => [
      {
        key: 'role',
        label: 'Role',
        value: role,
        onChange: setRole,
        options: [
          { value: 'all', label: 'All roles' },
          { value: 'client', label: 'Client' },
          { value: 'freelancer', label: 'Freelancer' }
        ]
      },
      {
        key: 'status',
        label: 'Status',
        value: status,
        onChange: setStatus,
        options: [
          { value: 'all', label: 'All statuses' },
          { value: 'active', label: 'Active' },
          { value: 'blocked', label: 'Blocked' }
        ]
      }
    ],
    [role, setRole, status, setStatus]
  );

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormState(buildUserFormState(user));
  };

  const handleSave = async () => {
    await saveUser(editingUser.id, formState);
    setEditingUser(null);
  };

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Users"
      description="Client və freelancer hesablarını sadə şəkildə idarə et."
    >
      {feedback ? <div className="adminNotice success">{feedback}</div> : null}
      {error ? <div className="adminNotice error">{error}</div> : null}

      <AdminToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email"
        filters={toolbarFilters}
      />

      <section className="adminPanelCard cardLift">
        <div className="adminPanelCardHeader">
          <div>
            <span className="adminPageEyebrow">Overview</span>
            <h2>User List</h2>
          </div>
          <span className="adminPanelCount">{meta.total} total</span>
        </div>

        {isLoading ? (
          <div className="adminEmptyState compact">
            <strong>Users loading...</strong>
            <p>Siyahı və filter nəticələri yenilənir.</p>
          </div>
        ) : items.length ? (
          <>
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((user) => (
                    <tr key={user.id}>
                      <td><strong>{user.fullName}</strong></td>
                      <td>{user.email}</td>
                      <td className="textCap">{user.role}</td>
                      <td><AdminStatusBadge value={user.status} /></td>
                      <td>{formatDate(user.registeredAt)}</td>
                      <td>
                        <div className="adminRowActions">
                          <button type="button" className="adminIconButton interactive" onClick={() => setViewUser(user)} aria-label="View user"><Eye size={16} /></button>
                          <button type="button" className="adminIconButton interactive" onClick={() => openEditModal(user)} aria-label="Edit user"><Pencil size={16} /></button>
                          <button type="button" className="adminIconButton interactive" onClick={() => setStatusTarget(user)} aria-label="Toggle user status"><ShieldBan size={16} /></button>
                          <button type="button" className="adminIconButton interactive danger" onClick={() => setDeleteTarget(user)} aria-label="Delete user"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination meta={meta} onPageChange={setPage} />
          </>
        ) : (
          <div className="adminEmptyState compact">
            <strong>No users found</strong>
            <p>Axtarış və filter parametrlərinə uyğun nəticə yoxdur.</p>
          </div>
        )}
      </section>

      {viewUser ? (
        <AdminModal title="User details" onClose={() => setViewUser(null)} footer={(
          <button type="button" className="btn soft interactive" onClick={() => setViewUser(null)}>Close</button>
        )}>
          <div className="adminDetailGrid">
            <div><span>Full Name</span><strong>{viewUser.fullName}</strong></div>
            <div><span>Email</span><strong>{viewUser.email}</strong></div>
            <div><span>Role</span><strong className="textCap">{viewUser.role}</strong></div>
            <div><span>Status</span><AdminStatusBadge value={viewUser.status} /></div>
            <div><span>Registered</span><strong>{formatDate(viewUser.registeredAt)}</strong></div>
            <div><span>User ID</span><strong>{viewUser.id}</strong></div>
          </div>
        </AdminModal>
      ) : null}

      {editingUser ? (
        <AdminModal
          title="Edit user"
          onClose={() => setEditingUser(null)}
          footer={(
            <>
              <button type="button" className="btn soft interactive" onClick={() => setEditingUser(null)}>Cancel</button>
              <button type="button" className="btn primary interactive" onClick={handleSave}>Save changes</button>
            </>
          )}
        >
          <div className="adminFormGrid">
            <label>
              <span>Full Name</span>
              <input value={formState.fullName} onChange={(event) => setFormState((current) => ({ ...current, fullName: event.target.value }))} />
            </label>
            <label>
              <span>Email</span>
              <input value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} />
            </label>
            <label>
              <span>Role</span>
              <select value={formState.role} onChange={(event) => setFormState((current) => ({ ...current, role: event.target.value }))}>
                <option value="client">Client</option>
                <option value="freelancer">Freelancer</option>
              </select>
            </label>
            <label>
              <span>Status</span>
              <select value={formState.status} onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))}>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </label>
          </div>
        </AdminModal>
      ) : null}

      {statusTarget ? (
        <AdminConfirmDialog
          title={statusTarget.status === 'blocked' ? 'Unblock user?' : 'Block user?'}
          description={`Status ${statusTarget.status === 'blocked' ? 'active' : 'blocked'} olaraq dəyişəcək.`}
          confirmLabel={statusTarget.status === 'blocked' ? 'Unblock' : 'Block'}
          onConfirm={async () => {
            await toggleUserStatus(statusTarget);
            setStatusTarget(null);
          }}
          onClose={() => setStatusTarget(null)}
          tone={statusTarget.status === 'blocked' ? 'primary' : 'danger'}
        />
      ) : null}

      {deleteTarget ? (
        <AdminConfirmDialog
          title="Delete user?"
          description="Bu əməliyyat user sətrini admin siyahısından siləcək."
          confirmLabel="Delete"
          onConfirm={async () => {
            await deleteUser(deleteTarget.id);
            setDeleteTarget(null);
            setFeedback('User silindi.');
          }}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
