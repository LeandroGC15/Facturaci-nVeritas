import React, { createContext, useContext, ReactNode } from 'react';
import { Tenant } from '@/types/tenant';
import { useAuth } from './AuthContext';
import { storage } from '@/utils/storage';

interface TenantContextType {
  tenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { tenant } = useAuth();

  const setTenant = (newTenant: Tenant) => {
    storage.setTenant(newTenant);
  };

  const value: TenantContextType = {
    tenant,
    setTenant,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenant = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

