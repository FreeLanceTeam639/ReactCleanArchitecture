import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminJobsPage } from '../../features/admin/hooks/useAdminJobsPage.js';
import { ROUTES } from '../../shared/constants/routes.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import { AdminConfirmDialog, AdminModal } from '../../shared/ui/admin/AdminModal.jsx';
import AdminPagination from '../../shared/ui/admin/AdminPagination.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import AdminToolbar from '../../shared/ui/admin/AdminToolbar.jsx';
import AdminImageField from '../../shared/ui/admin/AdminImageField.jsx';
import AdminMediaGalleryField from '../../shared/ui/admin/AdminMediaGalleryField.jsx';
import AdminActionIconButton from '../../shared/ui/admin/AdminActionIconButton.jsx';
import { getCurrentLocale } from '../../shared/i18n/locale.js';
import SelectOne from '../../components/ui/select-1.jsx';

function formatDate(value) {
  return new Intl.DateTimeFormat(getCurrentLocale(), { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function buildJobFormState(job) {
  return {
    title: job?.title || '',
    categoryId: job?.categoryId || '',
    budget: job?.budget || 0,
    status: job?.status || 'pending',
    visibility: job?.visibility || 'visible',
    description: job?.description || '',
    coverImageUrl: job?.coverImageUrl || '',
    media: Array.isArray(job?.media) ? job.media : [],
    tagsText: Array.isArray(job?.tags) ? job.tags.join(', ') : ''
  };
}

export default function AdminJobsPage({ navigate, pathname = ROUTES.adminJobs }) {
  const {
    search,
    setSearch,
    categoryId,
    setCategoryId,
    status,
    setStatus,
    page,
    setPage,
    items,
    meta,
    isLoading,
    error,
    feedback,
    categoryOptions,
    saveJob,
    toggleVisibility,
    deleteJob
  } = useAdminJobsPage();

  const [viewJob, setViewJob] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [formState, setFormState] = useState(buildJobFormState(null));
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [visibilityTarget, setVisibilityTarget] = useState(null);

  const toolbarFilters = useMemo(
    () => [
      {
        key: 'category',
        label: 'Category',
        value: categoryId,
        onChange: setCategoryId,
        options: [
          { value: 'all', label: 'All categories' },
          ...categoryOptions.map((item) => ({ value: item.id, label: item.name }))
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
          { value: 'pending', label: 'Pending' },
          { value: 'closed', label: 'Closed' }
        ]
      }
    ],
    [categoryId, setCategoryId, categoryOptions, status, setStatus]
  );

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormState(buildJobFormState(job));
  };

  const handleSave = async () => {
    const selectedCategory = categoryOptions.find((item) => item.id === formState.categoryId);

    const updatedJob = await saveJob(editingJob.id, {
      ...formState,
      budget: Number(formState.budget),
      categoryName: selectedCategory?.name || editingJob.categoryName,
      tags: formState.tagsText.split(',').map((item) => item.trim()).filter(Boolean)
    });

    if (!updatedJob) {
      return;
    }

    setEditingJob(null);
  };

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Jobs"
      description="Elanları status, görünürlük və şəkil qalereyası ilə birlikdə idarə et."
    >
      {feedback ? <div className="adminNotice success">{feedback}</div> : null}
      {error ? <div className="adminNotice error">{error}</div> : null}

      <AdminToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search jobs, owners, categories"
        filters={toolbarFilters}
      />

      <section className="adminPanelCard cardLift">
        <div className="adminPanelCardHeader">
          <div>
            <span className="adminPageEyebrow">Listings</span>
            <h2>Job Management</h2>
          </div>
          <span className="adminPanelCount">{meta.total} jobs</span>
        </div>

        {isLoading ? (
          <div className="adminEmptyState compact">
            <strong>Jobs loading...</strong>
            <p>Elanlar və filter nəticələri gətirilir.</p>
          </div>
        ) : items.length ? (
          <>
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Category</th>
                    <th>Budget</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <div className="adminIdentityCell">
                          {job.coverImageUrl ? <img src={job.coverImageUrl} alt={job.title} className="adminListThumb wide" /> : <div className="adminListThumb wide placeholder">JOB</div>}
                          <div>
                            <strong>{job.title}</strong>
                            <span>{job.description?.slice(0, 72) || 'No description'}{job.description?.length > 72 ? '…' : ''}</span>
                          </div>
                        </div>
                      </td>
                      <td>{job.categoryName}</td>
                      <td>${job.budget}</td>
                      <td>{job.ownerName}</td>
                      <td><AdminStatusBadge value={job.status} /></td>
                      <td><AdminStatusBadge value={job.visibility} tone={job.visibility} /></td>
                      <td>
                        <div className="adminRowActions">
                          <AdminActionIconButton icon={Eye} label="View job" onClick={() => setViewJob(job)} />
                          <AdminActionIconButton icon={Pencil} label="Edit job" onClick={() => openEditModal(job)} />
                          <AdminActionIconButton icon={job.visibility === 'hidden' ? Eye : EyeOff} label="Toggle job visibility" onClick={() => setVisibilityTarget(job)} tone={job.visibility === 'hidden' ? 'primary' : 'warning'} />
                          <AdminActionIconButton icon={Trash2} label="Delete job" onClick={() => setDeleteTarget(job)} tone="danger" />
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
            <strong>No jobs found</strong>
            <p>Filter nəticəsinə uyğun elan tapılmadı.</p>
          </div>
        )}
      </section>

      {viewJob ? (
        <AdminModal title="Job details" onClose={() => setViewJob(null)} wide footer={<button type="button" className="adminSecondaryButton interactive" onClick={() => setViewJob(null)}>Close</button>}>
          <div className="adminDetailHero">
            {viewJob.coverImageUrl ? <img src={viewJob.coverImageUrl} alt={viewJob.title} className="adminDetailCover" /> : <div className="adminDetailCover placeholder">No cover</div>}
            <div>
              <h4>{viewJob.title}</h4>
              <p>{viewJob.categoryName} • {viewJob.ownerName}</p>
              <div className="adminInlineBadges">
                <AdminStatusBadge value={viewJob.status} />
                <AdminStatusBadge value={viewJob.visibility} tone={viewJob.visibility} />
              </div>
            </div>
          </div>
          <div className="adminDetailGrid wide">
            <div><span>Budget</span><strong>${viewJob.budget}</strong></div>
            <div><span>Created</span><strong>{formatDate(viewJob.createdAt)}</strong></div>
            <div><span>Images</span><strong>{viewJob.media?.length || 0} files</strong></div>
          </div>
          <div className="adminDetailBlock">
            <span>Description</span>
            <p>{viewJob.description}</p>
          </div>
          {viewJob.media?.length ? (
            <div className="adminMediaGrid topGap">
              {viewJob.media.map((item) => (
                <div key={item.id} className="adminMediaCard readOnly">
                  <img src={item.url} alt={viewJob.title} />
                  <div className="adminMediaMeta">
                    <span>{item.isPrimary ? 'Primary image' : 'Additional media'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </AdminModal>
      ) : null}

      {editingJob ? (
        <AdminModal
          title="Edit job"
          onClose={() => setEditingJob(null)}
          wide
          footer={(
            <>
              <button type="button" className="adminSecondaryButton interactive" onClick={() => setEditingJob(null)}>Cancel</button>
              <button type="button" className="btn primary interactive" onClick={handleSave}>Save changes</button>
            </>
          )}
        >
          <div className="adminFormStack">
            <AdminImageField
              label="Cover image"
              value={formState.coverImageUrl}
              onChange={(value) => setFormState((current) => ({ ...current, coverImageUrl: value }))}
              hint="Primary image və ya listing cover kimi istifadə oluna bilər."
            />

            <div className="adminFormGrid wide">
              <label>
                <span>Title</span>
                <input value={formState.title} onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))} />
              </label>
              <label>
                <span>Category</span>
                <SelectOne value={formState.categoryId} onChange={(nextValue) => setFormState((current) => ({ ...current, categoryId: nextValue }))} options={categoryOptions.map((item) => ({ value: item.id, label: item.name }))} />
              </label>
              <label>
                <span>Budget</span>
                <input type="number" value={formState.budget} onChange={(event) => setFormState((current) => ({ ...current, budget: event.target.value }))} />
              </label>
              <label>
                <span>Status</span>
                <SelectOne value={formState.status} onChange={(nextValue) => setFormState((current) => ({ ...current, status: nextValue }))} options={[{ value: 'active', label: 'Active' }, { value: 'pending', label: 'Pending' }, { value: 'closed', label: 'Closed' }]} />
              </label>
              <label>
                <span>Visibility</span>
                <SelectOne value={formState.visibility} onChange={(nextValue) => setFormState((current) => ({ ...current, visibility: nextValue }))} options={[{ value: 'visible', label: 'Visible' }, { value: 'hidden', label: 'Hidden' }]} />
              </label>
              <label>
                <span>Tags</span>
                <input value={formState.tagsText} onChange={(event) => setFormState((current) => ({ ...current, tagsText: event.target.value }))} placeholder="React, UI, Marketplace" />
              </label>
              <label className="fullSpan">
                <span>Description</span>
                <textarea rows="5" value={formState.description} onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))} />
              </label>
            </div>

            <AdminMediaGalleryField items={formState.media} onChange={(nextItems) => setFormState((current) => ({
              ...current,
              media: nextItems,
              coverImageUrl: current.coverImageUrl || nextItems[0]?.url || ''
            }))} />
          </div>
        </AdminModal>
      ) : null}

      {visibilityTarget ? (
        <AdminConfirmDialog
          title={visibilityTarget.visibility === 'hidden' ? 'Show job?' : 'Hide job?'}
          description={`Bu job ${visibilityTarget.visibility === 'hidden' ? 'public siyahıda görünəcək' : 'public siyahıdan gizlədiləcək'}.`}
          confirmLabel={visibilityTarget.visibility === 'hidden' ? 'Show' : 'Hide'}
          onConfirm={async () => {
            const updatedJob = await toggleVisibility(visibilityTarget);

            if (updatedJob) {
              setVisibilityTarget(null);
            }
          }}
          onClose={() => setVisibilityTarget(null)}
          tone={visibilityTarget.visibility === 'hidden' ? 'primary' : 'danger'}
        />
      ) : null}

      {deleteTarget ? (
        <AdminConfirmDialog
          title="Delete job?"
          description="Bu əməliyyat job-u admin siyahısından siləcək."
          confirmLabel="Delete"
          onConfirm={async () => {
            const deletedJob = await deleteJob(deleteTarget.id);

            if (deletedJob) {
              setDeleteTarget(null);
            }
          }}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
