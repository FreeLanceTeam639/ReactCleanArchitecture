import { useState } from 'react';
import { loginUser } from '../services/authService.js';
import { saveAuthenticatedUser } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';

const initialFormState = {
  emailOrUserName: '',
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

  const resolveLoginRoute = (session) => {
    const roles = session?.user?.roles || [];
    return roles.some((role) => String(role).toLowerCase() === 'admin') ? ROUTES.admin : ROUTES.profile;
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    clearFeedback();

    try {
      const session = await loginUser({
        emailOrUserName: form.emailOrUserName,
        password: form.password,
        rememberMe
      });

      saveAuthenticatedUser(session, rememberMe);
      setFeedback({
        message: 'Giriş uğurludur. Profilə yönləndirilirsiniz...',
        type: 'success'
      });

      window.setTimeout(() => {
        navigate(resolveLoginRoute(session));
      }, 500);
    } catch (error) {
      setFeedback({
        message: error.message || 'Login sorgusu uğursuz oldu.',
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
