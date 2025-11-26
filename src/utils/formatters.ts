import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale/es';

export const formatters = {
  currency: (value: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
    }).format(value);
  },

  date: (date: string | Date, formatStr: string = 'dd/MM/yyyy'): string => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: es });
  },

  dateTime: (date: string | Date): string => {
    return formatters.date(date, 'dd/MM/yyyy HH:mm');
  },

  number: (value: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },
};

