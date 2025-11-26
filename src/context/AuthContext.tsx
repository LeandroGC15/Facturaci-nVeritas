import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, LoginResponse } from '@/types/auth';
import { Tenant } from '@/types/tenant';
import { apiClient } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import { storage } from '@/utils/storage';

interface AuthContextType {
  user: User | null;
  tenant: Tenant | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedUser = storage.getUser();
    const savedTenant = storage.getTenant();
    const savedToken = storage.getToken();

    if (savedUser && savedTenant && savedToken) {
      setUser(savedUser);
      setTenant(savedTenant);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      // TODO: Descomentar cuando el backend esté listo
      // const response: LoginResponse = await apiClient.post(endpoints.auth.login, credentials);
      
      // Datos dummy para desarrollo sin backend
      const dummyResponse: LoginResponse = {
        token: 'dummy-jwt-token-' + Date.now(),
        refreshToken: 'dummy-refresh-token-' + Date.now(),
        user: {
          id: '1',
          email: credentials.email,
          name: credentials.email.split('@')[0] || 'Usuario',
          role: 'admin',
        },
        tenant: {
          id: 'tenant-1',
          name: credentials.tenantId || 'Mi Empresa',
          domain: credentials.email.split('@')[1] || 'example.com',
          settings: {
            currency: 'USD',
            timezone: 'America/Lima',
            language: 'es',
          },
        },
      };

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 500));

      storage.setToken(dummyResponse.token);
      if (dummyResponse.refreshToken) {
        storage.setRefreshToken(dummyResponse.refreshToken);
      }
      storage.setUser(dummyResponse.user);
      storage.setTenant(dummyResponse.tenant);

      setUser(dummyResponse.user);
      setTenant(dummyResponse.tenant);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    storage.clear();
    setUser(null);
    setTenant(null);
  };

  const value: AuthContextType = {
    user,
    tenant,
    isAuthenticated: !!user && !!tenant,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

