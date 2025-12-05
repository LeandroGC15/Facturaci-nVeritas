export interface InvoiceItem {
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  productName: string;
}

export interface Invoice {
  id: number;
  total: number;
  status: string;
  userId: number;
  items: InvoiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}

export interface InvoiceSummary {
  id: number;
  total: number;
  status: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceListResponse {
  invoices: InvoiceSummary[];
  total: number;
  page: number;
  limit: number;
}

export interface InvoiceProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  createdAt: string;
  updatedAt: string;
}

export interface SearchProductsResponse {
  products: InvoiceProduct[];
}

export interface CartItem {
  product: InvoiceProduct;
  quantity: number;
  subtotal: number;
}

