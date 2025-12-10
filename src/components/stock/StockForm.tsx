import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { stockItemSchema, StockItemFormData } from '@/utils/validators';
import { StockItem } from '@/types/stock';
import { Input } from '@/components/common/Input/Input';
import { Button } from '@/components/common/Button/Button';

interface StockFormProps {
  item?: StockItem;
  onSubmit: (data: StockItemFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const StockForm: React.FC<StockFormProps> = ({
  item,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StockItemFormData>({
    resolver: zodResolver(stockItemSchema),
    defaultValues: item
      ? {
          name: item.name,
          sku: item.sku || '',
          price: item.price,
          stock: item.stock,
          description: item.description || '',
        }
      : undefined,
  });

  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        sku: item.sku || '',
        price: item.price,
        stock: item.stock,
        description: item.description || '',
      });
    }
  }, [item, reset]);

  const handleFormSubmit = async (data: StockItemFormData) => {
    await onSubmit(data);
    if (!item) {
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nombre del Producto"
          {...register('name')}
          error={errors.name?.message}
          placeholder="Ej: Producto XYZ"
        />
        <Input
          label="SKU"
          {...register('sku')}
          error={errors.sku?.message}
          placeholder="SKU-001 (opcional)"
        />
        <Input
          label="Precio"
          type="number"
          step="0.01"
          {...register('price', { valueAsNumber: true })}
          error={errors.price?.message}
          placeholder="0.00"
        />
        <Input
          label="Stock"
          type="number"
          {...register('stock', { valueAsNumber: true })}
          error={errors.stock?.message}
          placeholder="0"
        />
        <Input
          label="Descripción"
          {...register('description')}
          error={errors.description?.message}
          placeholder="Descripción (opcional)"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {item ? 'Actualizar' : 'Crear'} Producto
        </Button>
      </div>
    </form>
  );
};

