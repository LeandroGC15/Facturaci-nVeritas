export interface StockItem {
  id: string;
  name: string;
  description?: string;
  sku: string;
  price: number;
  quantity: number;
  unit: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStockItem {
  name: string;
  description?: string;
  sku: string;
  price: number;
  quantity: number;
  unit: string;
  category?: string;
}

export interface UpdateStockItem extends Partial<CreateStockItem> {
  id: string;
}

export interface StockUploadResult {
  success: number;
  failed: number;
  errors: string[];
}

