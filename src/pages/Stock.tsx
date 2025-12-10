import React, { useState } from 'react';
import { useStock } from '@/hooks/stock/useStock';
import { StockTable } from '@/components/stock/StockTable';
import { StockForm } from '@/components/stock/StockForm';
import { StockUpload } from '@/components/stock/StockUpload';
import { Card } from '@/components/common/Card/Card';
import { Button } from '@/components/common/Button/Button';
import { Loading } from '@/components/common/Loading/Loading';
import { StockItem, CreateStockItem } from '@/types/stock';
import { StockItemFormData } from '@/utils/validators';

export const Stock: React.FC = () => {
  const { items, isLoading, createItem, updateItem, deleteItem } = useStock();
  const [showForm, setShowForm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: StockItemFormData) => {
    setIsSubmitting(true);
    try {
      await createItem(data as CreateStockItem);
      setShowForm(false);
    } catch (error) {
      console.error('Error al crear producto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: StockItemFormData) => {
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      await updateItem({ ...data, id: editingItem.id });
      setEditingItem(undefined);
      setShowForm(false);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item: StockItem) => {
    setEditingItem(item);
    setShowForm(true);
    setShowUpload(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteItem(id);
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error al eliminar el producto');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(undefined);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Stock</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={() => setShowUpload(!showUpload)}
            className="w-full sm:w-auto"
          >
            {showUpload ? 'Ocultar' : 'Cargar'} Archivo
          </Button>
          <Button 
            onClick={() => { setShowForm(true); setShowUpload(false); setEditingItem(undefined); }}
            className="w-full sm:w-auto"
          >
            Nuevo Producto
          </Button>
        </div>
      </div>

      {showUpload && (
        <StockUpload />
      )}

      {showForm && (
        <Card title={editingItem ? 'Editar Producto' : 'Nuevo Producto'}>
          <StockForm
            item={editingItem}
            onSubmit={editingItem ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        </Card>
      )}

      <Card title="Productos en Stock">
        {isLoading ? (
          <Loading message="Cargando productos..." />
        ) : (
          <StockTable
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </Card>
    </div>
  );
};

