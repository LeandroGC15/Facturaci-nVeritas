import { useState } from 'react';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { InvoiceProduct, SearchProductsResponse } from '@/types/invoice';

export const useInvoiceProducts = () => {
  const [products, setProducts] = useState<InvoiceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setProducts([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<SearchProductsResponse>(
        `${endpoints.invoices.searchProducts}?q=${encodeURIComponent(query)}`
      );
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al buscar productos');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setProducts([]);
    setError(null);
  };

  return {
    products,
    isLoading,
    error,
    searchProducts,
    clearSearch,
  };
};

