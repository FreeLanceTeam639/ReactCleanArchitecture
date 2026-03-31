import { emitToastEvent } from '../../../shared/ui/toast/toastBus.js';

export async function runAdminMutation({
  action,
  setError,
  setFeedback,
  successMessage = '',
  errorMessage = 'Action could not be completed.',
  afterSuccess
}) {
  setError('');

  try {
    const result = await action();

    if (typeof afterSuccess === 'function') {
      await afterSuccess(result);
    }

    if (successMessage) {
      setFeedback(successMessage);
      emitToastEvent({
        tone: 'success',
        title: 'Ugurlu emeliyyat',
        message: successMessage
      });
    }

    return result;
  } catch (error) {
    const nextMessage = error?.message || errorMessage;
    setError(nextMessage);
    emitToastEvent({
      tone: 'error',
      title: 'Emeliyyat tamamlanmadi',
      message: nextMessage
    });
    return null;
  }
}
