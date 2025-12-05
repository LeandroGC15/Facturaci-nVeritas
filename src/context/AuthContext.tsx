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
      const response: LoginResponse = await apiClient.post(endpoints.auth.login, {
        email: credentials.email,
        password: credentials.password,
      });

      // Usar el tenant de la respuesta
      const tenant: Tenant = response.tenant;

      storage.setToken(response.token);
      storage.setUser(response.user);
      storage.setTenant(tenant);

      setUser(response.user);
      setTenant(tenant);
    } catch (error: any) {
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

