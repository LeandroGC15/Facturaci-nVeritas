import { useState } from 'react';
import { CreatePurchaseRequest, PurchaseInvoice } from '@/types/purchase';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';

export const useCreatePurchase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPurchase = async (data: CreatePurchaseRequest): Promise<PurchaseInvoice> => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.post<PurchaseInvoice>(
        endpoints.purchases.create,
        data
      );

      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creating purchase';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    createPurchase,
    loading,
    error,
  };
};