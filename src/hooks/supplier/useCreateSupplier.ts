import { useState } from 'react';
import { CreateSupplierRequest, Supplier } from '@/types/supplier';
import { apiClient } from '@/api/client';

export const useCreateSupplier = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSupplier = async (data: CreateSupplierRequest): Promise<Supplier> => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.post<Supplier>('/suppliers', data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating supplier';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createSupplier,
    loading,
    error,
  };
};