import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { Metrics } from '@/types/dashboard';

export const useMetrics = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Metrics>(endpoints.dashboard.metrics);
      setMetrics(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al cargar métricas');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    metrics,
    isLoading,
    error,
    refetch: fetchMetrics,
  };
};

