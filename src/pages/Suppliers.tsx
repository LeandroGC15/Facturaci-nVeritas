import React, { useState } from 'react';
import { Supplier, CreateSupplierRequest } from '@/types/supplier';
import { CreatePurchaseRequest, PurchaseItemRequest } from '@/types/purchase';
import { useSuppliers, useCreateSupplier } from '@/hooks/supplier';
import { useCreatePurchase } from '@/hooks/purchase';
import { SupplierTable } from '@/components/supplier/SupplierTable';
import { SupplierForm } from '@/components/supplier/SupplierForm';
import { PurchaseModal } from '@/components/supplier/PurchaseModal';
import { Button } from '@/components/common/Button/Button';
import { Card } from '@/components/common/Card/Card';

const Suppliers: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [purchasingSupplier, setPurchasingSupplier] = useState<Supplier | null>(null);
  const [currentPage] = useState(1);

  const { suppliers, loading: suppliersLoading, error: suppliersError, refetch } = useSuppliers(currentPage);
  const { createSupplier, loading: createLoading, error: createError } = useCreateSupplier();
  const { createPurchase, loading: purchaseLoading, error: purchaseError } = useCreatePurchase();

  const handleCreateSupplier = async (data: CreateSupplierRequest) => {
    try {
      await createSupplier(data);
      setShowForm(false);
      refetch();
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(false);
  };

  const handleDelete = (supplier: Supplier) => {
    // TODO: Implement delete functionality
    console.log('Delete supplier:', supplier);
  };

  const handlePurchase = (supplier: Supplier) => {
    setPurchasingSupplier(supplier);
  };

  const handleCreatePurchase = async (supplierId: number, invoiceNumber: string, items: PurchaseItemRequest[]) => {
    try {
      const purchaseData: CreatePurchaseRequest = {
        supplierId,
        invoiceNumber,
        items,
      };

      await createPurchase(purchaseData);
      setPurchasingSupplier(null);
      // Optionally refresh suppliers or show success message
      alert('Compra creada exitosamente!');
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSupplier(null);
    setPurchasingSupplier(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proveedores</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gestiona los proveedores de tu empresa
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditingSupplier(null);
          }}
        >
          Nuevo Proveedor
        </Button>
      </div>

      {(showForm || editingSupplier) && (
        <SupplierForm
          supplier={editingSupplier || undefined}
          onSubmit={editingSupplier
            ? (data) => handleCreateSupplier(data) // TODO: Implement update
            : handleCreateSupplier
          }
          onCancel={handleCancel}
          loading={createLoading}
          error={createError || undefined}
        />
      )}

      <SupplierTable
        suppliers={suppliers}
        loading={suppliersLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onPurchase={handlePurchase}
      />

      {suppliersError && (
        <Card>
          <div className="bg-red-50 border border-red-200 text-red-200 text-red-700 px-4 py-3 rounded">
            Error al cargar proveedores: {suppliersError}
          </div>
        </Card>
      )}

      {purchasingSupplier && (
        <PurchaseModal
          supplier={purchasingSupplier}
          isOpen={!!purchasingSupplier}
          onClose={handleCancel}
          onSubmit={handleCreatePurchase}
          loading={purchaseLoading}
          error={purchaseError}
        />
      )}
    </div>
  );
};

export default Suppliers;