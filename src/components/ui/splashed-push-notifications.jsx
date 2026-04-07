import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BellRing,
  CheckCheck,
  MessageCircleQuestion,
  ShieldX,
  X,
  Zap
} from 'lucide-react';

const DEFAULT_DURATION = 5000;

const ICONS = {
  success: CheckCheck,
  help: MessageCircleQuestion,
  warning: Zap,
  error: ShieldX,
  info: BellRing
};

function resolveType(value) {
  if (value === 'success' || value === 'warning' || value === 'error' || value === 'help') {
    return value;
  }

  return 'info';
}

function createToastItem(type, title, content, direction = 'ltr') {
  return {
    id: `splashed-toast-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    tone: resolveType(type),
    title: String(title || '').trim(),
    message: String(content || '').trim(),
    duration: DEFAULT_DURATION,
    direction
  };
}

function SplashedToastCard({ item, direction = 'ltr', onDismiss, timerColor, timerBgColor }) {
  const Icon = ICONS[item?.tone] || ICONS.info;
  const isRtl = direction === 'rtl';

  return (
    <motion.article
      className={`splashedToast ${item?.tone || 'info'} ${isRtl ? 'rtl' : ''}`}
      initial={{ opacity: 0, x: isRtl ? -80 : 80, y: 18, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: isRtl ? -90 : 90, y: 12, scale: 0.97 }}
      transition={{ duration: 0.42, ease: [0.2, 0.84, 0.28, 1] }}
      role="alert"
    >
      <div className="splashedToastOrb" aria-hidden="true">
        <Icon size={21} strokeWidth={2.2} />
      </div>

      <button
        type="button"
        className="splashedToastClose interactive"
        onClick={() => onDismiss(item?.id)}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>

      <div className="splashedToastBody">
        {item?.title ? <strong>{item.title}</strong> : null}
        {item?.message ? <p>{item.message}</p> : null}
      </div>

      <div
        className="splashedToastTimerTrack"
        style={{
          '--splashed-toast-timer': timerColor || 'rgba(255,255,255,0.82)',
          '--splashed-toast-timer-bg': timerBgColor || 'rgba(255,255,255,0.26)'
        }}
      >
        <span
          className="splashedToastTimerBar"
          style={{ animationDuration: `${Number(item?.duration) > 0 ? item.duration : DEFAULT_DURATION}ms` }}
        />
      </div>
    </motion.article>
  );
}

export const SplashedPushNotifications = forwardRef(function SplashedPushNotifications(
  {
    notifications = [],
    rtlNotifications = [],
    onDismiss,
    timerColor,
    timerBgColor
  },
  ref
) {
  const [localNotifications, setLocalNotifications] = useState([]);

  const dismissLocalNotification = useCallback((toastId) => {
    setLocalNotifications((current) => current.filter((item) => item.id !== toastId));
  }, []);

  const dismissNotification = useCallback((toastId) => {
    if (typeof onDismiss === 'function') {
      onDismiss(toastId);
      return;
    }

    dismissLocalNotification(toastId);
  }, [dismissLocalNotification, onDismiss]);

  const createNotification = useCallback((type, title, content) => {
    const nextToast = createToastItem(type, title, content, 'ltr');
    setLocalNotifications((current) => [...current.slice(-2), nextToast]);
    return nextToast.id;
  }, []);

  const createRtlNotification = useCallback((type, title, content) => {
    const nextToast = createToastItem(type, title, content, 'rtl');
    setLocalNotifications((current) => [...current.slice(-2), nextToast]);
    return nextToast.id;
  }, []);

  useImperativeHandle(ref, () => ({
    createNotification,
    createRtlNotification
  }), [createNotification, createRtlNotification]);

  useEffect(() => {
    if (!localNotifications.length) {
      return () => {};
    }

    const timeoutIds = localNotifications.map((item) => (
      window.setTimeout(() => {
        dismissLocalNotification(item.id);
      }, Number(item?.duration) > 0 ? item.duration : DEFAULT_DURATION)
    ));

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [dismissLocalNotification, localNotifications]);

  const mergedLtrNotifications = useMemo(() => (
    [...notifications, ...localNotifications.filter((item) => item.direction !== 'rtl')]
  ), [localNotifications, notifications]);

  const mergedRtlNotifications = useMemo(() => (
    [...rtlNotifications, ...localNotifications.filter((item) => item.direction === 'rtl')]
  ), [localNotifications, rtlNotifications]);

  return (
    <>
      <div className="splashedToastStack" aria-live="polite" aria-atomic="true">
        <AnimatePresence initial={false}>
          {mergedLtrNotifications.map((item) => (
            <SplashedToastCard
              key={item.id}
              item={item}
              onDismiss={dismissNotification}
              timerColor={timerColor}
              timerBgColor={timerBgColor}
            />
          ))}
        </AnimatePresence>
      </div>

      {mergedRtlNotifications.length ? (
        <div className="splashedToastStack rtl" aria-live="polite" aria-atomic="true">
          <AnimatePresence initial={false}>
            {mergedRtlNotifications.map((item) => (
              <SplashedToastCard
                key={item.id}
                item={item}
                direction="rtl"
                onDismiss={dismissNotification}
                timerColor={timerColor}
                timerBgColor={timerBgColor}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : null}
    </>
  );
});

export default SplashedPushNotifications;
