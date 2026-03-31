import { useEffect, useState } from 'react';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useI18n } from '../../../shared/i18n/I18nProvider.jsx';
import { useCountryDirectory } from '../../../shared/hooks/useCountryDirectory.js';
import { syncPhoneNumberToCountry } from '../../../shared/lib/forms/countryPhone.js';
import { useToast } from '../../../shared/hooks/useToast.js';
import {
  clearAuthenticatedUser,
  getPostLoginRedirect
} from '../../../shared/lib/storage/authStorage.js';
import { getBillingCheckoutState } from '../../../shared/lib/storage/billingCheckoutStorage.js';
import { registerUser } from '../services/authService.js';

const initialForm = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  country: '',
  phoneNumber: '',
  password: '',
  confirmPassword: ''
};

export function useRegisterForm(navigate) {
  const { t } = useI18n();
  const toast = useToast();
  const [form, setForm] = useState(initialForm);
  const { countries, isLoading: isCountriesLoading, defaultCountry } = useCountryDirectory();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    type: '',
    message: ''
  });

  function setFieldValue(fieldName, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [fieldName]: value
    }));
  }

  function setCountryValue(country) {
    setForm((currentForm) => ({
      ...currentForm,
      country,
      phoneNumber: syncPhoneNumberToCountry(
        currentForm.phoneNumber,
        currentForm.country,
        country,
        countries
      )
    }));
  }

  function navigateWithFallback(route) {
    if (typeof navigate === 'function') {
      navigate(route);
    }

    if (typeof window === 'undefined') {
      return;
    }

    window.setTimeout(() => {
      if (window.location.pathname !== route) {
        window.location.assign(route);
      }
    }, 24);
  }

  useEffect(() => {
    if (!form.country && defaultCountry?.name) {
      setFieldValue('country', defaultCountry.name);
    }
  }, [defaultCountry, form.country]);

  async function submitRegister(event) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      const nextMessage = t('Passwords do not match.');

      setFeedback({
        type: 'error',
        message: nextMessage
      });
      toast.error({
        title: t('Registration failed'),
        message: nextMessage
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({
      type: '',
      message: ''
    });

    try {
      clearAuthenticatedUser();

      const shouldContinueToBilling =
        getPostLoginRedirect() === ROUTES.billing &&
        Boolean(getBillingCheckoutState());

      await registerUser({
        name: form.firstName,
        surname: form.lastName,
        userName: form.userName,
        email: form.email,
        country: form.country,
        phoneNumber: form.phoneNumber,
        password: form.password,
        confirmPassword: form.confirmPassword
      });

      setFeedback({
        type: 'success',
        message: shouldContinueToBilling
          ? t('Registration completed. Sign in to continue to the payment page.')
          : t('Registration completed successfully. Redirecting you to sign in...')
      });
      toast.success({
        title: t('Registration completed'),
        message: shouldContinueToBilling
          ? t('Your account is ready. Sign in now and we will continue to payment.')
          : t('Your account has been created. You can sign in now.')
      });

      setForm(initialForm);
      clearAuthenticatedUser();

      window.setTimeout(() => {
        navigateWithFallback(ROUTES.login);
      }, 700);
    } catch (error) {
      const nextMessage = error?.message || t('Unable to complete registration right now.');

      setFeedback({
        type: 'error',
        message: nextMessage
      });
      toast.error({
        title: t('Registration failed'),
        message: nextMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    form,
    showPassword,
    showConfirmPassword,
    isSubmitting,
    feedback,
    countries,
    isCountriesLoading,
    setFieldValue,
    setCountryValue,
    setShowPassword,
    setShowConfirmPassword,
    submitRegister
  };
}
