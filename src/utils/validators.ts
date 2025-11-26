import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const stockItemSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  sku: z.string().min(1, 'El SKU es requerido'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  quantity: z.number().min(0, 'La cantidad debe ser mayor o igual a 0'),
  unit: z.string().min(1, 'La unidad es requerida'),
  description: z.string().optional(),
  category: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type StockItemFormData = z.infer<typeof stockItemSchema>;

