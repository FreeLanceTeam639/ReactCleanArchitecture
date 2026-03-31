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
import AdminImageField from '../../shared/ui/admin/AdminImageField.jsx';
import AdminActionIconButton from '../../shared/ui/admin/AdminActionIconButton.jsx';

function buildCategoryFormState(category) {
  return {
    name: category?.name || '',
    slug: category?.slug || '',
    status: category?.status || 'active',
    iconUrl: category?.iconUrl || ''
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

    const savedCategory =
      editingCategory?.mode === 'create'
        ? await createCategory(payload)
        : await saveCategory(editingCategory.id, payload);

    if (!savedCategory) {
      return;
    }

    setEditingCategory(null);
  };

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Categories"
      description="Marketplace taxonomiyasını icon və status ilə daha yumşaq idarə et."
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
                    <th>Category</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <div className="adminIdentityCell">
                          {category.iconUrl ? <img src={category.iconUrl} alt={category.name} className="adminListThumb" /> : <div className="adminListThumb placeholder">CAT</div>}
                          <div>
                            <strong>{category.name}</strong>
                            <span>{category.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{category.slug}</td>
                      <td><AdminStatusBadge value={category.status} /></td>
                      <td>
                        <div className="adminRowActions">
                          <AdminActionIconButton icon={Pencil} label="Edit category" onClick={() => handleOpenEdit(category)} />
                          <AdminActionIconButton icon={Power} label="Toggle category status" onClick={() => setStatusTarget(category)} tone={category.status === 'active' ? 'warning' : 'primary'} />
                          <AdminActionIconButton icon={Trash2} label="Delete category" onClick={() => setDeleteTarget(category)} tone="danger" />
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
          wide
          footer={(
            <>
              <button type="button" className="adminSecondaryButton interactive" onClick={() => setEditingCategory(null)}>Cancel</button>
              <button type="button" className="btn primary interactive" onClick={handleSave}>{editingCategory.mode === 'create' ? 'Create' : 'Save changes'}</button>
            </>
          )}
        >
          <div className="adminFormStack">
            <AdminImageField
              label="Category icon/image"
              value={formState.iconUrl}
              onChange={(value) => setFormState((current) => ({ ...current, iconUrl: value }))}
            />
            <div className="adminFormGrid wide">
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
          </div>
        </AdminModal>
      ) : null}

      {statusTarget ? (
        <AdminConfirmDialog
          title={statusTarget.status === 'active' ? 'Deactivate category?' : 'Activate category?'}
          description={`Status ${statusTarget.status === 'active' ? 'inactive' : 'active'} olacaq.`}
          confirmLabel={statusTarget.status === 'active' ? 'Deactivate' : 'Activate'}
          onConfirm={async () => {
            const updatedCategory = await toggleCategoryStatus(statusTarget);

            if (updatedCategory) {
              setStatusTarget(null);
            }
          }}
          onClose={() => setStatusTarget(null)}
          tone={statusTarget.status === 'active' ? 'danger' : 'primary'}
        />
      ) : null}

      {deleteTarget ? (
        <AdminConfirmDialog
          title="Delete category?"
          description="Bu category admin siyahısından silinəcək. Home filter bu source-a bağlıdırsa burada da yenilənəcək."
          confirmLabel="Delete"
          onConfirm={async () => {
            const deletedCategory = await deleteCategory(deleteTarget.id);

            if (deletedCategory) {
              setDeleteTarget(null);
            }
          }}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
