import { useState } from 'react';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useI18n } from '../../../shared/i18n/I18nProvider.jsx';
import { useToast } from '../../../shared/hooks/useToast.js';
import { requestPasswordResetCode, resetPasswordWithCode } from '../services/authService.js';

const initialFormState = {
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
};

export function useForgotPasswordForm(navigate) {
  const { t } = useI18n();
  const toast = useToast();
  const [form, setForm] = useState(initialFormState);
  const [activeStep, setActiveStep] = useState('request');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });
  const [sentToEmail, setSentToEmail] = useState('');

  const setFieldValue = (fieldName, value) => {
    setForm((currentState) => ({
      ...currentState,
      [fieldName]:
        fieldName === 'code'
          ? String(value || '').replace(/\D/g, '').slice(0, 4)
          : value
    }));
  };

  const clearFeedback = () => {
    setFeedback({ type: '', message: '' });
  };

  const goToLogin = () => {
    navigate(ROUTES.login);
  };

  const goToRequestStep = () => {
    clearFeedback();
    setActiveStep('request');
  };

  const submitEmailStep = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    clearFeedback();

    try {
      const response = await requestPasswordResetCode({ email: form.email });
      const nextMessage = response.message || t('Verification code sent to your email.');

      setSentToEmail(response.email || form.email);
      setActiveStep('reset');
      setFeedback({
        type: 'success',
        message: nextMessage
      });
      toast.success({
        title: t('Code sent'),
        message: nextMessage
      });
    } catch (error) {
      const nextMessage = error?.message || t('Unable to send the verification code.');

      setFeedback({
        type: 'error',
        message: nextMessage
      });
      toast.error({
        title: t('Code not sent'),
        message: nextMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendCode = async () => {
    setIsResending(true);
    clearFeedback();

    try {
      const response = await requestPasswordResetCode({ email: form.email });
      const nextMessage = response.message || t('A new verification code was sent to your email.');

      setFeedback({
        type: 'success',
        message: nextMessage
      });
      toast.success({
        title: t('New code sent'),
        message: nextMessage
      });
    } catch (error) {
      const nextMessage = error?.message || t('Unable to resend the verification code.');

      setFeedback({
        type: 'error',
        message: nextMessage
      });
      toast.error({
        title: t('Code not sent'),
        message: nextMessage
      });
    } finally {
      setIsResending(false);
    }
  };

  const submitResetStep = async (event) => {
    event.preventDefault();

    if (!form.code.trim()) {
      const nextMessage = t('Enter the verification code from your email.');

      setFeedback({
        type: 'error',
        message: nextMessage
      });
      toast.error({
        title: t('Verification code missing'),
        message: nextMessage
      });
      return;
    }

    if (!/^\d{4}$/.test(form.code.trim())) {
      const nextMessage = t('Verification code must be 4 digits.');

      setFeedback({
        type: 'error',
        message: nextMessage
      });
      toast.error({
        title: t('Verification code missing'),
        message: nextMessage
      });
      return;
    }

    if (form.password.length < 8) {
      const nextMessage = t('Your new password must be at least 8 characters long.');

      setFeedback({
        type: 'error',
        message: nextMessage
      });
      toast.error({
        title: t('Password is too short'),
        message: nextMessage
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      const nextMessage = t('Passwords do not match.');

      setFeedback({
        type: 'error',
        message: nextMessage
      });
      toast.error({
        title: t('Passwords do not match'),
        message: nextMessage
      });
      return;
    }

    setIsSubmitting(true);
    clearFeedback();

    try {
      const response = await resetPasswordWithCode({
        email: form.email,
        code: form.code.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword
      });
      const nextMessage = response.message || t('Your password has been reset. You can sign in now.');

      setFeedback({
        type: 'success',
        message: nextMessage
      });
      toast.success({
        title: t('Password updated'),
        message: nextMessage
      });

      window.setTimeout(() => {
        navigate(ROUTES.login);
      }, 900);
    } catch (error) {
      const nextMessage = error?.message || t('Unable to reset your password right now.');

      setFeedback({
        type: 'error',
        message: nextMessage
      });
      toast.error({
        title: t('Password was not updated'),
        message: nextMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    activeStep,
    showPassword,
    showConfirmPassword,
    isSubmitting,
    isResending,
    feedback,
    sentToEmail,
    setFieldValue,
    setShowPassword,
    setShowConfirmPassword,
    submitEmailStep,
    submitResetStep,
    resendCode,
    goToRequestStep,
    goToLogin
  };
}
