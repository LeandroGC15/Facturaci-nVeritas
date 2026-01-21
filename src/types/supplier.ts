export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  rucNit?: string;
  tenantId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSupplierRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  rucNit?: string;
}

export interface UpdateSupplierRequest extends Partial<CreateSupplierRequest> {
  id: number;
}

export interface SuppliersListResponse {
  suppliers: Supplier[];
  total: number;
  page: number;
  limit: number;
}