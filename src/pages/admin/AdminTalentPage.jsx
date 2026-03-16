import { Pencil, Power, Sparkles, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminTalentPage } from '../../features/admin/hooks/useAdminTalentPage.js';
import { ROUTES } from '../../shared/constants/routes.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import { AdminConfirmDialog, AdminModal } from '../../shared/ui/admin/AdminModal.jsx';
import AdminPagination from '../../shared/ui/admin/AdminPagination.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import AdminToolbar from '../../shared/ui/admin/AdminToolbar.jsx';

function buildTalentFormState(item) {
  return {
    name: item?.name || '',
    title: item?.title || '',
    skill: item?.skill || '',
    rating: item?.rating || 4.8,
    imageUrl: item?.imageUrl || '',
    status: item?.status || 'active',
    featured: Boolean(item?.featured)
  };
}

export default function AdminTalentPage({ navigate, pathname = ROUTES.adminTalent }) {
  const {
    search,
    setSearch,
    status,
    setStatus,
    featured,
    setFeatured,
    page,
    setPage,
    items,
    meta,
    isLoading,
    error,
    feedback,
    createTalent,
    saveTalent,
    toggleTalentStatus,
    toggleTalentFeatured,
    deleteTalent
  } = useAdminTalentPage();

  const [editingTalent, setEditingTalent] = useState(null);
  const [formState, setFormState] = useState(buildTalentFormState(null));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [featureTarget, setFeatureTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);

  const toolbarFilters = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        value: status,
        onChange: setStatus,
        options: [
          { value: 'all', label: 'All statuses' },
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' }
        ]
      },
      {
        key: 'featured',
        label: 'Featured',
        value: featured,
        onChange: setFeatured,
        options: [
          { value: 'all', label: 'All talent' },
          { value: 'featured', label: 'Featured' },
          { value: 'regular', label: 'Regular' }
        ]
      }
    ],
    [status, setStatus, featured, setFeatured]
  );

  const handleOpenCreate = () => {
    setEditingTalent({ mode: 'create' });
    setFormState(buildTalentFormState(null));
  };

  const handleOpenEdit = (item) => {
    setEditingTalent(item);
    setFormState(buildTalentFormState(item));
  };

  const handleSave = async () => {
    const payload = { ...formState, rating: Number(formState.rating) };

    if (editingTalent?.mode === 'create') {
      await createTalent(payload);
    } else {
      await saveTalent(editingTalent.id, payload);
    }

    setEditingTalent(null);
  };

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Talent"
      description="Freelancer kartları və featured siyahısını yenilə."
    >
      {feedback ? <div className="adminNotice success">{feedback}</div> : null}
      {error ? <div className="adminNotice error">{error}</div> : null}

      <AdminToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search talent by name, title, skill"
        filters={toolbarFilters}
        actionLabel="Add Talent"
        onAction={handleOpenCreate}
      />

      <section className="adminPanelCard cardLift">
        <div className="adminPanelCardHeader">
          <div>
            <span className="adminPageEyebrow">Freelancers</span>
            <h2>Talent List</h2>
          </div>
          <span className="adminPanelCount">{meta.total} talent</span>
        </div>

        {isLoading ? (
          <div className="adminEmptyState compact">
            <strong>Talent loading...</strong>
            <p>Kart məlumatları admin görünüşünə hazırlanır.</p>
          </div>
        ) : items.length ? (
          <>
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Title</th>
                    <th>Skill</th>
                    <th>Rating</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="adminIdentityCell">
                          <span className="adminAvatarPlaceholder">{item.name.slice(0, 1)}</span>
                          <div>
                            <strong>{item.name}</strong>
                            <span>{item.imageUrl || 'Image placeholder'}</span>
                          </div>
                        </div>
                      </td>
                      <td>{item.title}</td>
                      <td>{item.skill}</td>
                      <td>{item.rating.toFixed(1)}</td>
                      <td><AdminStatusBadge value={item.status} /></td>
                      <td><AdminStatusBadge value={item.featured ? 'featured' : 'regular'} tone={item.featured ? 'featured' : 'muted'} /></td>
                      <td>
                        <div className="adminRowActions">
                          <button type="button" className="adminIconButton interactive" onClick={() => handleOpenEdit(item)} aria-label="Edit talent"><Pencil size={16} /></button>
                          <button type="button" className="adminIconButton interactive" onClick={() => setFeatureTarget(item)} aria-label="Toggle featured"><Sparkles size={16} /></button>
                          <button type="button" className="adminIconButton interactive" onClick={() => setStatusTarget(item)} aria-label="Toggle talent status"><Power size={16} /></button>
                          <button type="button" className="adminIconButton interactive danger" onClick={() => setDeleteTarget(item)} aria-label="Delete talent"><Trash2 size={16} /></button>
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
            <strong>No talent found</strong>
            <p>Yeni freelancer kartı əlavə et və burada idarə et.</p>
          </div>
        )}
      </section>

      {editingTalent ? (
        <AdminModal
          title={editingTalent.mode === 'create' ? 'Add talent' : 'Edit talent'}
          onClose={() => setEditingTalent(null)}
          wide
          footer={(
            <>
              <button type="button" className="btn soft interactive" onClick={() => setEditingTalent(null)}>Cancel</button>
              <button type="button" className="btn primary interactive" onClick={handleSave}>{editingTalent.mode === 'create' ? 'Create' : 'Save changes'}</button>
            </>
          )}
        >
          <div className="adminFormGrid wide">
            <label>
              <span>Name</span>
              <input value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label>
              <span>Title</span>
              <input value={formState.title} onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))} />
            </label>
            <label>
              <span>Skill</span>
              <input value={formState.skill} onChange={(event) => setFormState((current) => ({ ...current, skill: event.target.value }))} />
            </label>
            <label>
              <span>Rating</span>
              <input type="number" step="0.1" min="0" max="5" value={formState.rating} onChange={(event) => setFormState((current) => ({ ...current, rating: event.target.value }))} />
            </label>
            <label>
              <span>Image URL</span>
              <input value={formState.imageUrl} onChange={(event) => setFormState((current) => ({ ...current, imageUrl: event.target.value }))} placeholder="/images/talent-1.png" />
            </label>
            <label>
              <span>Status</span>
              <select value={formState.status} onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label className="adminCheckboxField fullSpan">
              <input type="checkbox" checked={formState.featured} onChange={(event) => setFormState((current) => ({ ...current, featured: event.target.checked }))} />
              <span>Mark as featured talent</span>
            </label>
          </div>
        </AdminModal>
      ) : null}

      {featureTarget ? (
        <AdminConfirmDialog
          title={featureTarget.featured ? 'Remove featured badge?' : 'Mark as featured?'}
          description={featureTarget.featured ? 'Talent artıq featured bölməsində görünməyəcək.' : 'Talent featured siyahısına əlavə olunacaq.'}
          confirmLabel={featureTarget.featured ? 'Remove' : 'Feature'}
          onConfirm={async () => {
            await toggleTalentFeatured(featureTarget);
            setFeatureTarget(null);
          }}
          onClose={() => setFeatureTarget(null)}
          tone={featureTarget.featured ? 'danger' : 'primary'}
        />
      ) : null}

      {statusTarget ? (
        <AdminConfirmDialog
          title={statusTarget.status === 'active' ? 'Deactivate talent?' : 'Activate talent?'}
          description={`Talent status ${statusTarget.status === 'active' ? 'inactive' : 'active'} olacaq.`}
          confirmLabel={statusTarget.status === 'active' ? 'Deactivate' : 'Activate'}
          onConfirm={async () => {
            await toggleTalentStatus(statusTarget);
            setStatusTarget(null);
          }}
          onClose={() => setStatusTarget(null)}
          tone={statusTarget.status === 'active' ? 'danger' : 'primary'}
        />
      ) : null}

      {deleteTarget ? (
        <AdminConfirmDialog
          title="Delete talent?"
          description="Freelancer kartı admin siyahısından silinəcək."
          confirmLabel="Delete"
          onConfirm={async () => {
            await deleteTalent(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
