import { useState } from 'react';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { Report, ReportFilters } from '@/types/dashboard';

export const useReports = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async (filters: ReportFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append('period', filters.period);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      const data = await apiClient.get<Report>(
        `${endpoints.dashboard.reports}?${params.toString()}`
      );
      setReport(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al cargar reportes');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    report,
    isLoading,
    error,
    fetchReports,
  };
};

