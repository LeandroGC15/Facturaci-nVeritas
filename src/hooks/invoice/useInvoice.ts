import { useState, useEffect } from 'react';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { Invoice, CreateInvoiceRequest, InvoiceListResponse, InvoiceSummary } from '@/types/invoice';

export const useInvoice = () => {
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchInvoices = async (page: number = 1, limit: number = 20) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<InvoiceListResponse>(
        `${endpoints.invoices.list}?page=${page}&limit=${limit}`
      );
      setInvoices(data.invoices || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Error al cargar facturas');
    } finally {
      setIsLoading(false);
    }
  };

  const createInvoice = async (request: CreateInvoiceRequest): Promise<Invoice> => {
    try {
      const response = await apiClient.post<{ invoice: Invoice }>(
        endpoints.invoices.create,
        request
      );
      return response.invoice;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.response?.data?.message || 'Error al crear factura');
    }
  };

  const getInvoice = async (id: number): Promise<Invoice> => {
    try {
      const response = await apiClient.get<{ invoice: Invoice }>(
        endpoints.invoices.get(id.toString())
      );
      return response.invoice;
    } catch (err: any) {
      throw new Error(err.response?.data?.error || err.response?.data?.message || 'Error al obtener factura');
    }
  };

  return {
    invoices,
    isLoading,
    error,
    total,
    fetchInvoices,
    createInvoice,
    getInvoice,
  };
};

