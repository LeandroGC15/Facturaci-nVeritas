import React from 'react';
import { Supplier } from '@/types/supplier';
import { Card } from '@/components/common/Card/Card';

interface SupplierTableProps {
  suppliers: Supplier[];
  loading?: boolean;
  onEdit?: (supplier: Supplier) => void;
  onDelete?: (supplier: Supplier) => void;
  onPurchase?: (supplier: Supplier) => void;
}

export const SupplierTable: React.FC<SupplierTableProps> = ({
  suppliers,
  loading = false,
  onEdit,
  onDelete,
  onPurchase,
}) => {
  if (loading) {
    return (
      <Card>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando proveedores...</span>
        </div>
      </Card>
    );
  }

  if (suppliers.length === 0) {
    return (
      <Card>
        <div className="text-center py-8 text-gray-500">
          No hay proveedores registrados
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                RUC/NIT
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {supplier.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {supplier.email || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {supplier.phone || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {supplier.rucNit || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onPurchase?.(supplier)}
                    className="text-green-600 hover:text-green-900 mr-4"
                  >
                    Comprar
                  </button>
                  <button
                    onClick={() => onEdit?.(supplier)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete?.(supplier)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};