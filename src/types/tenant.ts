export interface Tenant {
  id: number;
  name: string;
  domain?: string;
  settings?: TenantSettings;
}

export interface TenantSettings {
  currency: string;
  timezone: string;
  language: string;
}

