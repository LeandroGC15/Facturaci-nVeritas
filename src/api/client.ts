import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { config } from '@/config/env';
import { storage } from '@/utils/storage';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Agregar token y tenant
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = storage.getToken();
        const tenant = storage.getTenant();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        if (tenant?.id) {
          config.headers['X-Tenant-ID'] = tenant.id;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Manejo de errores
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido
          storage.clear();
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }

  get<T = any>(url: string, config?: any): Promise<T> {
    return this.client.get(url, config).then((response) => response.data);
  }

  post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.post(url, data, config).then((response) => response.data);
  }

  put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.put(url, data, config).then((response) => response.data);
  }

  patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.patch(url, data, config).then((response) => response.data);
  }

  delete<T = any>(url: string, config?: any): Promise<T> {
    return this.client.delete(url, config).then((response) => response.data);
  }
}

export const apiClient = new ApiClient();

