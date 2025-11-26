import { useState } from 'react';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { Report, ReportFilters, ReportData } from '@/types/dashboard';

export const useReports = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async (filters: ReportFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Descomentar cuando el backend esté listo
      // const params = new URLSearchParams();
      // params.append('period', filters.period);
      // if (filters.startDate) params.append('startDate', filters.startDate);
      // if (filters.endDate) params.append('endDate', filters.endDate);
      // const data = await apiClient.get<Report>(
      //   `${endpoints.dashboard.reports}?${params.toString()}`
      // );
      
      // Datos dummy para desarrollo sin backend
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simular delay
      
      const generateDummyData = (): Report => {
        const data: ReportData[] = [];
        const days = filters.period === 'daily' ? 7 : filters.period === 'weekly' ? 4 : 12;
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          data.push({
            date: date.toISOString().split('T')[0],
            invoices: Math.floor(Math.random() * 50) + 10,
            total: Math.floor(Math.random() * 20000) + 5000,
            products: Math.floor(Math.random() * 100) + 20,
          });
        }
        
        return {
          period: filters.period,
          startDate: data[0]?.date || '',
          endDate: data[data.length - 1]?.date || '',
          data,
        };
      };
      
      setReport(generateDummyData());
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar reportes');
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

