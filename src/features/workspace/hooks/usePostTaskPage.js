import { useEffect, useState } from 'react';
import { ROUTES } from '../../../shared/constants/routes.js';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { fetchVerificationOverview } from '../../verification/services/verificationService.js';
import { fetchPostTaskMeta, submitTask } from '../services/workspaceService.js';

const emptyMeta = { categories: [], durations: [], budgetTypes: [], suggestedSkills: [] };

const initialForm = {
  title: '',
  category: 'Frontend Development',
  budgetType: 'Fixed Price',
  budget: '1200',
  duration: '2 weeks',
  skills: 'React, Tailwind, REST API',
  description: ''
};

export function usePostTaskPage(navigate) {
  const [meta, setMeta] = useState(emptyMeta);
  const [verificationOverview, setVerificationOverview] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState('');
  const [busyKey, setBusyKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      navigate(ROUTES.login);
      return;
    }

    let cancelled = false;

    async function loadPage() {
      setIsLoading(true);
      setError('');

      try {
        const overview = await fetchVerificationOverview();

        if (cancelled) {
          return;
        }

        setVerificationOverview(overview);

        if (!overview?.isVerified) {
          setMeta(emptyMeta);
          setIsLoading(false);
          return;
        }

        const payload = await fetchPostTaskMeta();

        if (cancelled) {
          return;
        }

        const nextMeta = payload || emptyMeta;
        setMeta(nextMeta);
        setForm((current) => ({
          ...current,
          category: nextMeta.categories[0] || current.category,
          budgetType: nextMeta.budgetTypes[0] || current.budgetType,
          duration: nextMeta.durations[0] || current.duration
        }));
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError?.message || 'Task creation page could not be loaded.');
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const setFieldValue = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event, mode = 'publish') => {
    event.preventDefault();
    setBusyKey(mode);
    setFeedback('');

    try {
      await submitTask(form, mode);
      setFeedback(mode === 'draft' ? 'Draft saved successfully.' : 'Task published successfully.');
      if (mode !== 'draft') {
        setForm((current) => ({
          ...initialForm,
          category: meta.categories[0] || initialForm.category,
          budgetType: meta.budgetTypes[0] || initialForm.budgetType,
          duration: meta.durations[0] || initialForm.duration
        }));
      }
    } catch (nextError) {
      setFeedback(nextError?.message || 'Task could not be created.');
    } finally {
      setBusyKey('');
    }
  };

  return {
    meta,
    verificationOverview,
    form,
    feedback,
    busyKey,
    isLoading,
    error,
    setFieldValue,
    submit
  };
}
