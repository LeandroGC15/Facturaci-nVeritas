import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { StockItem, CreateStockItem, UpdateStockItem, StockListResponse } from '@/types/stock';

export const useStock = () => {
  const [items, setItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStock = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<StockListResponse>(endpoints.stock.list);
      setItems(data.products || []);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al cargar stock');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStock();
  }, [fetchStock]);

  const createItem = async (item: CreateStockItem) => {
    try {
      const response = await apiClient.post<{ product: StockItem }>(endpoints.stock.create, item);
      const newItem = response.product;
      setItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.response?.data?.message || 'Error al crear producto');
    }
  };

  const updateItem = async (item: UpdateStockItem) => {
    try {
      const { id, ...updateData } = item;
      const response = await apiClient.put<{ product: StockItem }>(
        endpoints.stock.update(id.toString()),
        updateData
      );
      const updatedItem = response.product;
      setItems((prev) => prev.map((i) => (i.id === id ? updatedItem : i)));
      return updatedItem;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.response?.data?.message || 'Error al actualizar producto');
    }
  };

  const deleteItem = async (id: number) => {
    try {
      await apiClient.delete(endpoints.stock.delete(id.toString()));
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.response?.data?.message || 'Error al eliminar producto');
    }
  };

  return {
    items,
    isLoading,
    error,
    fetchStock,
    createItem,
    updateItem,
    deleteItem,
  };
};

