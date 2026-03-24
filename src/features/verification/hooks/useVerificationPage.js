import { useEffect, useState } from 'react';
import { ROUTES } from '../../../shared/constants/routes.js';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { fetchVerificationOverview, submitVerificationTicket } from '../services/verificationService.js';

const initialForm = {
  subject: '',
  message: '',
  portfolioUrl: ''
};

export function useVerificationPage(navigate) {
  const [overview, setOverview] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busyKey, setBusyKey] = useState('');

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      navigate(ROUTES.login);
      return;
    }

    let cancelled = false;

    fetchVerificationOverview()
      .then((payload) => {
        if (!cancelled) {
          setOverview(payload);
          setIsLoading(false);
        }
      })
      .catch((nextError) => {
        if (!cancelled) {
          setError(nextError?.message || 'Verification status could not be loaded.');
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  const setFieldValue = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusyKey('submit');
    setFeedback('');

    try {
      const nextOverview = await submitVerificationTicket(form);
      setOverview(nextOverview);
      setForm(initialForm);
      setFeedback('Verification request submitted successfully.');
    } catch (nextError) {
      setFeedback(nextError?.message || 'Verification request could not be submitted.');
    } finally {
      setBusyKey('');
    }
  };

  return {
    overview,
    form,
    isLoading,
    error,
    feedback,
    busyKey,
    setFieldValue,
    submit
  };
}
