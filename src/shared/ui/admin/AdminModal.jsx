import { X } from 'lucide-react';

export function AdminModal({ title, children, onClose, footer = null, wide = false }) {
  return (
    <div className="adminModalOverlay" role="presentation">
      <div className={wide ? 'adminModalCard wide' : 'adminModalCard'} role="dialog" aria-modal="true" aria-label={title}>
        <div className="adminModalHeader">
          <div>
            <span className="adminPageEyebrow">Admin action</span>
            <h3>{title}</h3>
          </div>
          <button type="button" className="adminIconButton interactive" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>
        <div className="adminModalBody">{children}</div>
        {footer ? <div className="adminModalFooter">{footer}</div> : null}
      </div>
    </div>
  );
}

export function AdminConfirmDialog({ title, description, confirmLabel = 'Confirm', onConfirm, onClose, tone = 'danger' }) {
  return (
    <AdminModal
      title={title}
      onClose={onClose}
      footer={(
        <>
          <button type="button" className="btn soft interactive" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={`btn ${tone} interactive`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      )}
    >
      <p className="adminModalCopy">{description}</p>
    </AdminModal>
  );
}
