import { useState } from 'react';
import { loginUser } from '../services/authService.js';
import { saveAuthenticatedUser } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';

const initialFormState = {
  email: '',
  password: ''
};

export function useLoginForm(navigate) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const setFieldValue = (fieldName, value) => {
    setForm((currentState) => ({ ...currentState, [fieldName]: value }));
  };

  const clearFeedback = () => {
    setFeedback({ message: '', type: '' });
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    clearFeedback();

    try {
      const payload = await loginUser({
        email: form.email,
        password: form.password,
        rememberMe
      });

      saveAuthenticatedUser(payload, rememberMe);
      setFeedback({
        message: 'Giris ugurludur. Ana sehifeye yonlendirilirsiz...',
        type: 'success'
      });

      window.setTimeout(() => {
        navigate(ROUTES.home);
      }, 800);
    } catch (error) {
      setFeedback({
        message: error.message || 'Login sorgusu ugursuz oldu.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    showPassword,
    rememberMe,
    isSubmitting,
    feedback,
    setFieldValue,
    setShowPassword,
    setRememberMe,
    submitLogin
  };
}
