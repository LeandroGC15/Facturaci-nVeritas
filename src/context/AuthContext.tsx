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
      console.log('🔵 [AuthContext] Iniciando login...');
      const response: LoginResponse = await apiClient.post(endpoints.auth.login, {
        email: credentials.email,
        password: credentials.password,
      });

      console.log('✅ [AuthContext] Respuesta del login:', response);

      // El backend devuelve tenantId, crear un objeto tenant mínimo
      // Si la respuesta tiene tenant completo, usarlo; si no, crear uno mínimo
      if (!response.tenantId) {
        throw new Error('tenantId no recibido en la respuesta del servidor');
      }

      const tenant: Tenant = response.tenant || {
        id: response.tenantId,
        name: `Tenant ${response.tenantId}`, // Nombre temporal, se puede obtener después si es necesario
      };

      console.log('💾 [AuthContext] Guardando datos en storage...');
      storage.setToken(response.token);
      storage.setUser(response.user);
      storage.setTenant(tenant);

      console.log('👤 [AuthContext] Actualizando estado...');
      setUser(response.user);
      setTenant(tenant);
      console.log('✅ [AuthContext] Login completado exitosamente');
    } catch (error: any) {
      console.error('❌ [AuthContext] Error en login:', error);
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

