import { Pencil, Sparkles, Trash2, UserRoundCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminTalentPage } from '../../features/admin/hooks/useAdminTalentPage.js';
import { ROUTES } from '../../shared/constants/routes.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import { AdminConfirmDialog, AdminModal } from '../../shared/ui/admin/AdminModal.jsx';
import AdminPagination from '../../shared/ui/admin/AdminPagination.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import AdminToolbar from '../../shared/ui/admin/AdminToolbar.jsx';
import AdminImageField from '../../shared/ui/admin/AdminImageField.jsx';
import AdminActionIconButton from '../../shared/ui/admin/AdminActionIconButton.jsx';
import SelectOne from '../../components/ui/select-1.jsx';

function buildTalentFormState(item) {
  return {
    name: item?.name || '',
    title: item?.title || '',
    skill: item?.skill || '',
    categoryId: item?.categoryId || '',
    rating: item?.rating || 4.8,
    imageUrl: item?.imageUrl || '',
    status: item?.status || 'active',
    featured: Boolean(item?.featured),
    bio: item?.bio || ''
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
    categoryOptions,
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
  const [featureTarget, setFeatureTarget] = useState(null);
  const [statusTarget, setStatusTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
          { value: 'all', label: 'All' },
          { value: 'featured', label: 'Featured only' },
          { value: 'regular', label: 'Regular only' }
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
    const selectedCategory = categoryOptions.find((item) => item.id === formState.categoryId);
    const payload = {
      ...formState,
      rating: Number(formState.rating),
      categoryName: selectedCategory?.name || ''
    };

    const savedTalent =
      editingTalent?.mode === 'create'
        ? await createTalent(payload)
        : await saveTalent(editingTalent.id, payload);

    if (!savedTalent) {
      return;
    }

    setEditingTalent(null);
  };

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Talent"
      description="Freelancer kartlarını daha zəngin görünüş, şəkil və featured status ilə idarə et."
    >
      {feedback ? <div className="adminNotice success">{feedback}</div> : null}
      {error ? <div className="adminNotice error">{error}</div> : null}

      <AdminToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by talent, title, skill or category"
        filters={toolbarFilters}
        actionLabel="Add Talent"
        onAction={handleOpenCreate}
      />

      <section className="adminPanelCard cardLift">
        <div className="adminPanelCardHeader">
          <div>
            <span className="adminPageEyebrow">Freelancer profiles</span>
            <h2>Talent Directory</h2>
          </div>
          <span className="adminPanelCount">{meta.total} profiles</span>
        </div>

        {isLoading ? (
          <div className="adminEmptyState compact">
            <strong>Talent loading...</strong>
            <p>Freelancer profilləri gətirilir.</p>
          </div>
        ) : items.length ? (
          <>
            <div className="adminTalentGrid">
              {items.map((item) => (
                <article key={item.id} className="adminTalentCard cardLift">
                  <div className="adminTalentCardHeader">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="adminTalentAvatar" /> : <div className="adminAvatarPlaceholder">{item.name?.slice(0, 2)?.toUpperCase() || 'TL'}</div>}
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.title}</p>
                    </div>
                  </div>
                  <div className="adminInlineBadges wrap">
                    <AdminStatusBadge value={item.status} />
                    {item.featured ? <AdminStatusBadge value="featured" tone="primary" /> : null}
                  </div>
                  <div className="adminTalentMeta">
                    <span>{item.categoryName || 'General'}</span>
                    <strong>{item.skill}</strong>
                    <span>{item.rating.toFixed(1)} rating</span>
                  </div>
                  <p className="adminTalentCopy">{item.bio || 'No short bio added for this profile yet.'}</p>
                  <div className="adminRowActions split wrap">
                    <button type="button" className="adminActionTextButton interactive" onClick={() => handleOpenEdit(item)}><Pencil size={15} /> Edit</button>
                    <div className="adminRowActions">
                      <AdminActionIconButton icon={Sparkles} label="Toggle featured" onClick={() => setFeatureTarget(item)} tone={item.featured ? 'primary' : 'default'} active={item.featured} />
                      <AdminActionIconButton icon={UserRoundCheck} label="Toggle status" onClick={() => setStatusTarget(item)} tone={item.status === 'active' ? 'warning' : 'primary'} />
                      <AdminActionIconButton icon={Trash2} label="Delete talent" onClick={() => setDeleteTarget(item)} tone="danger" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <AdminPagination meta={meta} onPageChange={setPage} />
          </>
        ) : (
          <div className="adminEmptyState compact">
            <strong>No talent found</strong>
            <p>Yeni freelancer kartı əlavə edərək burada idarə edə bilərsən.</p>
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
              <button type="button" className="adminSecondaryButton interactive" onClick={() => setEditingTalent(null)}>Cancel</button>
              <button type="button" className="btn primary interactive" onClick={handleSave}>{editingTalent.mode === 'create' ? 'Create' : 'Save changes'}</button>
            </>
          )}
        >
          <div className="adminFormStack">
            <AdminImageField label="Talent avatar" value={formState.imageUrl} onChange={(value) => setFormState((current) => ({ ...current, imageUrl: value }))} shape="circle" />

            <div className="adminFormGrid wide">
              <label>
                <span>Name</span>
                <input value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} />
              </label>
              <label>
                <span>Professional title</span>
                <input value={formState.title} onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))} />
              </label>
              <label>
                <span>Main skill</span>
                <input value={formState.skill} onChange={(event) => setFormState((current) => ({ ...current, skill: event.target.value }))} />
              </label>
              <label>
                <span>Category</span>
                <SelectOne value={formState.categoryId} onChange={(nextValue) => setFormState((current) => ({ ...current, categoryId: nextValue }))} options={[{ value: '', label: 'Select category' }, ...categoryOptions.map((item) => ({ value: item.id, label: item.name }))]} />
              </label>
              <label>
                <span>Rating</span>
                <input type="number" min="0" max="5" step="0.1" value={formState.rating} onChange={(event) => setFormState((current) => ({ ...current, rating: event.target.value }))} />
              </label>
              <label>
                <span>Status</span>
                <SelectOne value={formState.status} onChange={(nextValue) => setFormState((current) => ({ ...current, status: nextValue }))} options={[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} />
              </label>
              <label className="adminCheckboxField fullSpan">
                <input type="checkbox" checked={formState.featured} onChange={(event) => setFormState((current) => ({ ...current, featured: event.target.checked }))} />
                <span>Mark as featured talent</span>
              </label>
              <label className="fullSpan">
                <span>Short bio</span>
                <textarea rows="4" value={formState.bio} onChange={(event) => setFormState((current) => ({ ...current, bio: event.target.value }))} />
              </label>
            </div>
          </div>
        </AdminModal>
      ) : null}

      {featureTarget ? (
        <AdminConfirmDialog
          title={featureTarget.featured ? 'Remove featured badge?' : 'Mark as featured?'}
          description={featureTarget.featured ? 'Talent artıq featured bölməsində görünməyəcək.' : 'Talent featured siyahısına əlavə olunacaq.'}
          confirmLabel={featureTarget.featured ? 'Remove' : 'Feature'}
          onConfirm={async () => {
            const updatedTalent = await toggleTalentFeatured(featureTarget);

            if (updatedTalent) {
              setFeatureTarget(null);
            }
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
            const updatedTalent = await toggleTalentStatus(statusTarget);

            if (updatedTalent) {
              setStatusTarget(null);
            }
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
            const deletedTalent = await deleteTalent(deleteTarget.id);

            if (deletedTalent) {
              setDeleteTarget(null);
            }
          }}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
