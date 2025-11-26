export interface Metrics {
  totalInvoiced: number;
  totalInvoices: number;
  averageInvoiceValue: number;
  topProducts: TopProduct[];
  trends: TrendData[];
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
  invoices: number;
  total: number;
  products: number;
}

export interface ReportFilters {
  period: 'daily' | 'weekly' | 'monthly';
  startDate?: string;
  endDate?: string;
}

