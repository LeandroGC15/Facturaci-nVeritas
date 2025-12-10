export interface StockItem {
  id: number;
  name: string;
  description?: string;
  sku: string;
  price: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockItem {
  name: string;
  description?: string;
  sku?: string;
  price: number;
  stock: number;
}

export interface UpdateStockItem extends Partial<CreateStockItem> {
  id: number;
}

export interface StockUploadResult {
  imported: number;
  errors: string[];
}

export interface StockListResponse {
  products: StockItem[];
  total: number;
  page: number;
  limit: number;
}

