import { useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import {
  fetchSecurityOverview,
  revokeSession,
  updatePassword,
  updateSecurityOverview
} from '../services/workspaceService.js';

export function useSecurityPage(navigate) {
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
    const updated = await updateSecurityOverview({ [key]: nextValue });
    setSettings((current) => ({ ...current, ...updated }));
    setBusyKey('');
  };

  const setPasswordFieldValue = (key, value) => {
    setPasswordForm((current) => ({ ...current, [key]: value }));
  };

  const submitPassword = async (event) => {
    event.preventDefault();
    setBusyKey('password');
    const response = await updatePassword(passwordForm);
    setFeedback(response?.success ? 'Password update request sent.' : 'Password update simulated.');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setBusyKey('');
  };

  const revokeOneSession = async (sessionId) => {
    setBusyKey(`session:${sessionId}`);
    await revokeSession(sessionId);
    await load();
    setBusyKey('');
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
