import { motion } from 'framer-motion';
import { AlertCircle, BellRing, CheckCircle2, X } from 'lucide-react';

const toastVariants = {
  initial: { opacity: 0, x: 36, y: -10, scale: 0.96 },
  animate: { opacity: 1, x: 0, y: 0, scale: 1 },
  exit: { opacity: 0, x: 28, y: -8, scale: 0.98 }
};

export default function FloatingToast({ toast, onClose }) {
  const tone = toast?.tone === 'success' || toast?.tone === 'info' ? toast.tone : 'error';
  const Icon = tone === 'success' ? CheckCircle2 : tone === 'info' ? BellRing : AlertCircle;
  const title = toast?.title || (tone === 'success'
    ? 'Ugurlu emeliyyat'
    : tone === 'info'
      ? 'Yeni yenilik'
      : 'Emeliyyat bloklandi');

  return (
    <motion.div
      className={`floatingToast ${tone}`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={toastVariants}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      role="alert"
    >
      <div className="floatingToastIcon">
        <Icon size={18} />
      </div>
      <div className="floatingToastBody">
        <strong>{title}</strong>
        <p>{toast?.message}</p>
      </div>
      <button
        type="button"
        className="floatingToastClose interactive"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
}
