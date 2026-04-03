import { useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useToast } from '../../../shared/hooks/useToast.js';
import { createWalletTopUp, fetchTransactions, fetchWalletSummary, requestWithdrawal } from '../services/workspaceService.js';

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

  return 'Card';
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

function getInitialTopUpForm() {
  return {
    amount: '',
    currency: 'USD',
    cardholderName: '',
    billingEmail: '',
    billingCountry: 'Azerbaijan',
    cardNumber: '',
    expiry: '',
    cvc: '',
    termsAccepted: false
  };
}

function validateTopUpForm(formState) {
  const errors = {};

  if (!(Number(formState.amount) > 0)) {
    errors.amount = 'Top-up meblegini daxil edin.';
  }

  if (!formState.cardholderName.trim() || formState.cardholderName.trim().length < 3) {
    errors.cardholderName = 'Kart sahibinin adi vacibdir.';
  }

  if (!formState.billingEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.billingEmail.trim())) {
    errors.billingEmail = 'Duzgun billing email daxil edin.';
  }

  if (!isValidCardNumber(formState.cardNumber)) {
    errors.cardNumber = 'Kart nomresi etibarli deyil.';
  }

  if (!isFutureExpiry(formState.expiry)) {
    errors.expiry = 'Kart bitme tarixi yanlisdir.';
  }

  if (!/^\d{3,4}$/.test(String(formState.cvc || '').trim())) {
    errors.cvc = 'CVC kodu yanlisdir.';
  }

  if (!formState.billingCountry.trim()) {
    errors.billingCountry = 'Olke secin.';
  }

  if (!formState.termsAccepted) {
    errors.termsAccepted = 'Top-up sertlerini qebul edin.';
  }

  return errors;
}

export function useWalletPage(navigate) {
  const toast = useToast();
  const [filters, setFilters] = useState({ type: 'all', status: 'all' });
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [topUpForm, setTopUpForm] = useState(getInitialTopUpForm);
  const [topUpErrors, setTopUpErrors] = useState({});
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [busyKey, setBusyKey] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [nextSummary, nextTransactions] = await Promise.all([
        fetchWalletSummary(filters),
        fetchTransactions(filters)
      ]);
      setSummary(nextSummary || null);
      setTransactions(nextTransactions || []);
      setIsLoading(false);
    } catch (nextError) {
      setError(nextError?.message || 'Wallet data could not be loaded.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasAuthenticatedSession()) {
      navigate(ROUTES.login);
      return;
    }

    load();
  }, [filters, navigate]);

  const setFilterValue = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const setTopUpField = (fieldName, value) => {
    setTopUpForm((currentState) => {
      switch (fieldName) {
        case 'cardNumber':
          return { ...currentState, cardNumber: formatCardNumber(value) };
        case 'expiry':
          return { ...currentState, expiry: formatExpiry(value) };
        case 'cvc':
          return { ...currentState, cvc: String(value || '').replace(/\D/g, '').slice(0, 4) };
        case 'termsAccepted':
          return { ...currentState, termsAccepted: Boolean(value) };
        default:
          return { ...currentState, [fieldName]: value };
      }
    });

    setTopUpErrors((currentState) => {
      if (!currentState[fieldName]) {
        return currentState;
      }

      const nextState = { ...currentState };
      delete nextState[fieldName];
      return nextState;
    });
  };

  const submitTopUp = async (event) => {
    event.preventDefault();
    setBusyKey('topup');
    setFeedback('');

    const validationErrors = validateTopUpForm(topUpForm);
    if (Object.keys(validationErrors).length > 0) {
      setTopUpErrors(validationErrors);
      setBusyKey('');
      toast.error({
        title: 'Top-up tamamlanmadi',
        message: 'Kart ve billing melumatlarini tam doldurun.'
      });
      return;
    }

    try {
      const result = await createWalletTopUp({
        amount: topUpForm.amount,
        currency: topUpForm.currency,
        cardholderName: topUpForm.cardholderName.trim(),
        billingEmail: topUpForm.billingEmail.trim(),
        billingCountry: topUpForm.billingCountry.trim(),
        cardBrand: detectCardBrand(topUpForm.cardNumber),
        cardLast4: getCardDigits(topUpForm.cardNumber).slice(-4),
        termsAccepted: topUpForm.termsAccepted
      });

      const nextMessage = result?.message || 'Balans artirma session-u yaradildi.';
      setFeedback(nextMessage);
      setTopUpErrors({});
      setTopUpForm((currentState) => ({
        ...currentState,
        amount: '',
        cardNumber: '',
        expiry: '',
        cvc: '',
        termsAccepted: false
      }));
      toast.success({
        title: result?.status === 'completed' ? 'Balans artirildi' : 'Top-up yaradildi',
        message: nextMessage
      });
      await load();
    } catch (nextError) {
      const nextMessage = nextError?.message || 'Balansi artirmaq mumkun olmadi.';
      setFeedback(nextMessage);
      toast.error({
        title: 'Top-up alinmadi',
        message: nextMessage
      });
    } finally {
      setBusyKey('');
    }
  };

  const submitWithdrawal = async (event) => {
    event.preventDefault();
    setBusyKey('withdrawal');
    setFeedback('');

    try {
      await requestWithdrawal(withdrawalAmount);
      const nextMessage = 'Pul cixaris sorghunuz review ucun gonderildi.';
      setFeedback(nextMessage);
      setWithdrawalAmount('');
      toast.success({
        title: 'Pul cixaris sorghusu gonderildi',
        message: nextMessage
      });
      await load();
    } catch (nextError) {
      const nextMessage = nextError?.message || 'Pul cixaris sorghusunu gondermek mumkun olmadi.';
      setFeedback(nextMessage);
      toast.error({
        title: 'Pul cixaris sorghusu gonderilmedi',
        message: nextMessage
      });
    } finally {
      setBusyKey('');
    }
  };

  return {
    filters,
    summary,
    transactions,
    topUpForm,
    topUpErrors,
    withdrawalAmount,
    feedback,
    isLoading,
    busyKey,
    error,
    setTopUpField,
    setWithdrawalAmount,
    setFilterValue,
    submitTopUp,
    submitWithdrawal
  };
}
