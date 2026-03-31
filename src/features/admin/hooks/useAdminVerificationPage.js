import { useEffect, useMemo, useState } from 'react';
import { fetchAdminVerificationTickets, reviewAdminVerificationTicket } from '../services/adminService.js';
import { runAdminMutation } from './adminMutation.js';

export function useAdminVerificationPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    let isCancelled = false;

    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetchAdminVerificationTickets({ search, status });

        if (!isCancelled) {
          setItems(response);
        }
      } catch (nextError) {
        if (!isCancelled) {
          setError(nextError?.message || 'Verification tickets could not be loaded.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 180);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [search, status]);

  const summary = useMemo(() => ({
    total: items.length,
    pending: items.filter((item) => item.status === 'pending').length,
    approved: items.filter((item) => item.status === 'approved').length,
    rejected: items.filter((item) => item.status === 'rejected').length
  }), [items]);

  const reviewTicket = async (ticketId, values) => {
    const updatedTicket = await runAdminMutation({
      action: () => reviewAdminVerificationTicket(ticketId, values),
      setError,
      setFeedback,
      successMessage: `Verification ticket ${values.status.toLowerCase()} successfully.`,
      errorMessage: 'Verification ticket could not be reviewed.'
    });

    if (!updatedTicket) {
      return null;
    }

    setItems((current) => current.map((item) => (item.id === ticketId ? { ...item, ...updatedTicket } : item)));
    return updatedTicket;
  };

  return {
    search,
    setSearch,
    status,
    setStatus,
    items,
    summary,
    isLoading,
    error,
    feedback,
    setFeedback,
    reviewTicket
  };
}
