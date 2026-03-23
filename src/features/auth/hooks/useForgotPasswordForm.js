import { useState } from 'react';
import { requestPasswordResetCode, resetPasswordWithCode } from '../services/authService.js';
import { ROUTES } from '../../../shared/constants/routes.js';

const initialFormState = {
  email: '',
  code: '',
  password: '',
  confirmPassword: ''
};

export function useForgotPasswordForm(navigate) {
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
      [fieldName]: value
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

      setSentToEmail(response.email || form.email);
      setActiveStep('reset');
      setFeedback({
        type: 'success',
        message: response.message || 'Verification code sent to your email.'
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error?.message || 'Verification code could not be sent.'
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

      setFeedback({
        type: 'success',
        message: response.message || 'A new verification code was sent.'
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error?.message || 'Verification code could not be resent.'
      });
    } finally {
      setIsResending(false);
    }
  };

  const submitResetStep = async (event) => {
    event.preventDefault();

    if (!form.code.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please enter the verification code sent to your email.'
      });
      return;
    }

    if (form.password.length < 8) {
      setFeedback({
        type: 'error',
        message: 'New password must be at least 8 characters long.'
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      setFeedback({
        type: 'error',
        message: 'Passwords do not match.'
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

      setFeedback({
        type: 'success',
        message: response.message || 'Password reset completed successfully. Redirecting to sign in...'
      });

      window.setTimeout(() => {
        navigate(ROUTES.login);
      }, 900);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error?.message || 'Password reset failed.'
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
