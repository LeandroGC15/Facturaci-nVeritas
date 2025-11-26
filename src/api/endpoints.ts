export const endpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
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
} as const;

