import { useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { fetchPostTaskMeta, submitTask } from '../services/workspaceService.js';

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
  const [meta, setMeta] = useState({ categories: [], durations: [], budgetTypes: [], suggestedSkills: [] });
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

    fetchPostTaskMeta()
      .then((payload) => {
        setMeta(payload || { categories: [], durations: [], budgetTypes: [], suggestedSkills: [] });
        setIsLoading(false);
      })
      .catch((nextError) => {
        setError(nextError?.message || 'Task creation metadata could not be loaded.');
        setIsLoading(false);
      });
  }, [navigate]);

  const setFieldValue = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event, mode = 'publish') => {
    event.preventDefault();
    setBusyKey(mode);
    try {
      await submitTask(form, mode);
      setFeedback(mode === 'draft' ? 'Draft saved successfully.' : 'Task published successfully.');
      if (mode !== 'draft') {
        setForm(initialForm);
      }
    } finally {
      setBusyKey('');
    }
  };

  return {
    meta,
    form,
    feedback,
    busyKey,
    isLoading,
    error,
    setFieldValue,
    submit
  };
}
