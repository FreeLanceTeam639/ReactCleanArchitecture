import { useState } from 'react';
import { registerUser } from '../services/authService.js';
import { ROUTES } from '../../../shared/constants/routes.js';

const initialForm = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'Client'
};

export function useRegisterForm(navigate) {
  const [form, setForm] = useState(initialForm);
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

  async function submitRegister(event) {
    event.preventDefault();

    if (form.password !== form.confirmPassword) {
      setFeedback({
        type: 'error',
        message: 'Passwords do not match.'
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({
      type: '',
      message: ''
    });

    try {
      await registerUser({
        name: form.firstName,
        surname: form.lastName,
        userName: form.userName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        role: form.role
      });

      setFeedback({
        type: 'success',
        message: 'Registration completed successfully. Redirecting to sign in...'
      });

      setForm(initialForm);

      window.setTimeout(() => {
        navigate(ROUTES.login);
      }, 700);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error?.message || 'Registration failed.'
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
    setFieldValue,
    setShowPassword,
    setShowConfirmPassword,
    submitRegister
  };
}
