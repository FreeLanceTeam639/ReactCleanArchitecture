import { useCallback, useEffect, useMemo, useState } from 'react';
import { ROUTES } from '../../../shared/constants/routes.js';
import { STORAGE_KEYS } from '../../../shared/constants/storageKeys.js';
import { useToast } from '../../../shared/hooks/useToast.js';
import { getAuthenticatedUser, hasAuthenticatedSession, setPostLoginRedirect } from '../../../shared/lib/storage/authStorage.js';
import {
  activateBillingCheckoutState,
  attachBillingCheckoutToUser,
  billingCheckoutMatchesUser,
  clearBillingCheckoutState,
  getBillingCheckoutState
} from '../../../shared/lib/storage/billingCheckoutStorage.js';
import { checkoutWorkspaceSubscription, fetchWorkspaceSubscriptionOverview } from '../services/workspaceService.js';

function normalizeBillingPeriod(value) {
  return String(value || '').toLowerCase() === 'yearly' ? 'yearly' : 'monthly';
}

function getBillingPeriodPreference() {
  if (typeof window === 'undefined') {
    return '';
  }

  const savedValue = sessionStorage.getItem(STORAGE_KEYS.billingPeriodPreference);

  if (!savedValue) {
    return '';
  }

  return normalizeBillingPeriod(savedValue);
}

function setBillingPeriodPreference(value) {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(STORAGE_KEYS.billingPeriodPreference, normalizeBillingPeriod(value));
}

function getInitialPaymentForm() {
  const sessionUser = getAuthenticatedUser()?.user || {};
  const fullName = [sessionUser.name, sessionUser.surname].filter(Boolean).join(' ').trim();

  return {
    cardholderName: fullName,
    billingEmail: sessionUser.email || '',
    billingCountry: sessionUser.country || 'Azerbaijan',
    cardNumber: '',
    expiry: '',
    cvc: '',
    termsAccepted: false,
    saveCard: false
  };
}

function getCardDigits(value) {
  return String(value || '').replace(/\D/g, '').slice(0, 19);
}

function formatCardNumber(value) {
  const digits = getCardDigits(value);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 4);

  if (digits.length < 3) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function detectCardBrand(cardNumber) {
  const digits = getCardDigits(cardNumber);

  if (/^4/.test(digits)) {
    return 'Visa';
  }

  if (/^(5[1-5]|2[2-7])/.test(digits)) {
    return 'Mastercard';
  }

  if (/^3[47]/.test(digits)) {
    return 'Amex';
  }

  if (/^6(?:011|5)/.test(digits)) {
    return 'Discover';
  }

  return 'Card';
}

function isValidCardNumber(cardNumber) {
  const digits = getCardDigits(cardNumber);

  if (digits.length < 15) {
    return false;
  }

  let sum = 0;
  let shouldDouble = false;

  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

function isFutureExpiry(expiry) {
  const [monthValue, yearValue] = String(expiry || '').split('/');
  const month = Number(monthValue);
  const year = Number(yearValue);

  if (!month || !year || month < 1 || month > 12) {
    return false;
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear() % 100;

  return year > currentYear || (year === currentYear && month >= currentMonth);
}

function validatePaymentForm(paymentForm, requiresPayment) {
  if (!requiresPayment) {
    return {};
  }

  const nextErrors = {};

  if (!paymentForm.cardholderName.trim() || paymentForm.cardholderName.trim().length < 3) {
    nextErrors.cardholderName = 'Please enter the cardholder name.';
  }

  if (!paymentForm.billingEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentForm.billingEmail.trim())) {
    nextErrors.billingEmail = 'Please enter a valid billing email.';
  }

  if (!isValidCardNumber(paymentForm.cardNumber)) {
    nextErrors.cardNumber = 'Please enter a valid card number.';
  }

  if (!isFutureExpiry(paymentForm.expiry)) {
    nextErrors.expiry = 'Please enter a valid future expiry date.';
  }

  if (!/^\d{3,4}$/.test(String(paymentForm.cvc || '').trim())) {
    nextErrors.cvc = 'Please enter a valid security code.';
  }

  if (!paymentForm.billingCountry.trim()) {
    nextErrors.billingCountry = 'Please select a billing country.';
  }

  if (!paymentForm.termsAccepted) {
    nextErrors.termsAccepted = 'Please accept the secure payment terms.';
  }

  return nextErrors;
}

export function useBillingPage(navigate) {
  const toast = useToast();
  const [overview, setOverview] = useState(null);
  const [selectedPlanKey, setSelectedPlanKeyState] = useState('starter');
  const [billingPeriod, setBillingPeriodState] = useState(getBillingPeriodPreference() || 'monthly');
  const [paymentForm, setPaymentForm] = useState(getInitialPaymentForm);
  const [paymentErrors, setPaymentErrors] = useState({});
  const [receipt, setReceipt] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busyKey, setBusyKey] = useState('');

  const setBillingPeriod = useCallback((value) => {
    const normalized = normalizeBillingPeriod(value);
    setBillingPeriodPreference(normalized);
    setBillingPeriodState(normalized);
  }, []);

  const setSelectedPlanKey = useCallback((value) => {
    setSelectedPlanKeyState(String(value || 'free').toLowerCase());
    setPaymentErrors({});
    setFeedback('');
  }, []);

  const setPaymentField = useCallback((fieldName, value) => {
    setPaymentForm((currentState) => {
      switch (fieldName) {
        case 'cardNumber':
          return { ...currentState, cardNumber: formatCardNumber(value) };
        case 'expiry':
          return { ...currentState, expiry: formatExpiry(value) };
        case 'cvc':
          return { ...currentState, cvc: String(value || '').replace(/\D/g, '').slice(0, 4) };
        case 'termsAccepted':
        case 'saveCard':
          return { ...currentState, [fieldName]: Boolean(value) };
        default:
          return { ...currentState, [fieldName]: value };
      }
    });

    setPaymentErrors((currentState) => {
      if (!currentState[fieldName]) {
        return currentState;
      }

      const nextState = { ...currentState };
      delete nextState[fieldName];
      return nextState;
    });
  }, []);

  const loadOverview = useCallback(async (checkoutState = null) => {
    setIsLoading(true);
    setError('');

    try {
      const subscriptionOverview = await fetchWorkspaceSubscriptionOverview();
      const preferredPeriod = checkoutState?.billingPeriod || getBillingPeriodPreference();
      const resolvedPeriod = preferredPeriod || subscriptionOverview?.currentBillingPeriod || 'monthly';

      setOverview(subscriptionOverview);
      setBillingPeriod(resolvedPeriod);
      setSelectedPlanKeyState((currentValue) => {
        const availablePlanKeys = (subscriptionOverview?.plans || []).map((item) => item.key);
        const preferredPlanKey = checkoutState?.planKey;

        if (preferredPlanKey && availablePlanKeys.includes(preferredPlanKey)) {
          return preferredPlanKey;
        }

        if (availablePlanKeys.includes(currentValue)) {
          return currentValue;
        }

        if ((subscriptionOverview?.currentPlanKey || 'free') === 'free') {
          return availablePlanKeys.includes('starter') ? 'starter' : availablePlanKeys[0] || 'free';
        }

        return subscriptionOverview?.currentPlanKey || availablePlanKeys[0] || 'free';
      });
    } catch (nextError) {
      setError(nextError?.message || 'Subscription details could not be loaded.');
      setOverview(null);
    } finally {
      setIsLoading(false);
    }
  }, [setBillingPeriod]);

  useEffect(() => {
    const checkoutState = getBillingCheckoutState();
    const currentUser = getAuthenticatedUser()?.user || null;

    if (!checkoutState) {
      toast.error({
        title: 'Billing access locked',
        message: 'Payment page can only be opened from a subscription flow.'
      });
      navigate(hasAuthenticatedSession() ? ROUTES.profile : ROUTES.home);
      return;
    }

    if (!hasAuthenticatedSession()) {
      setPostLoginRedirect(ROUTES.billing);
      navigate(ROUTES.login);
      return;
    }

    if (currentUser && !billingCheckoutMatchesUser(currentUser)) {
      clearBillingCheckoutState();
      toast.error({
        title: 'Checkout session expired',
        message: 'Secure payment session belongs to a different account. Please start the subscription flow again.'
      });
      navigate(ROUTES.home);
      return;
    }

    attachBillingCheckoutToUser(currentUser);
    const activeCheckoutState = activateBillingCheckoutState(currentUser);
    loadOverview(activeCheckoutState);
  }, [loadOverview, navigate, toast]);

  const selectedPlan = useMemo(() => (
    (overview?.plans || []).find((item) => item.key === selectedPlanKey) || null
  ), [overview?.plans, selectedPlanKey]);

  const currentCharge = useMemo(() => (
    billingPeriod === 'yearly'
      ? Number(selectedPlan?.yearlyPrice || 0)
      : Number(selectedPlan?.monthlyPrice || 0)
  ), [billingPeriod, selectedPlan?.monthlyPrice, selectedPlan?.yearlyPrice]);

  const isPaidPlan = currentCharge > 0 && selectedPlanKey !== 'free';
  const cardBrand = useMemo(() => detectCardBrand(paymentForm.cardNumber), [paymentForm.cardNumber]);

  const submitCheckout = async (event) => {
    event.preventDefault();
    setBusyKey('checkout');
    setFeedback('');

    const nextErrors = validatePaymentForm(paymentForm, isPaidPlan);

    if (Object.keys(nextErrors).length > 0) {
      setPaymentErrors(nextErrors);
      setBusyKey('');
      toast.error({
        title: 'Payment details incomplete',
        message: 'Please complete the card form before continuing.'
      });
      return;
    }

    try {
      const result = await checkoutWorkspaceSubscription({
        planKey: selectedPlanKey,
        billingPeriod,
        paymentMethod: isPaidPlan ? 'card' : 'none',
        cardholderName: isPaidPlan ? paymentForm.cardholderName.trim() : '',
        billingEmail: isPaidPlan ? paymentForm.billingEmail.trim() : '',
        cardLast4: isPaidPlan ? getCardDigits(paymentForm.cardNumber).slice(-4) : '',
        cardBrand: isPaidPlan ? cardBrand : '',
        billingCountry: isPaidPlan ? paymentForm.billingCountry.trim() : ''
      });

      setOverview(result?.overview || null);
      setReceipt({
        amountPaid: Number(result?.amountPaid || 0),
        currency: result?.currency || 'USD',
        paymentMethod: result?.paymentMethod || (isPaidPlan ? `${cardBrand} **** ${getCardDigits(paymentForm.cardNumber).slice(-4)}` : 'No payment required'),
        receiptNumber: result?.receiptNumber || '',
        processedAt: result?.processedAt || ''
      });
      setFeedback(result?.message || 'Subscription updated successfully.');
      setPaymentErrors({});
      setPaymentForm((currentState) => ({
        ...currentState,
        cardNumber: '',
        expiry: '',
        cvc: '',
        termsAccepted: currentState.termsAccepted
      }));
      toast.success({
        title: isPaidPlan ? 'Payment approved' : 'Plan updated',
        message: result?.message || 'Your plan was activated successfully.'
      });
    } catch (nextError) {
      const nextMessage = nextError?.message || 'Subscription update failed.';
      setFeedback(nextMessage);
      toast.error({
        title: 'Payment failed',
        message: nextMessage
      });
    } finally {
      setBusyKey('');
    }
  };

  return {
    overview,
    selectedPlan,
    selectedPlanKey,
    billingPeriod,
    paymentForm,
    paymentErrors,
    receipt,
    currentCharge,
    isPaidPlan,
    cardBrand,
    isLoading,
    error,
    feedback,
    busyKey,
    setSelectedPlanKey,
    setBillingPeriod,
    setPaymentField,
    submitCheckout
  };
}
