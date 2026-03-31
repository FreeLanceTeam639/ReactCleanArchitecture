import { useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { useToast } from '../../../shared/hooks/useToast.js';
import { fetchTransactions, fetchWalletSummary, requestWithdrawal } from '../services/workspaceService.js';

export function useWalletPage(navigate) {
  const toast = useToast();
  const [filters, setFilters] = useState({ type: 'all', status: 'all' });
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
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
    withdrawalAmount,
    feedback,
    isLoading,
    busyKey,
    error,
    setWithdrawalAmount,
    setFilterValue,
    submitWithdrawal
  };
}
