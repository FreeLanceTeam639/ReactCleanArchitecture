import { useEffect, useState } from 'react';
import { hasAuthenticatedSession } from '../../../shared/lib/storage/authStorage.js';
import { ROUTES } from '../../../shared/constants/routes.js';
import { fetchTransactions, fetchWalletSummary, requestWithdrawal } from '../services/workspaceService.js';

export function useWalletPage(navigate) {
  const [filters, setFilters] = useState({ type: 'all', status: 'all' });
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawalAmount, setWithdrawalAmount] = useState('250');
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
      setFeedback('Withdrawal request submitted.');
      await load();
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
