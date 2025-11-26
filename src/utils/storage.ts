const TOKEN_KEY = 'veritas_token';
const REFRESH_TOKEN_KEY = 'veritas_refresh_token';
const USER_KEY = 'veritas_user';
const TENANT_KEY = 'veritas_tenant';

export const storage = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  getUser: (): any | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },

  getTenant: (): any | null => {
    const tenant = localStorage.getItem(TENANT_KEY);
    return tenant ? JSON.parse(tenant) : null;
  },

  setTenant: (tenant: any): void => {
    localStorage.setItem(TENANT_KEY, JSON.stringify(tenant));
  },

  removeTenant: (): void => {
    localStorage.removeItem(TENANT_KEY);
  },

  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TENANT_KEY);
  },
};

