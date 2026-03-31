const APP_TOAST_EVENT = 'freelanceaze:app-toast';

export function emitToastEvent(payload) {
  if (typeof window === 'undefined' || !payload?.message) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(APP_TOAST_EVENT, {
      detail: payload
    })
  );
}

export function subscribeToToastEvents(listener) {
  if (typeof window === 'undefined' || typeof listener !== 'function') {
    return () => {};
  }

  const handleToastEvent = (event) => {
    listener(event.detail || null);
  };

  window.addEventListener(APP_TOAST_EVENT, handleToastEvent);

  return () => {
    window.removeEventListener(APP_TOAST_EVENT, handleToastEvent);
  };
}
