import { useState } from 'react';
import { registerUser } from '../services/authService.js';

const initialForm = {
  firstName: '',
  lastName: '',
  userName: '',
  email: '',
  password: '',
  confirmPassword: ''
};

export function useRegisterForm() {
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
        firstName: form.firstName,
        lastName: form.lastName,
        userName: form.userName,
        email: form.email,
        password: form.password
      });

      setFeedback({
        type: 'success',
        message: 'Registration request sent successfully.'
      });

      setForm(initialForm);
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