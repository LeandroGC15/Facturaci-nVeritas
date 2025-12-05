export interface Metrics {
  totalProducts: number;
  totalInvoices: number;
  revenue: number;
  lowStockItems: number;
}

export interface TopProduct {
  id: string;
  name: string;
  quantity: number;
  total: number;
}

export interface TrendData {
  date: string;
  value: number;
  invoices: number;
}

export interface Report {
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  data: ReportData[];
}

export interface ReportData {
  date: string;
  value: number;
  count: number;
}

export interface ReportFilters {
  period: 'daily' | 'weekly' | 'monthly';
  startDate?: string;
  endDate?: string;
}

