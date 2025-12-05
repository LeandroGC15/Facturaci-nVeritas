const TOKEN_KEY = 'veritas_token';
const REFRESH_TOKEN_KEY = 'veritas_refresh_token';
const USER_KEY = 'veritas_user';
const TENANT_KEY = 'veritas_tenant';

// Usar sessionStorage en lugar de localStorage para que cada pestaña tenga su propia sesión
// Esto evita que los datos se mezclen cuando hay múltiples usuarios abiertos en diferentes pestañas
const storageAPI = sessionStorage;

export const storage = {
  getToken: (): string | null => {
    return storageAPI.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    storageAPI.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    storageAPI.removeItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return storageAPI.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    storageAPI.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken: (): void => {
    storageAPI.removeItem(REFRESH_TOKEN_KEY);
  },

  getUser: (): any | null => {
    try {
      const user = storageAPI.getItem(USER_KEY);
      if (!user || user === 'undefined' || user === 'null') {
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user from storage:', error);
      return null;
    }
  },

  setUser: (user: any): void => {
    if (user === null || user === undefined) {
      storageAPI.removeItem(USER_KEY);
      return;
    }
    storageAPI.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    storageAPI.removeItem(USER_KEY);
  },

  getTenant: (): any | null => {
    try {
      const tenant = storageAPI.getItem(TENANT_KEY);
      if (!tenant || tenant === 'undefined' || tenant === 'null') {
        return null;
      }
      return JSON.parse(tenant);
    } catch (error) {
      console.error('Error parsing tenant from storage:', error);
      return null;
    }
  },

  setTenant: (tenant: any): void => {
    if (tenant === null || tenant === undefined) {
      storageAPI.removeItem(TENANT_KEY);
      return;
    }
    storageAPI.setItem(TENANT_KEY, JSON.stringify(tenant));
  },

  removeTenant: (): void => {
    storageAPI.removeItem(TENANT_KEY);
  },

  clear: (): void => {
    storageAPI.removeItem(TOKEN_KEY);
    storageAPI.removeItem(REFRESH_TOKEN_KEY);
    storageAPI.removeItem(USER_KEY);
    storageAPI.removeItem(TENANT_KEY);
  },
};

