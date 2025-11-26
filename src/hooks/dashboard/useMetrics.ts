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
      // TODO: Descomentar cuando el backend esté listo
      // const data = await apiClient.get<Metrics>(endpoints.dashboard.metrics);
      
      // Datos dummy para desarrollo sin backend
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simular delay
      
      const dummyData: Metrics = {
        totalInvoiced: 125000.50,
        totalInvoices: 342,
        averageInvoiceValue: 365.50,
        topProducts: [
          { id: '1', name: 'Producto A', quantity: 150, total: 45000 },
          { id: '2', name: 'Producto B', quantity: 120, total: 36000 },
          { id: '3', name: 'Producto C', quantity: 95, total: 28500 },
          { id: '4', name: 'Producto D', quantity: 80, total: 24000 },
          { id: '5', name: 'Producto E', quantity: 65, total: 19500 },
        ],
        trends: [
          { date: '2024-01-01', value: 12000, invoices: 35 },
          { date: '2024-01-02', value: 15000, invoices: 42 },
          { date: '2024-01-03', value: 18000, invoices: 50 },
        ],
      };
      
      setMetrics(dummyData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar métricas');
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

