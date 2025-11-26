export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  settings?: TenantSettings;
}

export interface TenantSettings {
  currency: string;
  timezone: string;
  language: string;
}

