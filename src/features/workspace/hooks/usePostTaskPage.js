import { useEffect, useState } from 'react';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useToast } from '../../../shared/hooks/useToast.js';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { beginBillingCheckoutIntent } from '../../../shared/lib/storage/billingCheckoutStorage.js';
import { fetchVerificationOverview } from '../../verification/services/verificationService.js';
import { fetchPostTaskMeta, fetchWorkspaceSubscriptionOverview, submitTask } from '../services/workspaceService.js';

const emptyMeta = { categories: [], durations: [], budgetTypes: [], suggestedSkills: [] };

const initialForm = {
  title: '',
  category: '',
  budgetType: '',
  budget: '',
  duration: '',
  skills: '',
  description: '',
  imageUrls: []
};

function getUpgradePlanKey(subscriptionOverview) {
  const currentPlanKey = String(subscriptionOverview?.currentPlanKey || 'free').toLowerCase();

  if (currentPlanKey === 'starter') {
    return 'growth';
  }

  if (currentPlanKey === 'growth') {
    return 'growth';
  }

  return 'starter';
}

function buildPublishLimitMessage(subscriptionOverview) {
  const planName = subscriptionOverview?.currentPlanName || 'Free';
  const limit = Number(subscriptionOverview?.maxActivePublishedJobs || 0);

  if (!limit) {
    return 'Cari paketiniz yeni is elani paylasmaga imkan vermir. Davam etmek ucun paketinizi yenileyin.';
  }

  return `${planName} paketiniz maksimum ${limit} aktiv is elani ucun nezerde tutulub. Yeni elan paylasmaq ucun paketinizi yenileyin.`;
}

function normalizeSubmitErrorMessage(error, subscriptionOverview) {
  const nextMessage = String(error?.message || '').trim();

  if (!nextMessage) {
    return 'Is paylasimini yaratmaq mumkun olmadi.';
  }

  if (nextMessage.toLowerCase().includes('upgrade your plan to publish more') || nextMessage.toLowerCase().includes('plan allows up to')) {
    return buildPublishLimitMessage(subscriptionOverview);
  }

  return nextMessage;
}

function validateTaskForm(form) {
  if (!String(form?.title || '').trim()) {
    return 'Task title hissesi bos qala bilmez.';
  }

  if (!String(form?.category || '').trim()) {
    return 'Category secmelisiniz.';
  }

  if (!String(form?.budgetType || '').trim()) {
    return 'Budget type secmelisiniz.';
  }

  if (!String(form?.budget || '').trim()) {
    return 'Budget daxil etmelisiniz.';
  }

  if (!String(form?.duration || '').trim()) {
    return 'Timeline secmelisiniz.';
  }

  if (!String(form?.description || '').trim()) {
    return 'Description hissesi bos qala bilmez.';
  }

  return '';
}

export function usePostTaskPage(navigate) {
  const toast = useToast();
  const [meta, setMeta] = useState(emptyMeta);
  const [verificationOverview, setVerificationOverview] = useState(null);
  const [subscriptionOverview, setSubscriptionOverview] = useState(null);
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
        let nextSubscriptionOverview = null;

        try {
          nextSubscriptionOverview = await fetchWorkspaceSubscriptionOverview();
        } catch {
          nextSubscriptionOverview = null;
        }

        if (cancelled) {
          return;
        }

        setVerificationOverview(overview);
        setSubscriptionOverview(nextSubscriptionOverview);

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

  const openUpgradeFlow = () => {
    const nextPlanKey = getUpgradePlanKey(subscriptionOverview);

    beginBillingCheckoutIntent({
      planKey: nextPlanKey,
      billingPeriod: 'monthly',
      entryRoute: ROUTES.login,
      source: 'post-task-limit'
    });

    navigate(ROUTES.billing);
  };

  const submit = async (event, mode = 'publish') => {
    event.preventDefault();
    setBusyKey(mode);
    setFeedback('');

    const validationMessage = validateTaskForm(form);

    if (validationMessage) {
      setFeedback(validationMessage);
      setBusyKey('');
      toast.error({
        title: mode === 'draft' ? 'Qaralama saxlanmadi' : 'Is paylasimi hazir deyil',
        message: validationMessage
      });
      return;
    }

    if (mode === 'publish' && subscriptionOverview && !subscriptionOverview.canPublishMore) {
      const nextMessage = buildPublishLimitMessage(subscriptionOverview);
      setFeedback(nextMessage);
      setBusyKey('');
      toast.error({
        title: 'Elan limiti dolub',
        message: nextMessage
      });
      return;
    }

    try {
      const createdTask = await submitTask(form, mode);

      if (mode === 'draft') {
        const successMessage = 'Elaniniz qaralama kimi yadda saxlandi.';
        setFeedback(successMessage);
        toast.success({
          title: 'Qaralama saxlanildi',
          message: successMessage
        });
      } else {
        const taskTitle = createdTask?.title || form.title || 'Is paylasiminiz';
        toast.success({
          title: 'Is paylasimi ugurlu oldu',
          message: `${taskTitle} ugurla paylasildi ve indi My Orders & Jobs bolmesinde gorunur.`
        });
        navigate(ROUTES.orders);
        return;
      }
    } catch (nextError) {
      const nextMessage = normalizeSubmitErrorMessage(nextError, subscriptionOverview);
      setFeedback(nextMessage);
      toast.error({
        title: 'Is paylasimi ugursuz oldu',
        message: nextMessage
      });
    } finally {
      setBusyKey('');
    }
  };

  return {
    meta,
    verificationOverview,
    subscriptionOverview,
    form,
    feedback,
    busyKey,
    isLoading,
    error,
    canPublishNow: subscriptionOverview ? Boolean(subscriptionOverview.canPublishMore) : true,
    setFieldValue,
    openUpgradeFlow,
    submit
  };
}
