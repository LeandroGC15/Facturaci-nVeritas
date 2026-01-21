import { useState, useEffect } from 'react';
import { Supplier, SuppliersListResponse } from '@/types/supplier';
import { apiClient } from '@/api/client';

export const useSuppliers = (page: number = 1, limit: number = 20) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get<SuppliersListResponse>(
        `/suppliers?page=${page}&limit=${limit}`
      );
      setSuppliers(response.suppliers);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [page, limit]);

  const refetch = () => {
    fetchSuppliers();
  };

  return {
    suppliers,
    total,
    loading,
    error,
    refetch,
  };
};