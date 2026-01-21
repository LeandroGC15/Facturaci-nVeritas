export interface PurchaseItem {
  productId: number;
  productName: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export interface PurchaseInvoice {
  id: number;
  invoiceNumber: string;
  total: number;
  status: string;
  paymentMethod?: string;
  dueDate?: string;
  paidAmount: number;
  supplierId: number;
  tenantId: number;
  userId: number;
  items: PurchaseItemDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseItemDTO {
  id: number;
  purchaseInvoiceId: number;
  productId: number;
  quantity: number;
  unitCost: number;
  subtotal: number;
}

export interface CreatePurchaseRequest {
  supplierId: number;
  invoiceNumber: string;
  paymentMethod?: string;
  dueDate?: string;
  items: PurchaseItemRequest[];
}

export interface PurchaseItemRequest {
  productId: number;
  quantity: number;
  unitCost: number;
  // For new products
  productName?: string;
  productSku?: string;
  productPrice?: number;
}