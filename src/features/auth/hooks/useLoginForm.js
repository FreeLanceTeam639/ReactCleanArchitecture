import { useState } from 'react';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useI18n } from '../../../shared/i18n/I18nProvider.jsx';
import { useToast } from '../../../shared/hooks/useToast.js';
import { getPostLoginRedirect, saveAuthenticatedUser } from '../../../shared/lib/storage/authStorage.js';
import { attachBillingCheckoutToUser, getBillingCheckoutState } from '../../../shared/lib/storage/billingCheckoutStorage.js';
import { loginUser } from '../services/authService.js';

const initialFormState = {
  emailOrUserName: '',
  password: '',
  twoFactorCode: ''
};

export function useLoginForm(navigate) {
  const { t } = useI18n();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [maskedTwoFactorEmail, setMaskedTwoFactorEmail] = useState('');
  const [form, setForm] = useState(initialFormState);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const setFieldValue = (fieldName, value) => {
    setForm((currentState) => ({ ...currentState, [fieldName]: value }));
  };

  const clearFeedback = () => {
    setFeedback({ message: '', type: '' });
  };

  const navigateWithFallback = (route) => {
    if (typeof navigate === 'function') {
      navigate(route, { replace: true });
    }

    if (typeof window === 'undefined') {
      return;
    }

    window.setTimeout(() => {
      if (window.location.pathname !== route) {
        window.location.assign(route);
      }
    }, 24);
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    clearFeedback();

    try {
      const redirectTarget = getPostLoginRedirect();
      const shouldOpenBillingAfterLogin =
        redirectTarget === ROUTES.billing &&
        Boolean(getBillingCheckoutState());
      const session = await loginUser({
        emailOrUserName: form.emailOrUserName,
        password: form.password,
        rememberMe,
        twoFactorCode: requiresTwoFactor ? form.twoFactorCode : undefined
      });

      if (session?.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setMaskedTwoFactorEmail(session.maskedEmail || '');
        setFeedback({
          message: t('Enter the verification code sent to your email.'),
          type: 'success'
        });
        toast.success({
          title: t('Verification required'),
          message: session.maskedEmail
            ? `${t('Code sent to')} ${session.maskedEmail}`
            : t('Enter the verification code sent to your email.')
        });
        return;
      }

      attachBillingCheckoutToUser(session?.user);
      saveAuthenticatedUser(session, rememberMe);
      setFeedback({
        message: shouldOpenBillingAfterLogin
          ? t('Login successful. Redirecting you to payment...')
          : t('Login successful. Redirecting you to your profile...'),
        type: 'success'
      });
      toast.success({
        title: t('Login successful'),
        message: shouldOpenBillingAfterLogin
          ? t('You have signed in. Payment page is opening now.')
          : t('You have signed in to your account.')
      });

      if (shouldOpenBillingAfterLogin && typeof navigate === 'function') {
        window.setTimeout(() => {
          navigateWithFallback(ROUTES.billing);
        }, 0);
      }
    } catch (error) {
      const nextMessage = error?.message || t('Unable to sign in right now.');

      setFeedback({
        message: nextMessage,
        type: 'error'
      });
      toast.error({
        title: t('Login failed'),
        message: nextMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    showPassword,
    rememberMe,
    requiresTwoFactor,
    maskedTwoFactorEmail,
    isSubmitting,
    feedback,
    setFieldValue,
    setShowPassword,
    setRememberMe,
    submitLogin
  };
}
