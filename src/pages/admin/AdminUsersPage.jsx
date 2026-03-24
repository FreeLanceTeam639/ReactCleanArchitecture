import { Eye, Pencil, ShieldBan, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminUsersPage } from '../../features/admin/hooks/useAdminUsersPage.js';
import { ROUTES } from '../../shared/constants/routes.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import { AdminConfirmDialog, AdminModal } from '../../shared/ui/admin/AdminModal.jsx';
import AdminPagination from '../../shared/ui/admin/AdminPagination.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import AdminToolbar from '../../shared/ui/admin/AdminToolbar.jsx';
import AdminImageField from '../../shared/ui/admin/AdminImageField.jsx';
import AdminActionIconButton from '../../shared/ui/admin/AdminActionIconButton.jsx';
import { getCurrentLocale } from '../../shared/i18n/locale.js';

function formatDate(value) {
  return new Intl.DateTimeFormat(getCurrentLocale(), { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function buildUserFormState(user) {
  return {
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
    role: user?.role || 'member',
    status: user?.status || 'active',
    verificationStatus: user?.verificationStatus || 'unverified',
    phone: user?.phone || '',
    country: user?.country || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || ''
  };
}

function UserIdentity({ user }) {
  return (
    <div className="adminIdentityCell">
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt={user.fullName} className="adminAvatarImage" />
      ) : (
        <div className="adminAvatarPlaceholder">{user.initials || user.fullName?.slice(0, 2)?.toUpperCase()}</div>
      )}
      <div>
        <strong>{user.fullName}</strong>
        <span>@{user.username || 'user'}</span>
      </div>
    </div>
  );
}

export default function AdminUsersPage({ navigate, pathname = ROUTES.adminUsers }) {
  const {
    search,
    setSearch,
    role,
    setRole,
    status,
    setStatus,
    verificationStatus,
    setVerificationStatus,
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
        label: 'Account',
        value: role,
        onChange: setRole,
        options: [
          { value: 'all', label: 'All accounts' },
          { value: 'member', label: 'Member' },
          { value: 'admin', label: 'Admin' }
        ]
      },
      {
        key: 'verificationStatus',
        label: 'Verification',
        value: verificationStatus,
        onChange: setVerificationStatus,
        options: [
          { value: 'all', label: 'All statuses' },
          { value: 'verified', label: 'Verified' },
          { value: 'pending', label: 'Pending' },
          { value: 'rejected', label: 'Rejected' },
          { value: 'unverified', label: 'Unverified' }
        ]
      },
      {
        key: 'status',
        label: 'Access',
        value: status,
        onChange: setStatus,
        options: [
          { value: 'all', label: 'All access' },
          { value: 'active', label: 'Active' },
          { value: 'blocked', label: 'Blocked' }
        ]
      }
    ],
    [role, setRole, verificationStatus, setVerificationStatus, status, setStatus]
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
      description="Member accounts, verification state and access status in one clean directory."
    >
      {feedback ? <div className="adminNotice success">{feedback}</div> : null}
      {error ? <div className="adminNotice error">{error}</div> : null}

      <AdminToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email, username or country"
        filters={toolbarFilters}
      />

      <section className="adminPanelCard cardLift">
        <div className="adminPanelCardHeader">
          <div>
            <span className="adminPageEyebrow">Accounts</span>
            <h2>User Directory</h2>
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
                    <th>User</th>
                    <th>Email</th>
                    <th>Account</th>
                    <th>Verification</th>
                    <th>Access</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((user) => (
                    <tr key={user.id}>
                      <td><UserIdentity user={user} /></td>
                      <td>
                        <strong>{user.email}</strong>
                        {user.phone ? <span>{user.phone}</span> : null}
                      </td>
                      <td><AdminStatusBadge value={user.role} tone="primary" /></td>
                      <td><AdminStatusBadge value={user.verificationStatus || 'unverified'} /></td>
                      <td><AdminStatusBadge value={user.status} /></td>
                      <td>{formatDate(user.registeredAt)}</td>
                      <td>
                        <div className="adminRowActions">
                          <AdminActionIconButton icon={Eye} label="View user" onClick={() => setViewUser(user)} />
                          <AdminActionIconButton icon={Pencil} label="Edit user" onClick={() => openEditModal(user)} />
                          <AdminActionIconButton icon={ShieldBan} label="Toggle user status" onClick={() => setStatusTarget(user)} tone={user.status === 'blocked' ? 'primary' : 'warning'} />
                          <AdminActionIconButton icon={Trash2} label="Delete user" onClick={() => setDeleteTarget(user)} tone="danger" />
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
        <AdminModal
          title="User details"
          onClose={() => setViewUser(null)}
          wide
          footer={<button type="button" className="adminSecondaryButton interactive" onClick={() => setViewUser(null)}>Close</button>}
        >
          <div className="adminDetailHero">
            {viewUser.avatarUrl ? (
              <img src={viewUser.avatarUrl} alt={viewUser.fullName} className="adminDetailAvatar" />
            ) : (
              <div className="adminAvatarPlaceholder large">{viewUser.initials || viewUser.fullName?.slice(0, 2)?.toUpperCase()}</div>
            )}
            <div>
              <h4>{viewUser.fullName}</h4>
              <p>@{viewUser.username || 'user'} • {viewUser.email}</p>
              <div className="adminInlineBadges">
                <AdminStatusBadge value={viewUser.role} tone="primary" />
                <AdminStatusBadge value={viewUser.verificationStatus || 'unverified'} />
                <AdminStatusBadge value={viewUser.status} />
              </div>
            </div>
          </div>

          <div className="adminDetailGrid wide">
            <div><span>Phone</span><strong>{viewUser.phone || 'Not set'}</strong></div>
            <div><span>Country</span><strong>{viewUser.country || 'Not set'}</strong></div>
            <div><span>Registered</span><strong>{formatDate(viewUser.registeredAt)}</strong></div>
            <div><span>User ID</span><strong>{viewUser.id}</strong></div>
            <div><span>Can post jobs</span><strong>{viewUser.isVerified ? 'Yes' : 'No'}</strong></div>
            <div><span>Verification</span><strong>{viewUser.verificationStatus || 'unverified'}</strong></div>
            <div className="fullSpan"><span>Bio</span><strong>{viewUser.bio || 'No bio added yet.'}</strong></div>
          </div>
        </AdminModal>
      ) : null}

      {editingUser ? (
        <AdminModal
          title="Edit user"
          onClose={() => setEditingUser(null)}
          wide
          footer={(
            <>
              <button type="button" className="adminSecondaryButton interactive" onClick={() => setEditingUser(null)}>Cancel</button>
              <button type="button" className="btn primary interactive" onClick={handleSave}>Save changes</button>
            </>
          )}
        >
          <div className="adminFormStack">
            <AdminImageField
              label="Profile image"
              value={formState.avatarUrl}
              onChange={(value) => setFormState((current) => ({ ...current, avatarUrl: value }))}
              shape="circle"
              hint="Admin bu şəkli dəyişəndə gələcəkdə PATCH /api/admin/users/:id/avatar endpoint-inə bağlana bilər."
            />

            <div className="adminFormGrid wide">
              <label>
                <span>Full Name</span>
                <input value={formState.fullName} onChange={(event) => setFormState((current) => ({ ...current, fullName: event.target.value }))} />
              </label>
              <label>
                <span>Email</span>
                <input value={formState.email} onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))} />
              </label>
              <label>
                <span>Username</span>
                <input value={formState.username} onChange={(event) => setFormState((current) => ({ ...current, username: event.target.value }))} />
              </label>
              <label>
                <span>Phone</span>
                <input value={formState.phone} onChange={(event) => setFormState((current) => ({ ...current, phone: event.target.value }))} />
              </label>
              <label>
                <span>Country</span>
                <input value={formState.country} onChange={(event) => setFormState((current) => ({ ...current, country: event.target.value }))} />
              </label>
              <label>
                <span>Account type</span>
                <input value={formState.role} disabled />
              </label>
              <label>
                <span>Verification</span>
                <input value={formState.verificationStatus} disabled />
              </label>
              <label>
                <span>Access</span>
                <select value={formState.status} onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))}>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </label>
              <label className="fullSpan">
                <span>Bio</span>
                <textarea rows="4" value={formState.bio} onChange={(event) => setFormState((current) => ({ ...current, bio: event.target.value }))} />
              </label>
            </div>
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
