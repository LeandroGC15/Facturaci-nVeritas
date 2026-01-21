import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateSupplierRequest, Supplier } from '@/types/supplier';
import { Input } from '@/components/common/Input/Input';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';

const supplierSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  rucNit: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  supplier?: Supplier;
  onSubmit: (data: CreateSupplierRequest) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
  supplier,
  onSubmit,
  onCancel,
  loading = false,
  error,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: supplier ? {
      name: supplier.name,
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
      rucNit: supplier.rucNit || '',
    } : {
      name: '',
      email: '',
      phone: '',
      address: '',
      rucNit: '',
    },
  });

  const onFormSubmit = async (data: SupplierFormData) => {
    const submitData: CreateSupplierRequest = {
      name: data.name,
      ...(data.email && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
      ...(data.address && { address: data.address }),
      ...(data.rucNit && { rucNit: data.rucNit }),
    };

    await onSubmit(submitData);
  };

  return (
    <Card>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">
          {supplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          {supplier
            ? 'Modifica los datos del proveedor'
            : 'Ingresa los datos del nuevo proveedor'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <Input
          label="Nombre *"
          {...register('name')}
          error={errors.name?.message}
          placeholder="Nombre del proveedor"
        />

        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="proveedor@email.com"
        />

        <Input
          label="Teléfono"
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="+1234567890"
        />

        <Input
          label="Dirección"
          {...register('address')}
          error={errors.address?.message}
          placeholder="Dirección completa"
        />

        <Input
          label="RUC/NIT"
          {...register('rucNit')}
          error={errors.rucNit?.message}
          placeholder="Número de identificación fiscal"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" isLoading={loading}>
            {supplier ? 'Actualizar' : 'Crear'} Proveedor
          </Button>
        </div>
      </form>
    </Card>
  );
};