import { Pencil, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAdminPricingPage } from '../../features/admin/hooks/useAdminPricingPage.js';
import { ROUTES } from '../../shared/constants/routes.js';
import AdminLayout from '../../shared/ui/admin/AdminLayout.jsx';
import { AdminConfirmDialog, AdminModal } from '../../shared/ui/admin/AdminModal.jsx';
import AdminPagination from '../../shared/ui/admin/AdminPagination.jsx';
import AdminStatusBadge from '../../shared/ui/admin/AdminStatusBadge.jsx';
import AdminToolbar from '../../shared/ui/admin/AdminToolbar.jsx';

function buildPricingFormState(item) {
  return {
    name: item?.name || '',
    price: item?.price || 0,
    featuresText: Array.isArray(item?.features) ? item.features.join('\n') : '',
    status: item?.status || 'active'
  };
}

export default function AdminPricingPage({ navigate, pathname = ROUTES.adminPricing }) {
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
    createPricing,
    savePricing,
    deletePricing
  } = useAdminPricingPage();

  const [editingPackage, setEditingPackage] = useState(null);
  const [formState, setFormState] = useState(buildPricingFormState(null));
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
      }
    ],
    [status, setStatus]
  );

  const handleOpenCreate = () => {
    setEditingPackage({ mode: 'create' });
    setFormState(buildPricingFormState(null));
  };

  const handleOpenEdit = (item) => {
    setEditingPackage(item);
    setFormState(buildPricingFormState(item));
  };

  const handleSave = async () => {
    const payload = {
      name: formState.name,
      price: Number(formState.price),
      features: formState.featuresText.split('\n').map((line) => line.trim()).filter(Boolean),
      status: formState.status
    };

    if (editingPackage?.mode === 'create') {
      await createPricing(payload);
    } else {
      await savePricing(editingPackage.id, payload);
    }

    setEditingPackage(null);
  };

  return (
    <AdminLayout
      navigate={navigate}
      pathname={pathname}
      title="Pricing"
      description="Public pricing paketlərini mövcud dizayna uyğun saxla."
    >
      {feedback ? <div className="adminNotice success">{feedback}</div> : null}
      {error ? <div className="adminNotice error">{error}</div> : null}

      <AdminToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search packages"
        filters={toolbarFilters}
        actionLabel="Add Package"
        onAction={handleOpenCreate}
      />

      <section className="adminPanelCard cardLift">
        <div className="adminPanelCardHeader">
          <div>
            <span className="adminPageEyebrow">Packages</span>
            <h2>Pricing List</h2>
          </div>
          <span className="adminPanelCount">{meta.total} packages</span>
        </div>

        {isLoading ? (
          <div className="adminEmptyState compact">
            <strong>Pricing loading...</strong>
            <p>Paketlər admin görünüşündə hazırlanır.</p>
          </div>
        ) : items.length ? (
          <>
            <div className="adminPricingGrid">
              {items.map((item) => (
                <article key={item.id} className="adminPricingCard cardLift">
                  <div className="adminPricingCardHeader">
                    <div>
                      <h3>{item.name}</h3>
                      <strong>{item.formattedPrice}</strong>
                    </div>
                    <AdminStatusBadge value={item.status} />
                  </div>
                  <ul>
                    {item.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                  <div className="adminRowActions split">
                    <button type="button" className="adminActionTextButton interactive" onClick={() => handleOpenEdit(item)}><Pencil size={15} /> Edit</button>
                    <button type="button" className="adminActionTextButton interactive danger" onClick={() => setDeleteTarget(item)}><Trash2 size={15} /> Delete</button>
                  </div>
                </article>
              ))}
            </div>
            <AdminPagination meta={meta} onPageChange={setPage} />
          </>
        ) : (
          <div className="adminEmptyState compact">
            <strong>No pricing packages found</strong>
            <p>Yeni paket əlavə edərək pricing bölməsini idarə et.</p>
          </div>
        )}
      </section>

      {editingPackage ? (
        <AdminModal
          title={editingPackage.mode === 'create' ? 'Add pricing package' : 'Edit pricing package'}
          onClose={() => setEditingPackage(null)}
          wide
          footer={(
            <>
              <button type="button" className="btn soft interactive" onClick={() => setEditingPackage(null)}>Cancel</button>
              <button type="button" className="btn primary interactive" onClick={handleSave}>{editingPackage.mode === 'create' ? 'Create' : 'Save changes'}</button>
            </>
          )}
        >
          <div className="adminFormGrid wide">
            <label>
              <span>Package Name</span>
              <input value={formState.name} onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label>
              <span>Price</span>
              <input type="number" value={formState.price} onChange={(event) => setFormState((current) => ({ ...current, price: event.target.value }))} />
            </label>
            <label>
              <span>Status</span>
              <select value={formState.status} onChange={(event) => setFormState((current) => ({ ...current, status: event.target.value }))}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </label>
            <label className="fullSpan">
              <span>Features (one per line)</span>
              <textarea rows="6" value={formState.featuresText} onChange={(event) => setFormState((current) => ({ ...current, featuresText: event.target.value }))} />
            </label>
          </div>
        </AdminModal>
      ) : null}

      {deleteTarget ? (
        <AdminConfirmDialog
          title="Delete package?"
          description="Pricing paketi admin siyahısından silinəcək."
          confirmLabel="Delete"
          onConfirm={async () => {
            await deletePricing(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onClose={() => setDeleteTarget(null)}
        />
      ) : null}
    </AdminLayout>
  );
}
