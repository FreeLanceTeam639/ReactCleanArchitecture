import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminJobsPage } from '../../features/admin/hooks/useAdminJobsPage.js';
import { ROUTES } from '../../shared/constants/routes.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import { AdminConfirmDialog, AdminModal } from '../../shared/ui/admin/AdminModal.jsx';
import AdminPagination from '../../shared/ui/admin/AdminPagination.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import AdminToolbar from '../../shared/ui/admin/AdminToolbar.jsx';

function formatDate(value) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value));
}

function buildJobFormState(job) {
  return {
    title: job?.title || '',
    categoryId: job?.categoryId || '',
    budget: job?.budget || 0,
    status: job?.status || 'pending',
    visibility: job?.visibility || 'visible',
    description: job?.description || ''
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

    await saveJob(editingJob.id, {
      ...formState,
      budget: Number(formState.budget),
      categoryName: selectedCategory?.name || editingJob.categoryName
    });

    setEditingJob(null);
  };

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Jobs"
      description="Elanları status və görünürlük baxımından idarə et."
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
                    <th>Job Title</th>
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
                      <td><strong>{job.title}</strong></td>
                      <td>{job.categoryName}</td>
                      <td>${job.budget}</td>
                      <td>{job.ownerName}</td>
                      <td><AdminStatusBadge value={job.status} /></td>
                      <td><AdminStatusBadge value={job.visibility} tone={job.visibility} /></td>
                      <td>
                        <div className="adminRowActions">
                          <button type="button" className="adminIconButton interactive" onClick={() => setViewJob(job)} aria-label="View job"><Eye size={16} /></button>
                          <button type="button" className="adminIconButton interactive" onClick={() => openEditModal(job)} aria-label="Edit job"><Pencil size={16} /></button>
                          <button type="button" className="adminIconButton interactive" onClick={() => setVisibilityTarget(job)} aria-label="Toggle job visibility">{job.visibility === 'hidden' ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                          <button type="button" className="adminIconButton interactive danger" onClick={() => setDeleteTarget(job)} aria-label="Delete job"><Trash2 size={16} /></button>
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
        <AdminModal title="Job details" onClose={() => setViewJob(null)} wide footer={(
          <button type="button" className="btn soft interactive" onClick={() => setViewJob(null)}>Close</button>
        )}>
          <div className="adminDetailGrid wide">
            <div><span>Title</span><strong>{viewJob.title}</strong></div>
            <div><span>Category</span><strong>{viewJob.categoryName}</strong></div>
            <div><span>Budget</span><strong>${viewJob.budget}</strong></div>
            <div><span>Owner</span><strong>{viewJob.ownerName}</strong></div>
            <div><span>Status</span><AdminStatusBadge value={viewJob.status} /></div>
            <div><span>Visibility</span><AdminStatusBadge value={viewJob.visibility} tone={viewJob.visibility} /></div>
            <div><span>Created</span><strong>{formatDate(viewJob.createdAt)}</strong></div>
            <div><span>Job ID</span><strong>{viewJob.id}</strong></div>
          </div>
          <div className="adminDetailBlock">
            <span>Description</span>
            <p>{viewJob.description}</p>
          </div>
        </AdminModal>
      ) : null}

      {editingJob ? (
        <AdminModal
          title="Edit job"
          onClose={() => setEditingJob(null)}
          wide
          footer={(
            <>
              <button type="button" className="btn soft interactive" onClick={() => setEditingJob(null)}>Cancel</button>
              <button type="button" className="btn primary interactive" onClick={handleSave}>Save changes</button>
            </>
          )}
        >
          <div className="adminFormGrid wide">
            <label>
              <span>Title</span>
              <input value={formState.title} onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))} />
            </label>
            <label>
              <span>Category</span>
              <select value={formState.categoryId} onChange={(event) => setFormState((current) => ({ ...current, categoryId: event.target.value }))}>
                {categoryOptions.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Budget</span>
              <input type="number" value={formState.budget} onChange={(event) => setFormState((current) => ({ ...current, budget: event.target.value }))} />
            </label>
            <label>
              <span>Status</span>
              <select value={formState.status} onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))}>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
            </label>
            <label>
              <span>Visibility</span>
              <select value={formState.visibility} onChange={(event) => setFormState((current) => ({ ...current, visibility: event.target.value }))}>
                <option value="visible">Visible</option>
                <option value="hidden">Hidden</option>
              </select>
            </label>
            <label className="fullSpan">
              <span>Description</span>
              <textarea rows="5" value={formState.description} onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))} />
            </label>
          </div>
        </AdminModal>
      ) : null}

      {visibilityTarget ? (
        <AdminConfirmDialog
          title={visibilityTarget.visibility === 'hidden' ? 'Show job?' : 'Hide job?'}
          description={`Bu job ${visibilityTarget.visibility === 'hidden' ? 'yenidən görünən' : 'gizli'} olacaq.`}
          confirmLabel={visibilityTarget.visibility === 'hidden' ? 'Show' : 'Hide'}
          onConfirm={async () => {
            await toggleVisibility(visibilityTarget);
            setVisibilityTarget(null);
          }}
          onClose={() => setVisibilityTarget(null)}
          tone={visibilityTarget.visibility === 'hidden' ? 'primary' : 'danger'}
        />
      ) : null}

      {deleteTarget ? (
        <AdminConfirmDialog
          title="Delete job?"
          description="Job admin siyahısından silinəcək və geri qaytarmaq mümkün olmayacaq."
          confirmLabel="Delete"
          onConfirm={async () => {
            await deleteJob(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
