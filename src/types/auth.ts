import { Tenant } from './tenant';

export interface LoginRequest {
  email: string;
  password: string;
  tenantId?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
  tenantId: number;
  tenant?: Tenant; // Opcional, puede venir del backend o construirse desde tenantId
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'manager' | 'user';
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

