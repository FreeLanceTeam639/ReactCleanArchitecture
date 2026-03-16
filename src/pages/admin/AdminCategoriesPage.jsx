import { Pencil, Power, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { createSlug } from '../../shared/lib/slug/createSlug.js';
import { useAdminCategoriesPage } from '../../features/admin/hooks/useAdminCategoriesPage.js';
import { ROUTES } from '../../shared/constants/routes.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import { AdminConfirmDialog, AdminModal } from '../../shared/ui/admin/AdminModal.jsx';
import AdminPagination from '../../shared/ui/admin/AdminPagination.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import AdminToolbar from '../../shared/ui/admin/AdminToolbar.jsx';

function buildCategoryFormState(category) {
  return {
    name: category?.name || '',
    slug: category?.slug || '',
    status: category?.status || 'active'
  };
}

export default function AdminCategoriesPage({ navigate, pathname = ROUTES.adminCategories }) {
  const {
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    items,
    meta,
    isLoading,
    error,
    feedback,
    createCategory,
    saveCategory,
    toggleCategoryStatus,
    deleteCategory
  } = useAdminCategoriesPage();

  const [editingCategory, setEditingCategory] = useState(null);
  const [formState, setFormState] = useState(buildCategoryFormState(null));
  const [deleteTarget, setDeleteTarget] = useState(null);
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
      }
    ],
    [status, setStatus]
  );

  const handleOpenCreate = () => {
    setEditingCategory({ mode: 'create' });
    setFormState(buildCategoryFormState(null));
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormState(buildCategoryFormState(category));
  };

  const handleSave = async () => {
    const payload = {
      ...formState,
      slug: formState.slug || createSlug(formState.name)
    };

    if (editingCategory?.mode === 'create') {
      await createCategory(payload);
    } else {
      await saveCategory(editingCategory.id, payload);
    }

    setEditingCategory(null);
  };

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Categories"
      description="Marketplace taxonomiyasını səliqəli şəkildə saxla."
    >
      {feedback ? <div className="adminNotice success">{feedback}</div> : null}
      {error ? <div className="adminNotice error">{error}</div> : null}

      <AdminToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search categories"
        filters={toolbarFilters}
        actionLabel="Add Category"
        onAction={handleOpenCreate}
      />

      <section className="adminPanelCard cardLift">
        <div className="adminPanelCardHeader">
          <div>
            <span className="adminPageEyebrow">Taxonomy</span>
            <h2>Category List</h2>
          </div>
          <span className="adminPanelCount">{meta.total} categories</span>
        </div>

        {isLoading ? (
          <div className="adminEmptyState compact">
            <strong>Categories loading...</strong>
            <p>Məlumatlar admin cədvəlinə gətirilir.</p>
          </div>
        ) : items.length ? (
          <>
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((category) => (
                    <tr key={category.id}>
                      <td><strong>{category.name}</strong></td>
                      <td>{category.slug}</td>
                      <td><AdminStatusBadge value={category.status} /></td>
                      <td>
                        <div className="adminRowActions">
                          <button type="button" className="adminIconButton interactive" onClick={() => handleOpenEdit(category)} aria-label="Edit category"><Pencil size={16} /></button>
                          <button type="button" className="adminIconButton interactive" onClick={() => setStatusTarget(category)} aria-label="Toggle category status"><Power size={16} /></button>
                          <button type="button" className="adminIconButton interactive danger" onClick={() => setDeleteTarget(category)} aria-label="Delete category"><Trash2 size={16} /></button>
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
            <strong>No categories found</strong>
            <p>Yeni category əlavə edərək başlaya bilərsən.</p>
          </div>
        )}
      </section>

      {editingCategory ? (
        <AdminModal
          title={editingCategory.mode === 'create' ? 'Add category' : 'Edit category'}
          onClose={() => setEditingCategory(null)}
          footer={(
            <>
              <button type="button" className="btn soft interactive" onClick={() => setEditingCategory(null)}>Cancel</button>
              <button type="button" className="btn primary interactive" onClick={handleSave}>{editingCategory.mode === 'create' ? 'Create' : 'Save changes'}</button>
            </>
          )}
        >
          <div className="adminFormGrid">
            <label>
              <span>Category Name</span>
              <input value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value, slug: createSlug(event.target.value) }))} />
            </label>
            <label>
              <span>Slug</span>
              <input value={formState.slug} onChange={(event) => setFormState((current) => ({ ...current, slug: event.target.value }))} />
            </label>
            <label>
              <span>Status</span>
              <select value={formState.status} onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
          </div>
        </AdminModal>
      ) : null}

      {statusTarget ? (
        <AdminConfirmDialog
          title={statusTarget.status === 'active' ? 'Deactivate category?' : 'Activate category?'}
          description={`Status ${statusTarget.status === 'active' ? 'inactive' : 'active'} olacaq.`}
          confirmLabel={statusTarget.status === 'active' ? 'Deactivate' : 'Activate'}
          onConfirm={async () => {
            await toggleCategoryStatus(statusTarget);
            setStatusTarget(null);
          }}
          onClose={() => setStatusTarget(null)}
          tone={statusTarget.status === 'active' ? 'danger' : 'primary'}
        />
      ) : null}

      {deleteTarget ? (
        <AdminConfirmDialog
          title="Delete category?"
          description="Bu category admin siyahısından silinəcək."
          confirmLabel="Delete"
          onConfirm={async () => {
            await deleteCategory(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
