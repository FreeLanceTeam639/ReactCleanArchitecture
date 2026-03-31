import { BriefcaseBusiness, Eye, KeyRound, LoaderCircle, Pencil, ShieldBan, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAdminUsersPage } from '../../features/admin/hooks/useAdminUsersPage.js';
import { ROUTES } from '../../shared/constants/routes.js';
import { useCountryDirectory } from '../../shared/hooks/useCountryDirectory.js';
import { syncPhoneNumberToCountry } from '../../shared/lib/forms/countryPhone.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import { AdminConfirmDialog, AdminModal } from '../../shared/ui/admin/AdminModal.jsx';
import AdminPagination from '../../shared/ui/admin/AdminPagination.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import AdminToolbar from '../../shared/ui/admin/AdminToolbar.jsx';
import AdminImageField from '../../shared/ui/admin/AdminImageField.jsx';
import AdminActionIconButton from '../../shared/ui/admin/AdminActionIconButton.jsx';
import CountrySelect from '../../shared/ui/CountrySelect.jsx';
import PhoneNumberField from '../../shared/ui/PhoneNumberField.jsx';
import { getCurrentLocale } from '../../shared/i18n/locale.js';

const initialPasswordState = {
  newPassword: '',
  confirmPassword: ''
};

function formatDate(value) {
  if (!value) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat(getCurrentLocale(), { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function formatDateTime(value) {
  if (!value) {
    return 'Not set';
  }

  return new Intl.DateTimeFormat(getCurrentLocale(), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(value));
}

function buildUserFormState(user) {
  return {
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
    role: user?.role || 'client',
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

function UserTaskCard({ task }) {
  return (
    <article className="adminUserTaskCard">
      {task.coverImageUrl ? (
        <img src={task.coverImageUrl} alt={task.title} className="adminUserTaskCover" />
      ) : (
        <div className="adminUserTaskCover placeholder">TASK</div>
      )}

      <div className="adminUserTaskBody">
        <div className="adminUserTaskHeader">
          <strong>{task.title}</strong>
          <span>${task.budget}</span>
        </div>

        <p className="adminUserTaskMeta">{task.categoryName} • {formatDate(task.createdAt)}</p>

        <div className="adminInlineBadges">
          <AdminStatusBadge value={task.status} />
          <AdminStatusBadge value={task.visibility} tone={task.visibility} />
        </div>

        <p>{task.description || 'No task description added yet.'}</p>
      </div>
    </article>
  );
}

export default function AdminUsersPage({ navigate, pathname = ROUTES.adminUsers }) {
  const { countries, isLoading: isCountriesLoading, defaultCountry } = useCountryDirectory();
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
    getUserById,
    saveUser,
    changeUserPassword,
    toggleUserStatus,
    deleteUser
  } = useAdminUsersPage();

  const [viewUser, setViewUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formState, setFormState] = useState(buildUserFormState(null));
  const [passwordState, setPasswordState] = useState(initialPasswordState);
  const [passwordFeedback, setPasswordFeedback] = useState({ type: '', message: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [detailError, setDetailError] = useState('');
  const [isOpeningDetail, setIsOpeningDetail] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    if (editingUser && !formState.country && defaultCountry?.name) {
      setFormState((currentState) => ({
        ...currentState,
        country: defaultCountry.name
      }));
    }
  }, [defaultCountry, editingUser, formState.country]);

  const toolbarFilters = useMemo(
    () => [
      {
        key: 'role',
        label: 'Account',
        value: role,
        onChange: setRole,
        options: [
          { value: 'all', label: 'All accounts' },
          { value: 'client', label: 'Client' },
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

  const openViewModal = async (userId) => {
    setDetailError('');
    setIsOpeningDetail(true);

    try {
      const detail = await getUserById(userId);
      setViewUser(detail);
    } catch (nextError) {
      setDetailError(nextError.message || 'User details could not be loaded.');
    } finally {
      setIsOpeningDetail(false);
    }
  };

  const openEditModal = async (userId) => {
    setDetailError('');
    setIsOpeningDetail(true);
    setPasswordFeedback({ type: '', message: '' });
    setPasswordState(initialPasswordState);

    try {
      const detail = await getUserById(userId);
      setEditingUser(detail);
      setFormState(buildUserFormState(detail));
    } catch (nextError) {
      setDetailError(nextError.message || 'User details could not be loaded.');
    } finally {
      setIsOpeningDetail(false);
    }
  };

  const handleSave = async () => {
    const updatedUser = await saveUser(editingUser.id, formState);

    if (!updatedUser) {
      return;
    }

    setEditingUser(null);
  };

  const handlePasswordReset = async () => {
    if (!editingUser) {
      return;
    }

    setIsResettingPassword(true);
    setPasswordFeedback({ type: '', message: '' });

    try {
      await changeUserPassword(editingUser.id, passwordState);
      setPasswordFeedback({
        type: 'success',
        message: 'User password was reset successfully.'
      });
      setPasswordState(initialPasswordState);
    } catch (nextError) {
      setPasswordFeedback({
        type: 'error',
        message: nextError.message || 'Password reset failed.'
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Users"
      description="Client accounts, verification, access and security controls in one professional directory."
    >
      {feedback ? <div className="adminNotice success">{feedback}</div> : null}
      {error ? <div className="adminNotice error">{error}</div> : null}
      {detailError ? <div className="adminNotice error">{detailError}</div> : null}
      {isOpeningDetail ? (
        <div className="adminNotice success adminInlineNotice">
          <LoaderCircle size={16} className="spinLoader" />
          Loading user details...
        </div>
      ) : null}

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
            <p>Account list and filter results are updating.</p>
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
                          <AdminActionIconButton icon={Eye} label="View user" onClick={() => openViewModal(user.id)} />
                          <AdminActionIconButton icon={Pencil} label="Edit user" onClick={() => openEditModal(user.id)} />
                          <AdminActionIconButton
                            icon={ShieldBan}
                            label="Toggle user status"
                            onClick={() => setStatusTarget(user)}
                            tone={user.status === 'blocked' ? 'primary' : 'warning'}
                          />
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
            <p>No account matches the current search and filter combination.</p>
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
            <div><span>Last update</span><strong>{formatDateTime(viewUser.updatedAt)}</strong></div>
            <div><span>User ID</span><strong>{viewUser.id}</strong></div>
            <div><span>Can post jobs</span><strong>{viewUser.canPostJobs ? 'Yes' : 'No'}</strong></div>
            <div><span>Admin access</span><strong>{viewUser.hasAdminAccess ? 'Yes' : 'No'}</strong></div>
            <div><span>Verification requested</span><strong>{formatDateTime(viewUser.verificationRequestedAt)}</strong></div>
            <div><span>Verification reviewed</span><strong>{formatDateTime(viewUser.verificationReviewedAt)}</strong></div>
            <div className="fullSpan"><span>Bio</span><strong>{viewUser.bio || 'No bio added yet.'}</strong></div>
          </div>

          {viewUser.verificationNote ? (
            <div className="adminDetailBlock">
              <span>Verification note</span>
              <p>{viewUser.verificationNote}</p>
            </div>
          ) : null}

          <div className="adminDetailBlock">
            <div className="adminSectionHeader">
              <div>
                <span>User tasks</span>
                <p className="adminModalCopy">Task detail editing remains available from the dedicated Jobs manager.</p>
              </div>
              <button
                type="button"
                className="adminSecondaryButton interactive"
                onClick={() => navigate(ROUTES.adminJobs)}
              >
                <BriefcaseBusiness size={15} />
                Open jobs manager
              </button>
            </div>

            <div className="adminMiniStats">
              <div className="adminMiniStat"><span>Total</span><strong>{viewUser.taskStats?.total || 0}</strong></div>
              <div className="adminMiniStat"><span>Active</span><strong>{viewUser.taskStats?.active || 0}</strong></div>
              <div className="adminMiniStat"><span>Pending</span><strong>{viewUser.taskStats?.pending || 0}</strong></div>
              <div className="adminMiniStat"><span>Closed</span><strong>{viewUser.taskStats?.closed || 0}</strong></div>
            </div>

            {viewUser.tasks?.length ? (
              <div className="adminUserTaskGrid">
                {viewUser.tasks.map((task) => <UserTaskCard key={task.id} task={task} />)}
              </div>
            ) : (
              <div className="adminEmptyState compact">
                <strong>No tasks yet</strong>
                <p>This user has not created any tasks yet.</p>
              </div>
            )}
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
              hint="Profile image changes are saved directly to the user account."
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
                <PhoneNumberField
                  countryValue={formState.country}
                  countries={countries}
                  value={formState.phone}
                  onChange={(value) => setFormState((current) => ({ ...current, phone: value }))}
                  disabled={isCountriesLoading}
                  placeholder="501234567"
                />
              </label>
              <label>
                <span>Country</span>
                <CountrySelect
                  value={formState.country}
                  countries={countries}
                  onChange={(value) => setFormState((current) => ({
                    ...current,
                    country: value,
                    phone: syncPhoneNumberToCountry(current.phone, current.country, value, countries)
                  }))}
                  disabled={isCountriesLoading}
                  placeholder="Select country"
                />
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

            <div className="adminDetailBlock">
              <div className="adminSectionHeader">
                <div>
                  <span>Password reset</span>
                  <p className="adminModalCopy">Admin can set a fresh password directly. Existing refresh sessions will be revoked automatically.</p>
                </div>
                <button
                  type="button"
                  className="adminSecondaryButton interactive"
                  onClick={handlePasswordReset}
                  disabled={isResettingPassword}
                >
                  {isResettingPassword ? <LoaderCircle size={15} className="spinLoader" /> : <KeyRound size={15} />}
                  {isResettingPassword ? 'Updating...' : 'Reset password'}
                </button>
              </div>

              {passwordFeedback.message ? <div className={`adminNotice ${passwordFeedback.type}`}>{passwordFeedback.message}</div> : null}

              <div className="adminFormGrid wide">
                <label>
                  <span>New password</span>
                  <input
                    type="password"
                    value={passwordState.newPassword}
                    onChange={(event) => setPasswordState((current) => ({ ...current, newPassword: event.target.value }))}
                  />
                </label>
                <label>
                  <span>Confirm password</span>
                  <input
                    type="password"
                    value={passwordState.confirmPassword}
                    onChange={(event) => setPasswordState((current) => ({ ...current, confirmPassword: event.target.value }))}
                  />
                </label>
              </div>
            </div>
          </div>
        </AdminModal>
      ) : null}

      {statusTarget ? (
        <AdminConfirmDialog
          title={statusTarget.status === 'blocked' ? 'Unblock user?' : 'Block user?'}
          description={`This will switch the account access to ${statusTarget.status === 'blocked' ? 'active' : 'blocked'}.`}
          confirmLabel={statusTarget.status === 'blocked' ? 'Unblock' : 'Block'}
          onConfirm={async () => {
            const updatedUser = await toggleUserStatus(statusTarget);

            if (updatedUser) {
              setStatusTarget(null);
            }
          }}
          onClose={() => setStatusTarget(null)}
          tone={statusTarget.status === 'blocked' ? 'primary' : 'danger'}
        />
      ) : null}

      {deleteTarget ? (
        <AdminConfirmDialog
          title="Delete user?"
          description="This removes the user record and the connected workspace data from the admin system."
          confirmLabel="Delete"
          onConfirm={async () => {
            const deletedUser = await deleteUser(deleteTarget.id);

            if (deletedUser) {
              setDeleteTarget(null);
            }
          }}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
