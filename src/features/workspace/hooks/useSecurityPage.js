import { useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useToast } from '../../../shared/hooks/useToast.js';
import {
  fetchSecurityOverview,
  revokeSession,
  updatePassword,
  updateSecurityOverview
} from '../services/workspaceService.js';

export function useSecurityPage(navigate) {
  const toast = useToast();
  const [settings, setSettings] = useState({ twoFactorEnabled: false, loginAlerts: false, sessionLock: false });
  const [sessions, setSessions] = useState([]);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const payload = await fetchSecurityOverview();
      setSettings(payload.settings || {});
      setSessions(payload.sessions || []);
      setIsLoading(false);
    } catch (nextError) {
      setError(nextError?.message || 'Security settings could not be loaded.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      navigate(ROUTES.login);
      return;
    }

    load();
  }, [navigate]);

  const toggleSetting = async (key) => {
    const nextValue = !settings[key];
    setBusyKey(`toggle:${key}`);

    try {
      const updated = await updateSecurityOverview({ [key]: nextValue });
      setSettings((current) => ({ ...current, ...updated }));
      toast.success({
        title: 'Tehlukesizlik ayari yenilendi',
        message: 'Secdiyiniz tehlukesizlik ayari yadda saxlandi.'
      });
    } catch (nextError) {
      toast.error({
        title: 'Tehlukesizlik ayari yenilenmedi',
        message: nextError?.message || 'Tehlukesizlik ayarini yenilemek mumkun olmadi.'
      });
    } finally {
      setBusyKey('');
    }
  };

  const setPasswordFieldValue = (key, value) => {
    setPasswordForm((current) => ({ ...current, [key]: value }));
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    setBusyKey('password');

    try {
      const response = await updatePassword(passwordForm);
      const nextMessage = response?.success
        ? 'Sifreniz ugurla yenilendi.'
        : 'Sifre yenileme sorgusu qebul olundu.';

      setFeedback(nextMessage);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success({
        title: 'Sifre yenilendi',
        message: nextMessage
      });
    } catch (nextError) {
      const nextMessage = nextError?.message || 'Sifreni yenilemek mumkun olmadi.';
      setFeedback(nextMessage);
      toast.error({
        title: 'Sifre yenilenmedi',
        message: nextMessage
      });
    } finally {
      setBusyKey('');
    }
  };

  const revokeOneSession = async (sessionId) => {
    setBusyKey(`session:${sessionId}`);

    try {
      await revokeSession(sessionId);
      await load();
      toast.success({
        title: 'Sessiya baglandi',
        message: 'Secdiyiniz sessiya sistemden cixarildi.'
      });
    } catch (nextError) {
      toast.error({
        title: 'Sessiya baglanmadi',
        message: nextError?.message || 'Sessiyani baglamaq mumkun olmadi.'
      });
    } finally {
      setBusyKey('');
    }
  };

  return {
    settings,
    sessions,
    passwordForm,
    feedback,
    isLoading,
    busyKey,
    error,
    toggleSetting,
    setPasswordFieldValue,
    submitPassword,
    revokeOneSession
  };
}
