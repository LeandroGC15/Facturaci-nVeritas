export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },
  users: {
    create: '/users',
    list: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
  dashboard: {
    metrics: '/dashboard/metrics',
    reports: '/dashboard/reports',
  },
  stock: {
    list: '/stock',
    create: '/stock',
    update: (id: string) => `/stock/${id}`,
    delete: (id: string) => `/stock/${id}`,
    upload: '/stock/upload',
  },
  invoices: {
    create: '/invoices',
    list: '/invoices',
    get: (id: string) => `/invoices/${id}`,
    searchProducts: '/invoices/products/search',
  },
} as const;

