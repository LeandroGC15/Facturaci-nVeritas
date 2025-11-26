import { useState } from 'react';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { StockUploadResult } from '@/types/stock';

export const useStockUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StockUploadResult | null>(null);

  const uploadFile = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // TODO: Descomentar cuando el backend esté listo
      // const formData = new FormData();
      // formData.append('file', file);
      // const data = await apiClient.post<StockUploadResult>(
      //   endpoints.stock.upload,
      //   formData,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   }
      // );

      // Datos dummy para desarrollo sin backend
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular delay
      
      // Simular procesamiento del archivo
      const dummyResult: StockUploadResult = {
        success: Math.floor(Math.random() * 50) + 10,
        failed: Math.floor(Math.random() * 5),
        errors: Math.random() > 0.7 ? ['Algunas filas tenían formato incorrecto'] : [],
      };

      setResult(dummyResult);
      return dummyResult;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error al cargar archivo';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadFile,
    isLoading,
    error,
    result,
  };
};

