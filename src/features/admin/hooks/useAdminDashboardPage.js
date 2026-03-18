import { useEffect, useState } from 'react';
import { fetchAdminOverview } from '../services/adminService.js';

export function useAdminDashboardPage() {
  const [overview, setOverview] = useState({ totals: { users: 0, freelancers: 0, jobs: 0, activeCategories: 0, featuredTalent: 0, activePackages: 0, mediaItems: 0 }, recentJobs: [], recentUsers: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isCancelled = false;

    async function loadOverview() {
      setIsLoading(true);
      setError('');

      try {
        const nextOverview = await fetchAdminOverview();
        if (!isCancelled) {
          setOverview(nextOverview);
        }
      } catch (nextError) {
        if (!isCancelled) {
          setError(nextError.message || 'Dashboard açıla bilmədi.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { overview, isLoading, error };
}
