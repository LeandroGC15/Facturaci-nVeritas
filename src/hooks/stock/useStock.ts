import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { StockItem, CreateStockItem, UpdateStockItem } from '@/types/stock';

export const useStock = () => {
  const [items, setItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStock();
  }, []);

  const fetchStock = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Descomentar cuando el backend esté listo
      // const data = await apiClient.get<StockItem[]>(endpoints.stock.list);
      
      // Datos dummy para desarrollo sin backend
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simular delay
      
      const dummyData: StockItem[] = [
        {
          id: '1',
          name: 'Producto Ejemplo 1',
          description: 'Descripción del producto ejemplo',
          sku: 'SKU-001',
          price: 99.99,
          quantity: 50,
          unit: 'unidades',
          category: 'Categoría A',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Producto Ejemplo 2',
          description: 'Otro producto de ejemplo',
          sku: 'SKU-002',
          price: 149.50,
          quantity: 30,
          unit: 'kg',
          category: 'Categoría B',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      setItems(dummyData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar stock');
    } finally {
      setIsLoading(false);
    }
  };

  const createItem = async (item: CreateStockItem) => {
    try {
      // TODO: Descomentar cuando el backend esté listo
      // const newItem = await apiClient.post<StockItem>(endpoints.stock.create, item);
      
      // Datos dummy para desarrollo sin backend
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular delay
      
      const newItem: StockItem = {
        id: Date.now().toString(),
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al crear producto');
    }
  };

  const updateItem = async (item: UpdateStockItem) => {
    try {
      // TODO: Descomentar cuando el backend esté listo
      // const updatedItem = await apiClient.put<StockItem>(
      //   endpoints.stock.update(item.id),
      //   item
      // );
      
      // Datos dummy para desarrollo sin backend
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular delay
      
      const updatedItem: StockItem = {
        ...items.find((i) => i.id === item.id)!,
        ...item,
        updatedAt: new Date().toISOString(),
      };
      
      setItems((prev) => prev.map((i) => (i.id === item.id ? updatedItem : i)));
      return updatedItem;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al actualizar producto');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      // TODO: Descomentar cuando el backend esté listo
      // await apiClient.delete(endpoints.stock.delete(id));
      
      // Datos dummy para desarrollo sin backend
      await new Promise((resolve) => setTimeout(resolve, 300)); // Simular delay
      
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Error al eliminar producto');
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

